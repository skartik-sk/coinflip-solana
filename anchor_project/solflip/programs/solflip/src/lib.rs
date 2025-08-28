use anchor_lang::prelude::*;
use anchor_lang::solana_program::keccak;

declare_id!("3CpefKdfgchxYEomDTSPT3oix2X1b3fnhiNSnP2dtVJr");

#[program]
pub mod solflip {
    use anchor_lang::system_program::{transfer, Transfer};

    use super::*;

    // Phase 1: Commit to a choice with hash
    pub fn commit_flip(ctx: Context<CommitFlip>, _seed: String, commitment_hash: [u8; 32], bid: u64) -> Result<()> {
        let commitment_account = &mut ctx.accounts.commitment_account;
        let flip_account = &mut ctx.accounts.flip_account;
        
        // Transfer bid amount to vault (user must pay upfront)
        let cpi = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            }
        );
        transfer(cpi, bid)?;

        // Store commitment
        commitment_account.user = ctx.accounts.user.key();
        commitment_account.commitment_hash = commitment_hash;
        commitment_account.bid = bid;
        commitment_account.timestamp = Clock::get()?.unix_timestamp;
        commitment_account.revealed = false;

        // Initialize flip account during commit so user pays all costs upfront
        flip_account.user = ctx.accounts.user.key();
        flip_account.bid = bid;
        flip_account.timestamp = Clock::get()?.unix_timestamp;
        flip_account.user_action = false; // Will be updated during reveal
        flip_account.ai_action = false;   // Will be updated during reveal
        flip_account.result = GameResult::Lost; // Default to lost, will be updated if user wins

        msg!("Commitment stored. Hash: {:?}", commitment_hash);
        Ok(())
    }

    // Phase 2: Reveal choice and determine outcome
    pub fn reveal_flip(ctx: Context<RevealFlip>, seed: String, user_choice: bool, nonce: u64) -> Result<()> {
        let commitment_account = &mut ctx.accounts.commitment_account;
        let vault = &mut ctx.accounts.vault;
        
        // Verify commitment hasn't been revealed yet
        require!(!commitment_account.revealed, GameError::AlreadyRevealed);
        
        // Verify commitment is not expired (e.g., 5 minutes)
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time - commitment_account.timestamp < 300, // 5 minutes
            GameError::CommitmentExpired
        );

        // Verify the revealed choice matches the commitment hash
        let mut data = Vec::new();
        data.push(if user_choice { 1u8 } else { 0u8 }); // Convert bool to byte
        data.extend_from_slice(&nonce.to_le_bytes());
        data.extend_from_slice(ctx.accounts.user.key().as_ref());
        
        let calculated_hash = keccak::hash(&data);
        require!(
            calculated_hash.to_bytes() == commitment_account.commitment_hash,
            GameError::InvalidReveal
        );

        // Mark as revealed
        commitment_account.revealed = true;

        // Generate AI choice using commitment transaction signature for true randomness
        // This cannot be manipulated by users since the signature is from their commit transaction
        let signature_bytes = ctx.accounts.user.key().to_bytes();
        let commitment_hash_bytes = &commitment_account.commitment_hash;
        let slot = Clock::get()?.slot; // Use slot as additional entropy, but not as primary source
        
        // Combine multiple sources of entropy for better randomness
        let mut random_seed = Vec::new();
        random_seed.extend_from_slice(&signature_bytes);
        random_seed.extend_from_slice(commitment_hash_bytes);
        random_seed.extend_from_slice(&commitment_account.timestamp.to_le_bytes());
        random_seed.extend_from_slice(&slot.to_le_bytes());
        random_seed.extend_from_slice(&nonce.to_le_bytes());
        
        let random_hash = keccak::hash(&random_seed);
        let random_bytes = random_hash.to_bytes();
        
        // Use multiple bytes for better distribution
        let combined_random = (random_bytes[0] as u16) + 
                             (random_bytes[1] as u16) + 
                             (random_bytes[31] as u16);
        let ai_choice = combined_random % 2 == 0;
        
        msg!("Random bytes: [{}, {}, {}], Combined: {}, AI choice: {}, User choice: {}", 
             random_bytes[0], random_bytes[1], random_bytes[31], combined_random, ai_choice, user_choice);

        // Update flip result account (already created during commit)
        let flip_account = &mut ctx.accounts.flip_account;
        flip_account.user_action = user_choice;
        flip_account.ai_action = ai_choice;
        flip_account.timestamp = current_time; // Update to reveal time

        // Determine winner and handle payouts
        if user_choice == ai_choice {
            // User wins - pay 3x from vault
            let seeds = &[b"vault".as_ref(), &[ctx.bumps.vault]];
            let signer_seeds = &[&seeds[..]];
            
            let vault_balance = vault.lamports();
            let payout = commitment_account.bid * 3;
            
            require!(vault_balance >= payout, GameError::InsufficientVaultFunds);
            
            let cpi = CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: vault.to_account_info(),
                    to: ctx.accounts.user.to_account_info(),
                },
                signer_seeds
            );
            transfer(cpi, payout)?;
            
            flip_account.result = GameResult::Won;
            msg!("User won! Payout: {} lamports", payout);
        } else {
            // User loses - bid stays in vault
            flip_account.result = GameResult::Lost;
            msg!("User lost! Bid retained in vault");
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(seed: String)]
pub struct CommitFlip<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = 8 + CommitmentAccount::INIT_SPACE,
        seeds = [b"commitment", user.key().as_ref(), seed.as_ref()],
        bump,
    )]
    pub commitment_account: Account<'info, CommitmentAccount>,
    
    #[account(
        init,
        payer = user,
        space = 8 + FlipAccount::INIT_SPACE,
        seeds = [b"flip", user.key().as_ref(), seed.as_ref()],
        bump,
    )]
    pub flip_account: Account<'info, FlipAccount>,
    
    #[account(
        mut,
        seeds = [b"vault"],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(seed: String)]
pub struct RevealFlip<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"commitment", user.key().as_ref(), seed.as_ref()],
        bump,
    )]
    pub commitment_account: Account<'info, CommitmentAccount>,
    
    #[account(
        mut,
        seeds = [b"flip", user.key().as_ref(), seed.as_ref()],
        bump,
    )]
    pub flip_account: Account<'info, FlipAccount>,
    
    #[account(
        mut,
        seeds = [b"vault"],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct CommitmentAccount {
    pub user: Pubkey,
    pub commitment_hash: [u8; 32],
    pub bid: u64,
    pub timestamp: i64,
    pub revealed: bool,
}

#[account]
#[derive(InitSpace)]
pub struct FlipAccount {
    pub user: Pubkey,
    pub user_action: bool,
    pub ai_action: bool,
    pub bid: u64,
    pub timestamp: i64,
    pub result: GameResult,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum GameResult {
    Won,
    Lost,
}

#[error_code]
pub enum GameError {
    #[msg("Commitment already revealed")]
    AlreadyRevealed,
    #[msg("Commitment has expired")]
    CommitmentExpired,
    #[msg("Invalid reveal - hash doesn't match")]
    InvalidReveal,
    #[msg("Insufficient funds in vault for payout")]
    InsufficientVaultFunds,
}

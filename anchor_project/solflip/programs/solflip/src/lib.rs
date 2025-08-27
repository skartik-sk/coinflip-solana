use anchor_lang::prelude::*;

declare_id!("3CpefKdfgchxYEomDTSPT3oix2X1b3fnhiNSnP2dtVJr");

#[program]
pub mod solflip {
    use anchor_lang::system_program::{transfer, Transfer, TransferWithSeed};

    use super::*;

    pub fn flip(ctx: Context<Flip>, _seed: String,user_action: bool,bid:u64) -> Result<()> {
        let ai_action : bool;
        let vault= &mut ctx.accounts.vault;
        let treasure = vault.lamports();

        if treasure <= 3*bid {
            ai_action = !user_action;
           let cpi = CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer{
                from: ctx.accounts.user.to_account_info(),
                to: vault.to_account_info(),
            });
            transfer(cpi, bid)?;
             ctx.accounts.flip_account.set_inner(FlipAccount { user: ctx.accounts.user.key(), user_action, ai_action, bid });
msg!({
    "lost"
});
        } 
        else{
           let random_number = Clock::get()?.unix_timestamp % 2;
              ai_action = random_number == 0;
           if user_action == ai_action {

               
                       let seeds = &[b"vault".as_ref(), &[ctx.bumps.vault]];
               
                       let signer_seed = &[&seeds[..]];
            let cpi = CpiContext::new_with_signer(ctx.accounts.system_program.to_account_info(), Transfer{
                from: vault.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },signer_seed);



        transfer(cpi, 3*bid)?;

             ctx.accounts.flip_account.set_inner(FlipAccount { user: ctx.accounts.user.key(), user_action, ai_action, bid });

               msg!({
                   "won"
               });
           } else {
            let cpi = CpiContext::new(ctx.accounts.system_program.to_account_info(), Transfer{
                from: ctx.accounts.user.to_account_info(),
                to: vault.to_account_info(),
            });
            transfer(cpi, bid)?;
             ctx.accounts.flip_account.set_inner(FlipAccount { user: ctx.accounts.user.key(), user_action, ai_action, bid });

               msg!({
                   "lost"
               });
           }

        }

     

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(seed:String)]
pub struct Flip<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer= user,
        space= 8 + FlipAccount::INIT_SPACE,
        seeds= [b"flip", user.key().as_ref(),seed.as_ref()],
        bump,

    )]
    pub flip_account: Account<'info, FlipAccount>,


#[account(
        mut,
        seeds= [b"vault"],
        bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}


// 0- head 
// 1- tail


#[account]
#[derive(InitSpace)]
pub struct FlipAccount {
    pub user: Pubkey, 
    pub user_action: bool, 
    pub ai_action: bool,
    pub bid: u64,
}

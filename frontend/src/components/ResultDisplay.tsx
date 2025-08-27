import type { FlipResult } from '../hooks/useSolflipProgram'

interface ResultDisplayProps {
  result: FlipResult | null
  isVisible: boolean
}

export function ResultDisplay({ result, isVisible }: ResultDisplayProps) {
  if (!result || !isVisible) return null

  const userChoiceText = result.userChoice ? 'Tails' : 'Heads'
  const aiChoiceText = result.aiChoice ? 'Tails' : 'Heads'

  return (
    <div className="glass-card p-6 mt-6 max-w-md mx-auto animate-flip-in">
      <div className="text-center space-y-4">
        {/* Result Header */}
        <div className={`text-2xl font-bold ${result.userWon ? 'text-green-400' : 'text-red-400'}`}>
          {result.userWon ? '🎉 You Won!' : '😔 You Lost!'}
        </div>

        {/* Choices Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <div className="text-sm text-blue-300 mb-1">Your Choice</div>
            <div className={`text-lg font-semibold ${result.userChoice ? 'result-tails' : 'result-heads'}`}>
              {userChoiceText}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <div className="text-sm text-purple-300 mb-1">AI Choice</div>
            <div className={`text-lg font-semibold ${result.aiChoice ? 'result-tails' : 'result-heads'}`}>
              {aiChoiceText}
            </div>
          </div>
        </div>

        {/* Payout Information */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Bid Amount:</span>
            <span className="text-white">{result.bidAmount.toFixed(3)} SOL</span>
          </div>
          {result.userWon ? (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Winnings:</span>
              <span className="text-green-400 font-semibold">+{(result.bidAmount * 3).toFixed(3)} SOL</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Lost:</span>
              <span className="text-red-400 font-semibold">-{result.bidAmount.toFixed(3)} SOL</span>
            </div>
          )}
        </div>

        {/* Transaction Info */}
        <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <span>Transaction:</span>
            <span className="font-mono">{result.signature.slice(0, 12)}...{result.signature.slice(-4)}</span>
          </div>
          {result.vaultBalance !== undefined && (
            <div className="flex items-center justify-between mt-1">
              <span>Vault Balance:</span>
              <span>{result.vaultBalance.toFixed(3)} SOL</span>
            </div>
          )}
        </div>

        {/* Program Logs (for debugging) */}
        {process.env.NODE_ENV === 'development' && result.logs && (
          <details className="text-left">
            <summary className="text-xs text-gray-500 cursor-pointer">Program Logs</summary>
            <div className="mt-2 text-xs font-mono bg-black/50 p-2 rounded max-h-32 overflow-y-auto">
              {result.logs.map((log, index) => (
                <div key={index} className="text-gray-400">
                  {log}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

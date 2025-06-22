"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Coins, Trophy, Zap } from "lucide-react"
import { useFarcasterContext } from "../hooks/use-farcaster-context"
import { SpinWheel } from "../components/spin-wheel"
import { WalletConnection } from "../components/wallet-connection"
import { useSpinTransaction } from "../components/spin-transaction"

export default function SpinGamePage() {
  const { user, isLoading, error, isInFrame } = useFarcasterContext()
  const { processSpinPayment, isProcessing } = useSpinTransaction()
  const [points, setPoints] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastResult, setLastResult] = useState<string | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)

  const handleSpin = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first!")
      return
    }

    setIsSpinning(true)
    setLastResult(null)

    try {
      // Process DEGEN payment
      const paymentSuccess = await processSpinPayment()

      if (!paymentSuccess) {
        alert("Payment failed! Please try again.")
        setIsSpinning(false)
        return
      }

      // Simulate spin delay
      setTimeout(() => {
        const outcomes = [
          { type: "zonk", message: "Better luck next time! 🎭", points: 0, probability: 0.6 },
          { type: "points", message: "You won 10 points! 🎉", points: 10, probability: 0.25 },
          { type: "points", message: "You won 25 points! 🎊", points: 25, probability: 0.1 },
          { type: "monad", message: "MONAD Token! 🚀", points: 50, probability: 0.05 },
        ]

        const random = Math.random()
        let cumulative = 0
        let result = outcomes[0]

        for (const outcome of outcomes) {
          cumulative += outcome.probability
          if (random <= cumulative) {
            result = outcome
            break
          }
        }

        setLastResult(result.message)
        setPoints((prev) => prev + result.points)
        setIsSpinning(false)
      }, 3000)
    } catch (error) {
      console.error("Spin error:", error)
      alert("Something went wrong! Please try again.")
      setIsSpinning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Farcaster context...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      {/* Header */}
      <header className="p-4 border-b border-blue-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Monad Spin</h1>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <img src={user.pfpUrl || "/placeholder.svg"} alt={user.displayName} className="w-8 h-8 rounded-full" />
              <span className="text-sm">{user.displayName}</span>
              <Badge variant="secondary" className="bg-blue-600">
                <Coins className="w-4 h-4 mr-1" />
                {points} pts
              </Badge>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {error && (
          <Card className="bg-red-900/50 border-red-700">
            <CardContent className="p-4">
              <p className="text-red-200">{error}</p>
            </CardContent>
          </Card>
        )}

        {!isInFrame && (
          <Card className="bg-yellow-900/50 border-yellow-700">
            <CardContent className="p-4">
              <p className="text-yellow-200">
                ⚠️ This app is designed to run within Farcaster frames. Some features may not work correctly.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Wallet Connection */}
        <WalletConnection onConnectionChange={setWalletConnected} isConnected={walletConnected} />

        {/* Game Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Spin Wheel */}
          <Card className="bg-blue-800/50 border-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Spin to Win!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SpinWheel isSpinning={isSpinning} />

              <Button
                onClick={handleSpin}
                disabled={isSpinning || !walletConnected || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                size="lg"
              >
                {isProcessing
                  ? "Processing Payment..."
                  : isSpinning
                    ? "Spinning..."
                    : "Spin Now! (100 DEGEN + 0.001 MON)"}
              </Button>

              {lastResult && (
                <div className="text-center p-3 bg-blue-700/50 rounded-lg">
                  <p className="text-lg font-semibold">{lastResult}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Info */}
          <Card className="bg-blue-800/50 border-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Game Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>🎭 Zonk (60%)</span>
                  <span>0 points</span>
                </div>
                <div className="flex justify-between">
                  <span>🎉 Small Win (25%)</span>
                  <span>10 points</span>
                </div>
                <div className="flex justify-between">
                  <span>🎊 Big Win (10%)</span>
                  <span>25 points</span>
                </div>
                <div className="flex justify-between">
                  <span>🚀 MONAD (5%)</span>
                  <span>50 points + Token!</span>
                </div>
              </div>

              <div className="pt-3 border-t border-blue-600">
                <p className="text-xs text-blue-200">
                  Each spin costs 100 DEGEN tokens + 0.001 MON on Monad testnet. DEGEN payment goes to game treasury.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <Card className="bg-blue-800/50 border-blue-600">
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-300">{points}</div>
                <div className="text-sm text-blue-200">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-300">0</div>
                <div className="text-sm text-blue-200">Spins Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-300">0</div>
                <div className="text-sm text-blue-200">MONAD Tokens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-300">#{user?.fid || "---"}</div>
                <div className="text-sm text-blue-200">Player ID</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

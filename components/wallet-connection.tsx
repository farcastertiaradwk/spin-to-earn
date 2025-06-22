"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle, AlertCircle, Coins } from "lucide-react"

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean) => void
  isConnected: boolean
}

// DEGEN token contract address (Base network)
const DEGEN_CONTRACT_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"

// Monad testnet configuration
const MONAD_TESTNET_CONFIG = {
  chainId: "0x29A", // 666 in hex (Monad testnet)
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet-explorer.monad.xyz"],
}

export function WalletConnection({ onConnectionChange, isConnected }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [degenBalance, setDegenBalance] = useState<string>("0")
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const getDegenBalance = async (address: string) => {
    setIsLoadingBalance(true)
    try {
      // ERC-20 balanceOf function call
      const balanceCall = await window.ethereum.request({
        method: "eth_call",
        params: [
          {
            to: DEGEN_CONTRACT_ADDRESS,
            data: `0x70a08231000000000000000000000000${address.slice(2)}`, // balanceOf(address)
          },
          "latest",
        ],
      })

      // Convert hex to decimal and format
      const balance = Number.parseInt(balanceCall, 16)
      const formattedBalance = (balance / Math.pow(10, 18)).toFixed(2)
      setDegenBalance(formattedBalance)
    } catch (err) {
      console.error("Error fetching DEGEN balance:", err)
      setDegenBalance("0")
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your wallet.")
      }

      // Check current network
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      // First connect to Base for DEGEN balance, then switch to Monad testnet
      if (chainId !== "0x2105") {
        // Base mainnet chain ID
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x2105" }],
          })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x2105",
                  chainName: "Base",
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://mainnet.base.org"],
                  blockExplorerUrls: ["https://basescan.org"],
                },
              ],
            })
          } else {
            throw switchError
          }
        }
      }

      const address = accounts[0]
      setWalletAddress(address)

      // Get DEGEN balance from Base network
      await getDegenBalance(address)

      // Now switch to Monad testnet for game transactions
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_TESTNET_CONFIG],
          })
        } else {
          throw switchError
        }
      }

      onConnectionChange(true)
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
      onConnectionChange(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setDegenBalance("0")
    onConnectionChange(false)
    setError(null)
  }

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setWalletAddress(accounts[0])
          if (accounts[0]) {
            getDegenBalance(accounts[0])
          }
          onConnectionChange(true)
        }
      }

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [onConnectionChange])

  return (
    <Card className="bg-blue-800/50 border-blue-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-3">
            <p className="text-sm text-blue-200">
              Connect your wallet to start spinning with DEGEN tokens on Monad testnet.
            </p>

            <Button onClick={connectWallet} disabled={isConnecting} className="w-full bg-blue-600 hover:bg-blue-700">
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-green-400">Wallet Connected</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-200">Address:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ""}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-200">Network:</span>
                <Badge className="bg-purple-600">Monad Testnet</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-200">DEGEN Balance:</span>
                <Badge className="bg-orange-600 flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  {isLoadingBalance ? "..." : `${degenBalance} DEGEN`}
                </Badge>
              </div>
            </div>

            <Button
              onClick={disconnectWallet}
              variant="outline"
              size="sm"
              className="w-full border-blue-600 text-blue-200 hover:bg-blue-700"
            >
              Disconnect
            </Button>
          </div>
        )}

        <div className="pt-3 border-t border-blue-600">
          <p className="text-xs text-blue-300">💡 You need DEGEN tokens on Base network. Game runs on Monad testnet.</p>
        </div>
      </CardContent>
    </Card>
  )
}

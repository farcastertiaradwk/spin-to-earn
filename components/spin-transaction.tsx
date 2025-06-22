"use client"

import { useState } from "react"

// DEGEN token contract ABI (minimal for transfer)
const DEGEN_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
]

const DEGEN_CONTRACT_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
const RECIPIENT_WALLET = "0xCC5552a28C2AA0AaE2B09826311900b466AebA65"
const SPIN_COST_DEGEN = "100" // 100 DEGEN per spin

export function useSpinTransaction() {
  const [isProcessing, setIsProcessing] = useState(false)

  const processSpinPayment = async (): Promise<boolean> => {
    setIsProcessing(true)

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask not found")
      }

      // First, switch to Base network to handle DEGEN transfer
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2105" }], // Base mainnet
      })

      // Convert DEGEN amount to wei (18 decimals)
      const amountInWei = (Number.parseFloat(SPIN_COST_DEGEN) * Math.pow(10, 18)).toString(16)

      // Create transfer transaction data
      const transferData = `0xa9059cbb000000000000000000000000${RECIPIENT_WALLET.slice(2)}${amountInWei.padStart(64, "0")}`

      // Send DEGEN transfer transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: (await window.ethereum.request({ method: "eth_accounts" }))[0],
            to: DEGEN_CONTRACT_ADDRESS,
            data: transferData,
            gas: "0x5208", // 21000 gas limit
          },
        ],
      })

      console.log("DEGEN transfer transaction:", txHash)

      // Switch back to Monad testnet for game logic
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x29A" }], // Monad testnet
      })

      // Send a small transaction on Monad testnet for game fee
      const monadTxHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: (await window.ethereum.request({ method: "eth_accounts" }))[0],
            to: RECIPIENT_WALLET,
            value: "0x2386F26FC10000", // 0.001 MON in wei
            gas: "0x5208",
          },
        ],
      })

      console.log("Monad testnet transaction:", monadTxHash)

      return true
    } catch (error) {
      console.error("Payment processing error:", error)
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return { processSpinPayment, isProcessing }
}

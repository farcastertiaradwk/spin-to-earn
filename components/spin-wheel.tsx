"use client"

import { useEffect, useState } from "react"

interface SpinWheelProps {
  isSpinning: boolean
}

export function SpinWheel({ isSpinning }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (isSpinning) {
      // Generate random rotation between 1080 and 2160 degrees (3-6 full rotations)
      const randomRotation = 1080 + Math.random() * 1080
      setRotation((prev) => prev + randomRotation)
    }
  }, [isSpinning])

  const segments = [
    { label: "🎭 Zonk", color: "bg-red-500", angle: 216 }, // 60%
    { label: "🎉 10pts", color: "bg-green-500", angle: 90 }, // 25%
    { label: "🎊 25pts", color: "bg-blue-500", angle: 36 }, // 10%
    { label: "🚀 MONAD", color: "bg-yellow-500", angle: 18 }, // 5%
  ]

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-64 h-64">
        {/* Wheel Container */}
        <div className="relative w-full h-full">
          {/* Wheel */}
          <div
            className={`w-full h-full rounded-full border-8 border-white shadow-2xl transition-transform duration-3000 ease-out relative overflow-hidden`}
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(
                from 0deg,
                #ef4444 0deg 216deg,
                #22c55e 216deg 306deg,
                #3b82f6 306deg 342deg,
                #eab308 342deg 360deg
              )`,
            }}
          >
            {/* Segment Labels */}
            <div className="absolute inset-0">
              {/* Zonk - 60% (216 degrees) */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-white font-bold text-sm"
                style={{ transform: "rotate(108deg)" }}
              >
                <span style={{ transform: "rotate(-108deg)" }}>🎭 ZONK</span>
              </div>

              {/* 10pts - 25% (90 degrees) */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-white font-bold text-sm"
                style={{ transform: "rotate(261deg)" }}
              >
                <span style={{ transform: "rotate(-261deg)" }}>🎉 10pts</span>
              </div>

              {/* 25pts - 10% (36 degrees) */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-white font-bold text-sm"
                style={{ transform: "rotate(324deg)" }}
              >
                <span style={{ transform: "rotate(-324deg)" }}>🎊 25pts</span>
              </div>

              {/* MONAD - 5% (18 degrees) */}
              <div
                className="absolute w-full h-full flex items-center justify-center text-black font-bold text-xs"
                style={{ transform: "rotate(351deg)" }}
              >
                <span style={{ transform: "rotate(-351deg)" }}>🚀 MONAD</span>
              </div>
            </div>
          </div>

          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-gray-800 z-10"></div>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
        </div>
      </div>

      {/* Spinning indicator */}
      {isSpinning && (
        <div className="text-center">
          <div className="animate-pulse text-yellow-400 font-semibold">🎰 Spinning...</div>
        </div>
      )}
    </div>
  )
}

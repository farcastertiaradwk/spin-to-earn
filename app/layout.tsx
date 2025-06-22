import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FarcasterProvider } from "../hooks/use-farcaster-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Monad Spin - Farcaster Mini App",
  description: "Spin to win MONAD tokens and points with DEGEN! A fun gambling game on Monad testnet.",
  openGraph: {
    title: "Monad Spin Game",
    description: "Spin to win MONAD tokens and points with DEGEN!",
    images: [
      {
        url: "/frame-image.png",
        width: 1200,
        height: 630,
        alt: "Monad Spin Game",
      },
    ],
  },
  other: {
    // Farcaster Frame metadata
    "fc:frame": "vNext",
    "fc:frame:image": "/frame-image.png",
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "🎰 Play Spin Game",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "/",
    "fc:frame:post_url": "/api/frame",

    // Mini app metadata
    "farcaster:frame:version": "1",
    "farcaster:frame:name": "Monad Spin",
    "farcaster:frame:icon": "/icon.png",
    "farcaster:frame:home_url": "/",
    "farcaster:frame:image_url": "/frame-image.png",
    "farcaster:frame:button_title": "Play Now",
    "farcaster:frame:splash_image_url": "/splash.png",
    "farcaster:frame:splash_background_color": "#1e3a8a",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />

        {/* Farcaster Frame Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="/frame-image.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🎰 Play Spin Game" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="/" />
        <meta property="fc:frame:post_url" content="/api/frame" />

        {/* Mini App specific tags */}
        <meta name="farcaster:frame:version" content="1" />
        <meta name="farcaster:frame:name" content="Monad Spin" />
        <meta name="farcaster:frame:icon" content="/icon.png" />
        <meta name="farcaster:frame:home_url" content="/" />
        <meta name="farcaster:frame:image_url" content="/frame-image.png" />
        <meta name="farcaster:frame:button_title" content="Play Now" />
        <meta name="farcaster:frame:splash_image_url" content="/splash.png" />
        <meta name="farcaster:frame:splash_background_color" content="#1e3a8a" />
      </head>
      <body className={inter.className}>
        <FarcasterProvider>{children}</FarcasterProvider>
      </body>
    </html>
  )
}

import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate Farcaster frame message
    const { untrustedData, trustedData } = body

    if (!untrustedData || !trustedData) {
      return NextResponse.json({ error: "Invalid frame data" }, { status: 400 })
    }

    // Extract user data from frame
    const { fid, messageHash, network, timestamp } = trustedData
    const { buttonIndex, castId, inputText, state, url } = untrustedData

    // Log frame interaction
    console.log("Frame interaction:", {
      fid,
      buttonIndex,
      timestamp,
      url,
    })

    // Return frame response
    const frameResponse = {
      image: "/frame-image.png",
      buttons: [
        {
          label: "🎰 Play Now",
          action: "link",
          target: "/",
        },
      ],
      post_url: "/api/frame",
      aspect_ratio: "1.91:1",
    }

    return NextResponse.json(frameResponse)
  } catch (error) {
    console.error("Frame API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  // Return frame metadata for GET requests
  return NextResponse.json({
    name: "Monad Spin Game",
    icon: "/icon.png",
    description: "Spin to win MONAD tokens with DEGEN!",
    homeUrl: "/",
    imageUrl: "/frame-image.png",
  })
}

import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle Farcaster webhook events
    const { type, data } = body

    console.log("Webhook received:", { type, data })

    switch (type) {
      case "frame.added":
        console.log("Frame added to user's collection")
        break
      case "frame.removed":
        console.log("Frame removed from user's collection")
        break
      case "notification.created":
        console.log("Notification created")
        break
      default:
        console.log("Unknown webhook type:", type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

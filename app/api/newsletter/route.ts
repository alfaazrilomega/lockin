import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Missing email address" }, { status: 400 })
    }

    const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error("Missing Gmail credentials in environment variables.")
      return NextResponse.json({ error: "Server email configuration error" }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    })

    const mailOptions = {
      from: `"LockIn" <${GMAIL_USER}>`,
      to: email,
      subject: "Welcome to LockIn Newsletter!",
      text: `Hello!

Thanks for subscribing to LockIn. We're excited to have you on board!

By joining our network, you will begin receiving notifications directly to this inbox when:
- Your AI-generated workspaces and agents finish their tasks.
- A project reaches its completion milestone.
- You are invited to join a new team or workspace.
- Important analytical insights are generated from your Data Boards.

Stay tuned for more updates, and welcome to the definitive productivity workspace.

Best,
The LockIn Team`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Subscription successful" })
  } catch (error) {
    console.error("Error sending newsletter email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
      from: `"${name} (LockIn Contact)" <${GMAIL_USER}>`,
      to: "alfajriazril1@gmail.com",
      replyTo: email,
      subject: `New Message from ${name} on LockIn`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending contact email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

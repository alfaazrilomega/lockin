import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, projectType, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 })
    }

    // TODO: wire up to actual database when Prisma config is updated
    console.log('Contact submission:', { name, email, company, projectType, message })
    return NextResponse.json({ success: true, id: `temp-${Date.now()}` }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}

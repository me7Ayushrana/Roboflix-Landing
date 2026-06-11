import { NextResponse } from "next/server"
import { supabase, getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    // ─── Webhook Secret Authorization Check ────────────────────────────────
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (webhookSecret) {
      const clientSecret = req.headers.get("x-webhook-secret")
      if (clientSecret !== webhookSecret) {
        return NextResponse.json({ error: "Unauthorized webhook request" }, { status: 401 })
      }
    }

    const body = await req.json()
    const { email, phone } = body

    if (!email || !phone) {
      return NextResponse.json({ error: "Email and phone/mobile number are required" }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPhone = phone.trim()

    // Create user object for local testing sync
    const newUser = {
      email: trimmedEmail,
      phone: trimmedPhone,
      status: "Active",
      tier: "Free Trial"
    }

    let savedInSupabase = false

    if (isSupabaseConfigured()) {
      try {
        // Use server-side admin client (bypasses RLS) if service role key is present
        const dbClient = getSupabaseAdmin() || supabase
        const { error } = await dbClient
          .from("roboflix_lms_users")
          .upsert([
            {
              email: trimmedEmail,
              phone: trimmedPhone,
              status: "Active",
              tier: "Free Trial"
            }
          ], { onConflict: "email" })

        if (!error) {
          savedInSupabase = true
        } else {
          console.error("Supabase insert error:", error)
          // If insert fails due to constraint, we will return the error so they know they need to run the SQL migration
          return NextResponse.json({ 
            error: "Supabase table insert failed. If this is a check constraint issue, make sure to execute the SQL migration to allow 'Free Trial' in the 'tier' column.", 
            details: error.message 
          }, { status: 500 })
        }
      } catch (err: any) {
        console.error("Supabase operation exception:", err)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Credentials successfully created for Free Trial account.",
      savedInSupabase,
      user: newUser
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import Company from "@/models/Company"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find company by email
    const company = await Company.findOne({ email: email.toLowerCase() })
    if (!company) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, company.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Remove password from response
    const companyResponse = company.toObject()
    delete companyResponse.password

    return NextResponse.json({
      message: "Login successful",
      company: companyResponse,
    })
  } catch (error: any) {
    console.error("Corporate login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

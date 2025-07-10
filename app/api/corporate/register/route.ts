import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import Company from "@/models/Company"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { companyName, email, password, industry, companySize, contactPerson, phone, website, address } = body

    // Validation
    if (!companyName || !email || !password || !industry || !companySize || !contactPerson || !phone || !address) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ email: email.toLowerCase() })
    if (existingCompany) {
      return NextResponse.json({ error: "Company already exists with this email" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create company
    const company = new Company({
      companyName,
      email: email.toLowerCase(),
      password: hashedPassword,
      industry,
      companySize,
      contactPerson,
      phone,
      website: website || undefined,
      address,
      subscription: {
        plan: "free",
        employeeLimit: 5,
        qrCodeLimit: 50,
        qrCodesGenerated: 0,
        isActive: true,
        startDate: new Date(),
      },
      branding: {
        primaryColor: "#0077C0",
        secondaryColor: "#FFFFFF",
        logo: "",
      },
      status: "active",
    })

    await company.save()

    // Remove password from response
    const companyResponse = company.toObject()
    delete companyResponse.password

    return NextResponse.json({
      message: "Company registered successfully",
      company: companyResponse,
    })
  } catch (error: any) {
    console.error("Corporate registration error:", error)

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({ error: "Company already exists with this email" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

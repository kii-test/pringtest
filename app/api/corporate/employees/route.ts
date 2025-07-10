import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Employee from "@/models/Employee"
import Company from "@/models/Company"
import mongoose from "mongoose"
import QRCode from "qrcode"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return NextResponse.json({ error: "Invalid company ID" }, { status: 400 })
    }

    const employees = await Employee.find({ companyId: new mongoose.Types.ObjectId(companyId) }).sort({ createdAt: -1 })

    return NextResponse.json({
      employees: employees.map((emp) => emp.toObject()),
    })
  } catch (error) {
    console.error("Employees fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      companyId,
      employeeId,
      firstName,
      lastName,
      email,
      mobile,
      dateOfBirth,
      gender,
      department,
      position,
      employeeType,
      startDate,
      manager,
    } = body

    // Validation
    if (!companyId || !employeeId || !firstName || !lastName || !email || !mobile) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return NextResponse.json({ error: "Invalid company ID" }, { status: 400 })
    }

    // Check if company exists and has capacity
    const company = await Company.findById(companyId)
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    // Check employee limit
    const currentEmployeeCount = await Employee.countDocuments({ companyId: new mongoose.Types.ObjectId(companyId) })
    if (currentEmployeeCount >= company.subscription.employeeLimit) {
      return NextResponse.json(
        {
          error: `Employee limit reached. Current plan allows ${company.subscription.employeeLimit} employees.`,
        },
        { status: 400 },
      )
    }

    // Check if employee ID already exists for this company
    const existingEmployee = await Employee.findOne({
      companyId: new mongoose.Types.ObjectId(companyId),
      employeeId,
    })
    if (existingEmployee) {
      return NextResponse.json({ error: "Employee ID already exists" }, { status: 409 })
    }

    // Check if email already exists for this company (to ensure QR code linking)
    const existingEmailEmployee = await Employee.findOne({
      companyId: new mongoose.Types.ObjectId(companyId),
      "personalInfo.email": email,
    })
    if (existingEmailEmployee) {
      return NextResponse.json({ error: "Employee with this email already exists" }, { status: 409 })
    }

    // Generate QR code for employee - linked to official email
    const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/corporate/employee/${companyId}/${employeeId}?email=${encodeURIComponent(email)}`
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: company.branding.primaryColor || "#0077C0",
        light: "#FFFFFF",
      },
    })

    // Create employee
    const employee = new Employee({
      companyId: new mongoose.Types.ObjectId(companyId),
      employeeId,
      personalInfo: {
        firstName,
        lastName,
        email, // Official company email - QR code is linked to this
        mobile,
        dateOfBirth: new Date(dateOfBirth),
        gender,
      },
      workInfo: {
        department,
        position,
        employeeType,
        startDate: new Date(startDate),
        manager: manager || undefined,
      },
      qrCode: qrCodeDataUrl,
      qrCodeStats: {
        totalScans: 0,
        uniqueScans: 0,
      },
      status: "active",
      // Link QR code to official email for security
      linkedEmail: email,
    })

    await employee.save()

    // Update company QR codes generated count
    await Company.findByIdAndUpdate(companyId, {
      $inc: { "subscription.qrCodesGenerated": 1 },
    })

    return NextResponse.json({
      message: "Employee added successfully. QR code is linked to official email address.",
      employee: employee.toObject(),
    })
  } catch (error: any) {
    console.error("Employee creation error:", error)

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({ error: "Employee with this ID or email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

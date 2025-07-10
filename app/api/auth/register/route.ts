import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, email, mobile, password, dateOfBirth, gender, typeOfWork } = body

    // Validation
    if (!password || !email || !mobile || !name || !typeOfWork) {
      return NextResponse.json(
        { error: "Name, email, mobile, password, and type of work are required" },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email or mobile number" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
      gender: gender || "prefer-not-to-say",
      typeOfWork,
    })

    await user.save()

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json({
      message: "User created successfully",
      user: userResponse,
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({ error: "User already exists with this email or mobile number" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

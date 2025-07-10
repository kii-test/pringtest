import mongoose, { type Document, Schema } from "mongoose"

export interface ICompany extends Document {
  _id: string
  companyName: string
  companyEmail: string
  companyPhone: string
  industry: string
  companySize: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    companyWebsite?: string
  }
  subscription: {
    plan: "free" | "basic" | "premium" | "enterprise"
    employeeLimit: number
    qrCodesGenerated: number
    qrCodeLimit: number
    expiresAt?: Date
  }
  adminUser: {
    name: string
    email: string
    password: string
    role: "super_admin" | "admin"
  }
  paymentInfo?: {
    provider: "razorpay" | "stripe" | "payu"
    paymentId: string
    orderId: string
    amount: number
    currency: string
    status: "pending" | "completed" | "failed" | "refunded"
    paidAt?: Date
  }
  settings: {
    requireApproval: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    analyticsEnabled: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const CompanySchema = new Schema<ICompany>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      enum: [
        "technology",
        "healthcare",
        "finance",
        "education",
        "retail",
        "manufacturing",
        "construction",
        "hospitality",
        "other",
      ],
    },
    companySize: {
      type: String,
      required: true,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    branding: {
      logo: String,
      primaryColor: { type: String, default: "#0077C0" },
      secondaryColor: { type: String, default: "#434343" },
      companyWebsite: String,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium", "enterprise"],
        default: "free",
      },
      employeeLimit: { type: Number, default: 5 },
      qrCodesGenerated: { type: Number, default: 0 },
      qrCodeLimit: { type: Number, default: 50 },
      expiresAt: Date,
    },
    adminUser: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      role: {
        type: String,
        enum: ["super_admin", "admin"],
        default: "admin",
      },
    },
    paymentInfo: {
      provider: {
        type: String,
        enum: ["razorpay", "stripe", "payu"],
      },
      paymentId: String,
      orderId: String,
      amount: Number,
      currency: String,
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      paidAt: Date,
    },
    settings: {
      requireApproval: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      analyticsEnabled: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema)

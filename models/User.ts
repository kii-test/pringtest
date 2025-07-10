import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },
    typeOfWork: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    customLinks: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    qrCode: {
      type: String,
      default: "",
    },
    qrCodeStats: {
      totalScans: { type: Number, default: 0 },
      uniqueScans: { type: Number, default: 0 },
      lastScanned: { type: Date },
    },
    privacySettings: {
      requireApproval: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
UserSchema.index({ email: 1 })
UserSchema.index({ mobile: 1 })
UserSchema.index({ typeOfWork: 1 })

export default mongoose.models.User || mongoose.model("User", UserSchema)

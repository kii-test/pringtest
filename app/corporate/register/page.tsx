"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CorporateRegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    industry: "",
    companySize: "",
    contactPerson: "",
    phone: "",
    website: "",
    address: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/corporate/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Auto-login after successful registration
        localStorage.setItem("corporateUser", JSON.stringify(data.company))
        toast({
          title: "Success",
          description: "Company registered successfully! Welcome to your corporate dashboard.",
        })
        router.push("/corporate/dashboard")
      } else {
        toast({
          title: "Error",
          description: data.error || "Registration failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-brand-blue p-3 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">QRProfile</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Register Your Company</h1>
          <p className="text-gray-400">Create a corporate account to manage your team's professional QR codes</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white font-medium">
                Company Name *
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your Company Name"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Company Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-medium">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-white font-medium">
                Industry *
              </Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:border-brand-blue">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="technology" className="text-white hover:bg-gray-800">
                    Technology
                  </SelectItem>
                  <SelectItem value="healthcare" className="text-white hover:bg-gray-800">
                    Healthcare
                  </SelectItem>
                  <SelectItem value="finance" className="text-white hover:bg-gray-800">
                    Finance
                  </SelectItem>
                  <SelectItem value="education" className="text-white hover:bg-gray-800">
                    Education
                  </SelectItem>
                  <SelectItem value="retail" className="text-white hover:bg-gray-800">
                    Retail
                  </SelectItem>
                  <SelectItem value="manufacturing" className="text-white hover:bg-gray-800">
                    Manufacturing
                  </SelectItem>
                  <SelectItem value="other" className="text-white hover:bg-gray-800">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-white font-medium">
                Company Size *
              </Label>
              <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:border-brand-blue">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="1-10" className="text-white hover:bg-gray-800">
                    1-10 employees
                  </SelectItem>
                  <SelectItem value="11-50" className="text-white hover:bg-gray-800">
                    11-50 employees
                  </SelectItem>
                  <SelectItem value="51-200" className="text-white hover:bg-gray-800">
                    51-200 employees
                  </SelectItem>
                  <SelectItem value="201-500" className="text-white hover:bg-gray-800">
                    201-500 employees
                  </SelectItem>
                  <SelectItem value="500+" className="text-white hover:bg-gray-800">
                    500+ employees
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-white font-medium">
                Contact Person *
              </Label>
              <Input
                id="contactPerson"
                type="text"
                placeholder="Contact person name"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-white font-medium">
              Website (Optional)
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourcompany.com"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-white font-medium">
              Company Address *
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Company address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-blue hover:bg-blue-700 py-3 text-lg font-medium"
            disabled={loading}
          >
            {loading ? "Registering Company..." : "Register Company"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have a corporate account?{" "}
            <Link href="/corporate/login" className="text-brand-blue hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

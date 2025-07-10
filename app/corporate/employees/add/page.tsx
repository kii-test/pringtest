"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AddEmployeePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    gender: "",
    department: "",
    position: "",
    employeeType: "full-time",
    startDate: "",
    manager: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const corporateData = localStorage.getItem("corporateUser")
      if (!corporateData) {
        router.push("/corporate/login")
        return
      }

      const company = JSON.parse(corporateData)

      const response = await fetch("/api/corporate/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: company._id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Employee added successfully!",
        })
        router.push("/corporate/dashboard")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add employee",
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-gray-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="bg-brand-blue p-2 rounded-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Add New Employee</h1>
              <p className="text-gray-400 text-sm">Create a new team member profile</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="bg-gradient-to-r from-brand-blue to-blue-600 text-white">
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Employee Information
            </CardTitle>
            <CardDescription className="text-blue-100">Fill in the details for the new team member</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-white font-medium">
                      Employee ID *
                    </Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange("employeeId", e.target.value)}
                      placeholder="EMP001"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Doe"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">
                      Official Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john.doe@company.com"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                    <p className="text-xs text-gray-400">QR code will be linked to this official email</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-white font-medium">
                      Mobile Number *
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-white font-medium">
                      Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white font-medium">
                      Gender *
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-brand-blue">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="male" className="text-white hover:bg-gray-800">
                          Male
                        </SelectItem>
                        <SelectItem value="female" className="text-white hover:bg-gray-800">
                          Female
                        </SelectItem>
                        <SelectItem value="other" className="text-white hover:bg-gray-800">
                          Other
                        </SelectItem>
                        <SelectItem value="prefer-not-to-say" className="text-white hover:bg-gray-800">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Work Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-white font-medium">
                      Department *
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      placeholder="Engineering"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-white font-medium">
                      Position *
                    </Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      placeholder="Software Engineer"
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeType" className="text-white font-medium">
                      Employee Type *
                    </Label>
                    <Select
                      value={formData.employeeType}
                      onValueChange={(value) => handleInputChange("employeeType", value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-brand-blue">
                        <SelectValue placeholder="Select employee type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="full-time" className="text-white hover:bg-gray-800">
                          Full-time
                        </SelectItem>
                        <SelectItem value="part-time" className="text-white hover:bg-gray-800">
                          Part-time
                        </SelectItem>
                        <SelectItem value="contractor" className="text-white hover:bg-gray-800">
                          Contractor
                        </SelectItem>
                        <SelectItem value="intern" className="text-white hover:bg-gray-800">
                          Intern
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-white font-medium">
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      required
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager" className="text-white font-medium">
                    Manager (Optional)
                  </Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => handleInputChange("manager", e.target.value)}
                    placeholder="Jane Smith"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-brand-blue hover:bg-blue-700" disabled={loading}>
                  {loading ? "Adding Employee..." : "Add Employee"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

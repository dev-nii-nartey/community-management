"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { API_ENDPOINTS } from "@/app/config/api"

// Define enum types to match backend
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED"
}

enum AttendanceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

// Ministry options
const ministryOptions = [
  "Worship Team",
  "Children's Ministry",
  "Youth Ministry",
  "Media/Tech Team",
  "Hospitality",
  "Prayer Team",
  "Outreach/Missions",
  "Teaching/Education",
  "Administration",
  "Counseling",
  "Visitation",
  "Ushering"
];

// Skills options
const skillsOptions = [
  "Music/Instruments",
  "Singing",
  "Public Speaking",
  "Writing",
  "Graphic Design",
  "Video Production",
  "Audio Engineering",
  "Event Planning",
  "Cooking",
  "Carpentry",
  "IT/Technology",
  "Counseling",
  "Finance/Accounting",
  "Medical/Healthcare"
];

interface Member {
  id: string
  firstName: string
  lastName: string
  preferredName?: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
  residingAddress: string
  primaryPhone: string
  secondaryPhone?: string
  emailAddress: string
  occupation?: string
  employer?: string
  emergencyContact?: string
  emergencyContactRelationship?: string
  dateJoinedChurch: string
  attendanceStatus: "ACTIVE" | "INACTIVE" | null
  lastAttendance?: string
  baptizedWithHolySpirit?: boolean
  ministriesOfInterest?: string[]
  skills?: string[]
}

export default function EditMemberPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const totalSteps = 4
  
  const [formData, setFormData] = useState({
    // Personal Information
    id: "",
    firstName: "",
    lastName: "",
    preferredName: "",
    emailAddress: "",
    dateOfBirth: "",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPhone: "",
    secondaryPhone: "",
    occupation: "",
    employer: "",
    residingAddress: "",
    
    // Emergency Contact
    emergencyContact: "",
    emergencyContactRelationship: "",
    
    // Church Information
    ministriesOfInterest: [] as string[],
    skills: [] as string[],
    attendanceStatus: AttendanceStatus.ACTIVE,
    lastAttendance: format(new Date(), "yyyy-MM-dd"),
    joinDate: format(new Date(), "yyyy-MM-dd"),
    baptizedWithHolySpirit: false,
    
    // System field
    isDeleted: false
  })

  // Fetch the member data when the component mounts
  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true)
        const fetchUrl = `${API_ENDPOINTS.getMember}/${params.id}`
        const response = await fetch(fetchUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const memberData = await response.json()
        console.log("API Response from backend:", memberData);
        console.log("Member ID from API:", memberData.id);
        console.log("Member recordId from API:", memberData.recordId);
        
        // For debugging purposes
        let idToUse = memberData.id;
        
        // Check if id is missing but recordId exists (API inconsistency)
        if (!idToUse && memberData.recordId) {
          console.log("Using recordId instead of id:", memberData.recordId);
          idToUse = memberData.recordId;
        }
        
        // If still no ID, use the URL param as last resort
        if (!idToUse) {
          console.log("Using URL params.id as fallback:", params.id);
          idToUse = params.id;
        }
        
        // Transform API data to match our form structure
        setFormData({
          id: idToUse, // Use the identified ID
          firstName: memberData.firstName || "",
          lastName: memberData.lastName || "",
          preferredName: memberData.preferredName || "",
          emailAddress: memberData.emailAddress || "",
          dateOfBirth: memberData.dateOfBirth || "",
          gender: memberData.gender || Gender.MALE,
          maritalStatus: memberData.maritalStatus || MaritalStatus.SINGLE,
          primaryPhone: memberData.primaryPhone || "",
          secondaryPhone: memberData.secondaryPhone || "",
          occupation: memberData.occupation || "",
          employer: memberData.employer || "",
          residingAddress: memberData.residingAddress || "",
          emergencyContact: memberData.emergencyContact || "",
          emergencyContactRelationship: memberData.emergencyContactRelationship || "",
          ministriesOfInterest: memberData.ministriesOfInterest || [],
          skills: memberData.skills || [],
          attendanceStatus: memberData.attendanceStatus || AttendanceStatus.ACTIVE,
          lastAttendance: memberData.lastAttendance || format(new Date(), "yyyy-MM-dd"),
          joinDate: memberData.dateJoinedChurch || format(new Date(), "yyyy-MM-dd"),
          baptizedWithHolySpirit: memberData.baptizedWithHolySpirit || false,
          isDeleted: false
        })
      } catch (error) {
        console.error("Error fetching member:", error)
        toast({
          title: "Error",
          description: "Failed to load member details. Please try again.",
          variant: "destructive",
        })
        router.push("/members")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMember()
    }
  }, [params.id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDateChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleMultiSelectChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof prev] as string[];
      
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(item => item !== value) };
      }
    });
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate based on current step
    if (currentStep === 1) {
      // Personal Information validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
      }
      if (!formData.emailAddress.trim()) {
        newErrors.emailAddress = "Email address is required"
      }
      if (!formData.primaryPhone.trim()) {
        newErrors.primaryPhone = "Primary phone is required"
      }
      if (!formData.residingAddress.trim()) {
        newErrors.residingAddress = "Address is required"
      }
    } else if (currentStep === 2) {
      // Emergency Contact validation
      if (!formData.emergencyContact.trim()) {
        newErrors.emergencyContact = "Emergency contact is required"
      }
      if (!formData.emergencyContactRelationship.trim()) {
        newErrors.emergencyContactRelationship = "Relationship is required"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
      }
    } else {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
      
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        if (element) {
          element.focus()
        }
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Prevent form submission on Enter key
  const preventEnterKeySubmission = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const submitForm = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formatDateForJava = (dateString: string | null) => {
        if (!dateString) return null;
        return dateString;
      };
      
      // Create data structure that matches MemberDto in the backend
      const memberData = {
        recordId: formData.id || params.id, 
        firstName: formData.firstName,
        lastName: formData.lastName,
        preferredName: formData.preferredName || null,
        dateOfBirth: formatDateForJava(formData.dateOfBirth),
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        residingAddress: formData.residingAddress,
        primaryPhone: formData.primaryPhone,
        secondaryPhone: formData.secondaryPhone || null,
        emailAddress: formData.emailAddress,
        occupation: formData.occupation || null,
        employer: formData.employer || null,
        emergencyContact: formData.emergencyContact,
        emergencyContactRelationship: formData.emergencyContactRelationship,
        joinDate: formatDateForJava(formData.joinDate),
        lastAttendance: formatDateForJava(formData.lastAttendance),
        attendanceStatus: formData.attendanceStatus,
        baptized: formData.baptizedWithHolySpirit, 
        ministriesOfInterest: formData.ministriesOfInterest.length > 0 ? formData.ministriesOfInterest : null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        isDeleted: formData.isDeleted
      };
      
      console.log("Sending updated member data to backend with recordId:", memberData.recordId);
      
      // Use PUT method to update the existing member
      const response = await fetch(`${API_ENDPOINTS.getMember}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(memberData)
      });

      if (!response.ok) {
        let errorDetail = "";
        try {
          const errorResponse = await response.text();
          console.error("Error response text:", errorResponse);
          
          if (errorResponse) {
            try {
              const jsonError = JSON.parse(errorResponse);
              console.error("Parsed error response:", jsonError);
              errorDetail = jsonError.message || jsonError.error || JSON.stringify(jsonError);
            } catch (parseError) {
              errorDetail = errorResponse;
            }
          } else {
            errorDetail = "No error details returned from server";
          }
        } catch (e) {
          errorDetail = "Could not parse error response";
        }
        
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetail}`);
      }

      const data = await response.json();
      console.log("Success response:", data);

      toast({
        title: "Member updated successfully",
        description: `${formData.firstName} ${formData.lastName}'s information has been updated.`,
      });

      router.replace("/members");
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error updating the member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading member data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Member</h1>
      </div>

      <div className="mb-8 flex justify-between">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-2 w-16 rounded-full ${
                i + 1 === currentStep ? "bg-primary" : i + 1 < currentStep ? "bg-primary/60" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                <CardDescription>Basic details about the member</CardDescription>
              </CardHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    onKeyDown={preventEnterKeySubmission}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-sm text-destructive">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    onKeyDown={preventEnterKeySubmission}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-sm text-destructive">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredName">Preferred Name</Label>
                  <Input
                    id="preferredName"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={handleChange}
                    placeholder="Johnny"
                    onKeyDown={preventEnterKeySubmission}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleDateChange("dateOfBirth", e.target.value)}
                    onKeyDown={preventEnterKeySubmission}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>Male</SelectItem>
                      <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                      <SelectItem value={Gender.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                  >
                    <SelectTrigger id="maritalStatus">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MaritalStatus.SINGLE}>Single</SelectItem>
                      <SelectItem value={MaritalStatus.MARRIED}>Married</SelectItem>
                      <SelectItem value={MaritalStatus.DIVORCED}>Divorced</SelectItem>
                      <SelectItem value={MaritalStatus.WIDOWED}>Widowed</SelectItem>
                      <SelectItem value={MaritalStatus.SEPARATED}>Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address <span className="text-destructive">*</span></Label>
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    onKeyDown={preventEnterKeySubmission}
                    aria-invalid={!!errors.emailAddress}
                    aria-describedby={errors.emailAddress ? "emailAddress-error" : undefined}
                  />
                  {errors.emailAddress && (
                    <p id="emailAddress-error" className="text-sm text-destructive">
                      {errors.emailAddress}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryPhone">Primary Phone <span className="text-destructive">*</span></Label>
                  <Input
                    id="primaryPhone"
                    name="primaryPhone"
                    value={formData.primaryPhone}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                    onKeyDown={preventEnterKeySubmission}
                    aria-invalid={!!errors.primaryPhone}
                    aria-describedby={errors.primaryPhone ? "primaryPhone-error" : undefined}
                  />
                  {errors.primaryPhone && (
                    <p id="primaryPhone-error" className="text-sm text-destructive">
                      {errors.primaryPhone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                  <Input
                    id="secondaryPhone"
                    name="secondaryPhone"
                    value={formData.secondaryPhone}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                    onKeyDown={preventEnterKeySubmission}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    onKeyDown={preventEnterKeySubmission}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employer">Employer</Label>
                  <Input
                    id="employer"
                    name="employer"
                    value={formData.employer}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    onKeyDown={preventEnterKeySubmission}
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="residingAddress">Address <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="residingAddress"
                    name="residingAddress"
                    value={formData.residingAddress}
                    onChange={handleChange}
                    placeholder="123 Main St, Anytown, ST 12345"
                    rows={3}
                    aria-invalid={!!errors.residingAddress}
                    aria-describedby={errors.residingAddress ? "residingAddress-error" : undefined}
                  />
                  {errors.residingAddress && (
                    <p id="residingAddress-error" className="text-sm text-destructive">
                      {errors.residingAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Emergency Contacts */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">Emergency Contact</CardTitle>
                <CardDescription>Who should we contact in case of emergency?</CardDescription>
              </CardHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    onKeyDown={preventEnterKeySubmission}
                    aria-invalid={!!errors.emergencyContact}
                    aria-describedby={errors.emergencyContact ? "emergencyContact-error" : undefined}
                  />
                  {errors.emergencyContact && (
                    <p id="emergencyContact-error" className="text-sm text-destructive">
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relationship <span className="text-destructive">*</span></Label>
                  <Input
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    placeholder="Spouse"
                    onKeyDown={preventEnterKeySubmission}
                    aria-invalid={!!errors.emergencyContactRelationship}
                    aria-describedby={errors.emergencyContactRelationship ? "emergencyContactRelationship-error" : undefined}
                  />
                  {errors.emergencyContactRelationship && (
                    <p id="emergencyContactRelationship-error" className="text-sm text-destructive">
                      {errors.emergencyContactRelationship}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Church Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">Church Information</CardTitle>
                <CardDescription>Details about church involvement</CardDescription>
              </CardHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Date Joined Church</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleDateChange("joinDate", e.target.value)}
                    onKeyDown={preventEnterKeySubmission}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendanceStatus">Attendance Status</Label>
                  <Select
                    value={formData.attendanceStatus}
                    onValueChange={(value) => handleSelectChange("attendanceStatus", value)}
                  >
                    <SelectTrigger id="attendanceStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AttendanceStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={AttendanceStatus.INACTIVE}>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastAttendance">Last Attendance</Label>
                  <Input
                    id="lastAttendance"
                    name="lastAttendance"
                    type="date"
                    value={formData.lastAttendance}
                    onChange={(e) => handleDateChange("lastAttendance", e.target.value)}
                    onKeyDown={preventEnterKeySubmission}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="baptized"
                    checked={formData.baptizedWithHolySpirit}
                    onCheckedChange={(checked) => handleCheckboxChange("baptizedWithHolySpirit", checked === true)}
                  />
                  <Label htmlFor="baptized" className="font-normal">
                    Baptized with Holy Spirit
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Skills and Ministries */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl">Skills & Interests</CardTitle>
                <CardDescription>Member's skills and ministry interests</CardDescription>
              </CardHeader>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <Label className="text-base">Ministries of Interest</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ministryOptions.map((ministry) => (
                      <div key={ministry} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ministry-${ministry}`}
                          checked={formData.ministriesOfInterest.includes(ministry)}
                          onCheckedChange={(checked) => handleMultiSelectChange("ministriesOfInterest", ministry, checked === true)}
                        />
                        <Label htmlFor={`ministry-${ministry}`} className="font-normal text-sm">
                          {ministry}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Skills</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {skillsOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={(checked) => handleMultiSelectChange("skills", skill, checked === true)}
                        />
                        <Label htmlFor={`skill-${skill}`} className="font-normal text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <Button 
              variant="outline" 
              onClick={goToPreviousStep} 
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={goToNextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={submitForm} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Member"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
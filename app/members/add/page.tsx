"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function AddMemberPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const totalSteps = 4 // Reduced from 6 to 4 steps
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    emailAddress: "",
    dateOfBirth: "",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPhone: "",
    occupation: "",
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
    baptized: false,
    
    // System field
    isDeleted: false
  })

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

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === "" ? 0 : parseInt(value, 10) }))
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
      // Show a toast for validation errors
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      })
      
      // Focus the first field with an error
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

  // Explicitly separate the submission process from the form
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
      // Format dates in a way that Java's LocalDate can parse
      const formatDateForJava = (dateString: string | null) => {
        if (!dateString) return null;
        // Make sure it's in yyyy-MM-dd format for Java's LocalDate
        return dateString;
      };
      
      // Create data structure that exactly matches MemberDto in the backend
      const memberData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formatDateForJava(formData.dateOfBirth),
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        residingAddress: formData.residingAddress,
        primaryPhone: formData.primaryPhone,
        attendanceStatus: formData.attendanceStatus,
        // Ensure lists are never null/undefined - use empty arrays if needed
        ministriesOfInterest: formData.ministriesOfInterest.length > 0 ? formData.ministriesOfInterest : [],
        // Boolean using primitive type to match Java boolean
        isDeleted: Boolean(formData.isDeleted),
        emailAddress: formData.emailAddress,
        emergencyContact: formData.emergencyContact,
        emergencyContactRelationship: formData.emergencyContactRelationship,
        occupation: formData.occupation || "",
        // Ensure lists are never null/undefined
        skills: formData.skills.length > 0 ? formData.skills : [],
        lastAttendance: formatDateForJava(formData.lastAttendance),
        joinDate: formatDateForJava(formData.joinDate),
        // Boolean object to match Java Boolean
        baptized: formData.baptized
      };
      
      console.log("Sending member data to backend:", JSON.stringify(memberData));
      
      const response = await fetch(API_ENDPOINTS.member, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(memberData)
      });

      if (!response.ok) {
        // Try to get more detailed error information from the response
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
        title: "Member added successfully",
        description: `${formData.firstName} ${formData.lastName} has been added to your community.`,
      });

      router.push("/members");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error adding the member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Member</h1>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full ${
                index + 1 <= currentStep ? "bg-primary" : "bg-muted"
              } ${index === 0 ? "rounded-l-full" : ""} ${
                index === totalSteps - 1 ? "rounded-r-full" : ""
              }`}
              style={{ width: `${100 / totalSteps - 2}%` }}
            />
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}: {
            currentStep === 1 ? "Personal Information" :
            currentStep === 2 ? "Emergency Contact" :
            currentStep === 3 ? "Ministry & Skills" :
            "Church Information"
          }
        </div>
      </div>

      <Card>
        <div onKeyDown={preventEnterKeySubmission}>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 ? "Personal Information" :
               currentStep === 2 ? "Emergency Contact" :
               currentStep === 3 ? "Ministry & Skills" :
               "Church Information"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 ? "Enter the personal details of the new member." :
               currentStep === 2 ? "Provide emergency contact information." :
               currentStep === 3 ? "Select the member's ministries of interest and skills." :
               "Details about the member's church involvement."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex">
                      First Name<span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex">
                      Last Name<span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress" className="flex">
                      Email Address<span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      required
                      className={errors.emailAddress ? "border-destructive" : ""}
                    />
                    {errors.emailAddress && (
                      <p className="text-xs text-destructive mt-1">{errors.emailAddress}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender
                    </Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => {
                        handleSelectChange("gender", value)
                      }}
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
                    <Label htmlFor="maritalStatus">
                      Marital Status
                    </Label>
                    <Select 
                      value={formData.maritalStatus} 
                      onValueChange={(value) => {
                        handleSelectChange("maritalStatus", value)
                      }}
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
                    <Label htmlFor="primaryPhone" className="flex">
                      Primary Phone<span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="primaryPhone"
                      name="primaryPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.primaryPhone}
                      onChange={handleChange}
                      required
                      className={errors.primaryPhone ? "border-destructive" : ""}
                    />
                    {errors.primaryPhone && (
                      <p className="text-xs text-destructive mt-1">{errors.primaryPhone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">
                      Occupation
                    </Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      placeholder="Software Developer"
                      value={formData.occupation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residingAddress" className="flex">
                    Residing Address<span className="text-destructive ml-1">*</span>
                  </Label>
                  <Textarea
                    id="residingAddress"
                    name="residingAddress"
                    placeholder="123 Main St, City, State, ZIP"
                    value={formData.residingAddress}
                    onChange={handleChange}
                    required
                    className={errors.residingAddress ? "border-destructive" : ""}
                  />
                  {errors.residingAddress && (
                    <p className="text-xs text-destructive mt-1">{errors.residingAddress}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Emergency Contact */}
            {currentStep === 2 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact" className="flex">
                      Emergency Contact<span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      placeholder="Jane Doe"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      required
                      className={errors.emergencyContact ? "border-destructive" : ""}
                    />
                    {errors.emergencyContact && (
                      <p className="text-xs text-destructive mt-1">{errors.emergencyContact}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelationship" className="flex">
                      Relationship<span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      placeholder="Spouse"
                      value={formData.emergencyContactRelationship}
                      onChange={handleChange}
                      required
                      className={errors.emergencyContactRelationship ? "border-destructive" : ""}
                    />
                    {errors.emergencyContactRelationship && (
                      <p className="text-xs text-destructive mt-1">{errors.emergencyContactRelationship}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Ministry & Skills */}
            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Ministries of Interest</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select all ministries you're interested in serving with
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {ministryOptions.map((ministry) => (
                        <div key={ministry} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`ministry-${ministry}`}
                            checked={formData.ministriesOfInterest.includes(ministry)}
                            onCheckedChange={(checked) => 
                              handleMultiSelectChange("ministriesOfInterest", ministry, checked === true)
                            }
                          />
                          <Label htmlFor={`ministry-${ministry}`}>{ministry}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base">Skills</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select the practical skills you can contribute
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {skillsOptions.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`skill-${skill}`}
                            checked={formData.skills.includes(skill)}
                            onCheckedChange={(checked) => 
                              handleMultiSelectChange("skills", skill, checked === true)
                            }
                          />
                          <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Church Information */}
            {currentStep === 4 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="attendanceStatus">
                      Attendance Status
                    </Label>
                    <Select 
                      value={formData.attendanceStatus} 
                      onValueChange={(value) => {
                        handleSelectChange("attendanceStatus", value)
                      }}
                    >
                      <SelectTrigger id="attendanceStatus">
                        <SelectValue placeholder="Select attendance status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AttendanceStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={AttendanceStatus.INACTIVE}>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastAttendance">
                      Last Attendance Date
                    </Label>
                    <Input
                      id="lastAttendance"
                      name="lastAttendance"
                      type="date"
                      value={formData.lastAttendance}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">
                      Join Date
                    </Label>
                    <Input
                      id="joinDate"
                      name="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2 flex items-center pt-8">
                    <Checkbox 
                      id="baptized" 
                      checked={formData.baptized}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("baptized", checked === true)
                      }
                    />
                    <Label htmlFor="baptized" className="ml-2">
                      Baptized
                    </Label>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
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
              <Button onClick={submitForm} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { format } from "date-fns"

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

// Spiritual gifts options
const spiritualGiftsOptions = [
  "Teaching",
  "Prophesy",
  "Service",
  "Leadership",
  "Exhortation",
  "Giving",
  "Mercy",
  "Wisdom",
  "Knowledge",
  "Faith",
  "Discernment",
  "Helps",
  "Administration"
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
  const totalSteps = 6
  
  const [formData, setFormData] = useState({
    // Basic registration info
    branchName: "",
    registrationDate: format(new Date(), "yyyy-MM-dd"),
    
    // Personal Information
    firstName: "",
    lastName: "",
    preferredName: "",
    dateOfBirth: "",
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    residingAddress: "",
    primaryPhone: "",
    secondaryPhone: "",
    emailAddress: "",
    occupation: "",
    employer: "",
    
    // Family Information
    spouseName: "",
    spousePhone: "",
    fatherName: "",
    fatherHometown: "",
    fatherContact: "",
    motherName: "",
    motherHometown: "",
    motherContact: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    
    // Spiritual Journey
    dateJoinedChurch: "",
    baptizedWithHolySpirit: false,
    dateOfSalvation: "",
    baptismDate: "",
    previousChurchAffiliation: "",
    yearsAttended: 0,
    
    // Ministry and Skills
    ministriesOfInterest: [] as string[],
    spiritualGifts: [] as string[],
    skills: [] as string[],
    
    // Faith and Commitment
    agreeWithBibleIsInspiredWord: false,
    agreeWithSalvationThroughFaith: false,
    agreeWithJesusSonOfGod: false,
    commitmentAttendServices: false,
    commitmentSupportActivities: false,
    commitmentTithe: false,
    commitmentLiveChristianValues: false,
    signatureDate: format(new Date(), "yyyy-MM-dd"),
    
    // Consent and Privacy
    consentContactPermission: false,
    consentPhotoUse: false,
    consentSignatureDate: format(new Date(), "yyyy-MM-dd"),
    
    // Additional Information
    specialNeeds: "",
    howDidYouHear: "",
    isDeleted: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to create the member
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Member added",
        description: `${formData.firstName} ${formData.lastName} has been added to your community.`,
      })

      router.push("/members")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
            currentStep === 2 ? "Family Information" :
            currentStep === 3 ? "Spiritual Journey" :
            currentStep === 4 ? "Ministry & Skills" :
            currentStep === 5 ? "Faith & Commitment" :
            "Consent & Additional Info"
          }
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 ? "Personal Information" :
               currentStep === 2 ? "Family Information" :
               currentStep === 3 ? "Spiritual Journey" :
               currentStep === 4 ? "Ministry & Skills" :
               currentStep === 5 ? "Faith & Commitment" :
               "Consent & Additional Information"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 ? "Enter the personal details of the new member." :
               currentStep === 2 ? "Provide information about the member's family." :
               currentStep === 3 ? "Details about the member's spiritual journey." :
               currentStep === 4 ? "Select the member's ministries of interest, spiritual gifts, and skills." :
               currentStep === 5 ? "Faith declarations and commitments." :
               "Consent permissions and additional information."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      name="branchName"
                      placeholder="Main Branch"
                      value={formData.branchName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationDate">Registration Date</Label>
                    <Input
                      id="registrationDate"
                      name="registrationDate"
                      type="date"
                      value={formData.registrationDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredName">Preferred Name</Label>
                    <Input
                      id="preferredName"
                      name="preferredName"
                      placeholder="Johnny"
                      value={formData.preferredName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender*</Label>
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
                    <Label htmlFor="maritalStatus">Marital Status*</Label>
                    <Select 
                      value={formData.maritalStatus} 
                      onValueChange={(value) => handleSelectChange("maritalStatus", value)}
                    >
                      <SelectTrigger id="maritalStatus">
                        <SelectValue placeholder="Select status" />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residingAddress">Residing Address*</Label>
                  <Input
                    id="residingAddress"
                    name="residingAddress"
                    placeholder="123 Main St, Anytown, USA"
                    value={formData.residingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryPhone">Primary Phone*</Label>
                    <Input
                      id="primaryPhone"
                      name="primaryPhone"
                      placeholder="(555) 123-4567"
                      value={formData.primaryPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                    <Input
                      id="secondaryPhone"
                      name="secondaryPhone"
                      placeholder="(555) 987-6543"
                      value={formData.secondaryPhone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.emailAddress}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      placeholder="Software Developer"
                      value={formData.occupation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employer">Employer</Label>
                    <Input
                      id="employer"
                      name="employer"
                      placeholder="Tech Company Inc."
                      value={formData.employer}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Family Information */}
            {currentStep === 2 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="spouseName">Spouse Name</Label>
                    <Input
                      id="spouseName"
                      name="spouseName"
                      placeholder="Jane Doe"
                      value={formData.spouseName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="spousePhone">Spouse Phone</Label>
                    <Input
                      id="spousePhone"
                      name="spousePhone"
                      placeholder="(555) 123-4567"
                      value={formData.spousePhone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      placeholder="Robert Doe"
                      value={formData.fatherName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherHometown">Father's Hometown</Label>
                    <Input
                      id="fatherHometown"
                      name="fatherHometown"
                      placeholder="Hometown"
                      value={formData.fatherHometown}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherContact">Father's Contact</Label>
                    <Input
                      id="fatherContact"
                      name="fatherContact"
                      placeholder="(555) 987-6543"
                      value={formData.fatherContact}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      name="motherName"
                      placeholder="Sarah Doe"
                      value={formData.motherName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherHometown">Mother's Hometown</Label>
                    <Input
                      id="motherHometown"
                      name="motherHometown"
                      placeholder="Hometown"
                      value={formData.motherHometown}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherContact">Mother's Contact</Label>
                    <Input
                      id="motherContact"
                      name="motherContact"
                      placeholder="(555) 987-6543"
                      value={formData.motherContact}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      name="emergencyContactPhone"
                      placeholder="(555) 555-5555"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelationship">Emergency Contact Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      name="emergencyContactRelationship"
                      placeholder="Sister"
                      value={formData.emergencyContactRelationship}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Spiritual Journey */}
            {currentStep === 3 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateJoinedChurch">Date Joined Church</Label>
                    <Input
                      id="dateJoinedChurch"
                      name="dateJoinedChurch"
                      type="date"
                      value={formData.dateJoinedChurch}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfSalvation">Date of Salvation</Label>
                    <Input
                      id="dateOfSalvation"
                      name="dateOfSalvation"
                      type="date"
                      value={formData.dateOfSalvation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baptismDate">Baptism Date</Label>
                    <Input
                      id="baptismDate"
                      name="baptismDate"
                      type="date"
                      value={formData.baptismDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsAttended">Years Attended Previous Church</Label>
                    <Input
                      id="yearsAttended"
                      name="yearsAttended"
                      type="number"
                      min="0"
                      value={formData.yearsAttended || ""}
                      onChange={(e) => handleNumberChange("yearsAttended", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousChurchAffiliation">Previous Church Affiliation</Label>
                  <Input
                    id="previousChurchAffiliation"
                    name="previousChurchAffiliation"
                    placeholder="First Baptist Church"
                    value={formData.previousChurchAffiliation}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="baptizedWithHolySpirit" 
                    checked={formData.baptizedWithHolySpirit}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("baptizedWithHolySpirit", checked === true)
                    }
                  />
                  <Label htmlFor="baptizedWithHolySpirit">
                    Baptized with the Holy Spirit
                  </Label>
                </div>
              </>
            )}

            {/* Step 4: Ministry & Skills */}
            {currentStep === 4 && (
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
                    <Label className="text-base">Spiritual Gifts</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select the spiritual gifts you believe you possess
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {spiritualGiftsOptions.map((gift) => (
                        <div key={gift} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`gift-${gift}`}
                            checked={formData.spiritualGifts.includes(gift)}
                            onCheckedChange={(checked) => 
                              handleMultiSelectChange("spiritualGifts", gift, checked === true)
                            }
                          />
                          <Label htmlFor={`gift-${gift}`}>{gift}</Label>
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

            {/* Step 5: Faith & Commitment */}
            {currentStep === 5 && (
              <>
                <div className="space-y-4">
                  <Label className="text-base font-medium">Statement of Faith</Label>
                  <p className="text-sm text-muted-foreground">
                    Please indicate your agreement with the following statements
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeWithBibleIsInspiredWord" 
                        checked={formData.agreeWithBibleIsInspiredWord}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("agreeWithBibleIsInspiredWord", checked === true)
                        }
                      />
                      <Label htmlFor="agreeWithBibleIsInspiredWord">
                        I believe the Bible is the inspired Word of God
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeWithSalvationThroughFaith" 
                        checked={formData.agreeWithSalvationThroughFaith}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("agreeWithSalvationThroughFaith", checked === true)
                        }
                      />
                      <Label htmlFor="agreeWithSalvationThroughFaith">
                        I believe salvation comes through faith in Jesus Christ
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeWithJesusSonOfGod" 
                        checked={formData.agreeWithJesusSonOfGod}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("agreeWithJesusSonOfGod", checked === true)
                        }
                      />
                      <Label htmlFor="agreeWithJesusSonOfGod">
                        I believe Jesus Christ is the Son of God
                      </Label>
                    </div>
                  </div>
                  
                  <Label className="text-base font-medium pt-6">Commitments</Label>
                  <p className="text-sm text-muted-foreground">
                    As a member, I commit to the following
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="commitmentAttendServices" 
                        checked={formData.commitmentAttendServices}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("commitmentAttendServices", checked === true)
                        }
                      />
                      <Label htmlFor="commitmentAttendServices">
                        I will regularly attend church services
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="commitmentSupportActivities" 
                        checked={formData.commitmentSupportActivities}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("commitmentSupportActivities", checked === true)
                        }
                      />
                      <Label htmlFor="commitmentSupportActivities">
                        I will support church activities and programs
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="commitmentTithe" 
                        checked={formData.commitmentTithe}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("commitmentTithe", checked === true)
                        }
                      />
                      <Label htmlFor="commitmentTithe">
                        I will financially support the church through tithing
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="commitmentLiveChristianValues" 
                        checked={formData.commitmentLiveChristianValues}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("commitmentLiveChristianValues", checked === true)
                        }
                      />
                      <Label htmlFor="commitmentLiveChristianValues">
                        I will strive to live according to Christian values
                      </Label>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Label htmlFor="signatureDate">Signature Date</Label>
                    <Input
                      id="signatureDate"
                      name="signatureDate"
                      type="date"
                      value={formData.signatureDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 6: Consent & Additional Information */}
            {currentStep === 6 && (
              <>
                <div className="space-y-4">
                  <Label className="text-base font-medium">Consent & Privacy</Label>
                  <p className="text-sm text-muted-foreground">
                    Please indicate your consent to the following
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="consentContactPermission" 
                        checked={formData.consentContactPermission}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("consentContactPermission", checked === true)
                        }
                      />
                      <Label htmlFor="consentContactPermission">
                        I consent to being contacted by the church via phone, email, and text
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="consentPhotoUse" 
                        checked={formData.consentPhotoUse}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("consentPhotoUse", checked === true)
                        }
                      />
                      <Label htmlFor="consentPhotoUse">
                        I consent to my photos being used in church publications and social media
                      </Label>
                    </div>
                    
                    <div className="pt-2">
                      <Label htmlFor="consentSignatureDate">Consent Signature Date</Label>
                      <Input
                        id="consentSignatureDate"
                        name="consentSignatureDate"
                        type="date"
                        value={formData.consentSignatureDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-6">
                    <Label htmlFor="specialNeeds">Special Needs or Accommodations</Label>
                    <Textarea
                      id="specialNeeds"
                      name="specialNeeds"
                      placeholder="Please list any special needs or accommodations that we should be aware of"
                      value={formData.specialNeeds}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                    <Input
                      id="howDidYouHear"
                      name="howDidYouHear"
                      placeholder="Friend, website, social media, etc."
                      value={formData.howDidYouHear}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={goToPreviousStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            {currentStep === 1 && (
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button type="button" onClick={goToNextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Member..." : "Add Member"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

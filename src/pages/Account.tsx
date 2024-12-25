import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck, Edit, Send, Building2, MapPin, Mail, Phone, FileText, Award, CreditCard, User, Bell, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format, addYears } from "date-fns";

const Account = () => {
  console.log('Account page rendered');
  
  // Simulate KYC verification date (current date)
  const verificationDate = new Date();
  const validUntil = addYears(verificationDate, 1);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings.</p>
        </div>
        
        {/* KYC Status Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">KYC Verification</CardTitle>
              <CardDescription>Your identity verification status and details</CardDescription>
            </div>
            <Shield className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Verification Status</p>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Verified</span>
                    <Badge variant="secondary" className="ml-2">
                      Level 2
                    </Badge>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">Valid Until</p>
                  <p className="text-sm text-muted-foreground">
                    {format(validUntil, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Verification Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(verificationDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Document Type</p>
                    <p className="text-sm text-muted-foreground">Passport</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Details
                </Button>
                <Button className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Request Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Company Profile</CardTitle>
              <CardDescription>Your company information and details</CardDescription>
            </div>
            <Building2 className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Company Name</p>
                      <p className="text-sm text-muted-foreground">TrustAmp Technologies Pte Ltd</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        71 Robinson Road, #14-01<br />
                        Singapore 068895
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Business Email</p>
                      <p className="text-sm text-muted-foreground">contact@trustamp.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Business Phone</p>
                      <p className="text-sm text-muted-foreground">+65 6789 0123</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">ACN Number</p>
                      <p className="text-sm text-muted-foreground">123456789012</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Award className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Compliance Score</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">5/5</p>
                        <Badge variant="secondary" className="ml-2">Excellent</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Credit Score</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">4/5</p>
                        <Badge variant="secondary" className="ml-2">Good</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Contact Person</p>
                      <div className="text-sm text-muted-foreground">
                        <p>John Doe</p>
                        <p>john.doe@email.com</p>
                        <p>+61 4 8768 9876</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Company Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </div>
            <Bell className="h-8 w-8 text-gray-400" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Notification Channels */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Channels</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    </div>
                    <Switch id="sms-notifications" defaultChecked />
                  </div>
                </div>
              </div>

              {/* Event Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Notifications</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contract-transfer">Contract Transfer</Label>
                    <Switch id="contract-transfer" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="invoice-paid">Invoice Paid</Label>
                    <Switch id="invoice-paid" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="invoice-unpaid">Invoice Unpaid</Label>
                    <Switch id="invoice-unpaid" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="document-verification">Document Verification</Label>
                    <Switch id="document-verification" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="kyc-updates">KYC Updates</Label>
                    <Switch id="kyc-updates" defaultChecked />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Update Notification Preferences
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;

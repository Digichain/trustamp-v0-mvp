import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, addYears } from "date-fns";

const Account = () => {
  console.log('Account page rendered');
  
  // Simulate KYC verification date (current date)
  const verificationDate = new Date();
  const validUntil = addYears(verificationDate, 1);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>
        
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
            </div>
          </CardContent>
        </Card>

        <p className="text-gray-600">Manage your account preferences and settings.</p>
      </div>
    </div>
  );
};

export default Account;
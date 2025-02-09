import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarRange, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Reports() {
  console.log("Reports page rendered");
  
  const [tradeAuditDateRange, setTradeAuditDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [accountStatementDateRange, setAccountStatementDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [tradeAuditPeriod, setTradeAuditPeriod] = useState<string>();
  const [accountStatementPeriod, setAccountStatementPeriod] = useState<string>();
  const [compliancePeriod, setCompliancePeriod] = useState<string>();

  const handleGenerateTradeAudit = () => {
    console.log("Creating trade audit report with date range:", tradeAuditDateRange);
    console.log("Selected period:", tradeAuditPeriod);
  };

  const handleGenerateAccountStatement = () => {
    console.log("Creating account statement with date range:", accountStatementDateRange);
    console.log("Selected period:", accountStatementPeriod);
  };

  const handleGenerateComplianceReport = () => {
    console.log("Creating compliance report with period:", compliancePeriod);
  };

  const ReportSection = ({ 
    title, 
    dateRange, 
    setDateRange, 
    period, 
    setPeriod, 
    onGenerate,
    showDatePickers = true,
    periodLabel = "Or Select Period"
  }: { 
    title: string;
    dateRange?: { from?: Date; to?: Date };
    setDateRange?: (range: { from?: Date; to?: Date }) => void;
    period?: string;
    setPeriod: (value: string) => void;
    onGenerate: () => void;
    showDatePickers?: boolean;
    periodLabel?: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {showDatePickers && (
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Select Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarRange className="mr-2 h-4 w-4" />
                        {dateRange?.from ? format(dateRange.from, "PPP") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange?.from}
                        onSelect={(date) => setDateRange?.({ ...dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange?.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarRange className="mr-2 h-4 w-4" />
                        {dateRange?.to ? format(dateRange.to, "PPP") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange?.to}
                        onSelect={(date) => setDateRange?.({ ...dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">{periodLabel}</label>
              <Select onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full sm:w-auto"
            onClick={onGenerate}
          >
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Reports Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Reports and analytics will be displayed here.</p>
        </CardContent>
      </Card>

      <ReportSection 
        title="Create Trade Audit Report"
        dateRange={tradeAuditDateRange}
        setDateRange={setTradeAuditDateRange}
        period={tradeAuditPeriod}
        setPeriod={setTradeAuditPeriod}
        onGenerate={handleGenerateTradeAudit}
      />

      <ReportSection 
        title="Account Statement"
        dateRange={accountStatementDateRange}
        setDateRange={setAccountStatementDateRange}
        period={accountStatementPeriod}
        setPeriod={setAccountStatementPeriod}
        onGenerate={handleGenerateAccountStatement}
      />

      <ReportSection 
        title="Compliance Report"
        period={compliancePeriod}
        setPeriod={setCompliancePeriod}
        onGenerate={handleGenerateComplianceReport}
        showDatePickers={false}
        periodLabel="Financial Year"
      />
    </div>
  );
}
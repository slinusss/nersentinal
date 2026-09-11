import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ReportForm } from "@/components/citizen/report-form";

export default function CitizenReportPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a hazard</CardTitle>
        <CardDescription>
          Your report is AI-scored for risk and routed to NER Control the moment you submit it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReportForm />
      </CardContent>
    </Card>
  );
}

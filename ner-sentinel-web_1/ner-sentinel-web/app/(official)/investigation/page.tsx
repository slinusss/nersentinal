import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getSessionToken } from "@/lib/auth";
import { getReportDetail } from "@/lib/api";
import { InvestigationWorkspace } from "@/components/official/investigation-workspace";

export default async function InvestigationPage({
  searchParams,
}: {
  searchParams: Promise<{ report?: string }>;
}) {
  const { report: reportId } = await searchParams;
  const token = await getSessionToken();
  const detail = token && reportId ? await getReportDetail(token, reportId).catch(() => null) : null;

  if (!reportId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No report selected</CardTitle>
          <CardDescription>Open a report from My assignments to start or update an investigation.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!detail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report unavailable</CardTitle>
          <CardDescription>Could not load {reportId} — it may not be assigned to you.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investigation workspace</CardTitle>
      </CardHeader>
      <CardContent>
        <InvestigationWorkspace report={detail.report} investigation={detail.investigation} />
      </CardContent>
    </Card>
  );
}

import {
  Card, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getSessionToken } from "@/lib/auth";
import { getReportsFull } from "@/lib/api";
import { AssignReportButton } from "@/components/admin/assign-report-button";

const PRIORITY_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CRITICAL: "destructive",
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

export default async function AdminReportsPage() {
  const token = await getSessionToken();
  const data = token ? await getReportsFull(token).catch(() => null) : null;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Citizen intelligence
        </p>
        <h1 className="text-2xl font-semibold">Incoming hazard reports</h1>
      </div>

      {!data ? (
        <Card>
          <CardHeader>
            <CardTitle>Reports unavailable</CardTitle>
            <CardDescription>Could not reach the NER Sentinel API.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Hazard</TableHead>
                <TableHead>AI risk</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    {report.district}, {report.state}
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.risk_score}</TableCell>
                  <TableCell>
                    <Badge variant={PRIORITY_VARIANT[report.priority] ?? "outline"}>
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>
                    {report.status === "UNDER REVIEW" && <AssignReportButton reportId={report.id} />}
                  </TableCell>
                </TableRow>
              ))}
              {data.reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No reports yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

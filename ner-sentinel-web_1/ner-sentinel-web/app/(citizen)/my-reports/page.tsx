import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessionToken } from "@/lib/auth";
import { getReportsFull } from "@/lib/api";

export default async function MyReportsPage() {
  const token = await getSessionToken();
  const data = token ? await getReportsFull(token).catch(() => null) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My reports</h1>

      {!data || data.reports.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No reports yet</CardTitle>
            <CardDescription>
              {data ? "Submit a hazard report and it'll show up here with live status." : "Could not reach the NER Sentinel API."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.reports.map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{r.id} · {r.type}</CardTitle>
                  <CardDescription>
                    {r.district}, {r.state} · Risk {r.risk_score}
                  </CardDescription>
                </div>
                <Badge>{r.status}</Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

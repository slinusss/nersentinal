import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessionToken } from "@/lib/auth";
import { getReportsFull } from "@/lib/api";

export default async function AssignmentsPage() {
  const token = await getSessionToken();
  const data = token ? await getReportsFull(token).catch(() => null) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My assignments</h1>
      <div className="space-y-3">
        {(data?.reports ?? []).map((r) => (
          <Link key={r.id} href={`/investigation?report=${r.id}`}>
            <Card className="transition-colors hover:border-primary">
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
          </Link>
        ))}
        {(!data || data.reports.length === 0) && (
          <Card>
            <CardHeader>
              <CardTitle>No assignments yet</CardTitle>
              <CardDescription>
                {data ? "Reports assigned to you by an administrator will appear here." : "Could not reach the NER Sentinel API."}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

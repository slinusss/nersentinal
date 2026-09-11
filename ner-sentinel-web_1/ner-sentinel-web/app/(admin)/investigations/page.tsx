import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSessionToken } from "@/lib/auth";
import { getReportsFull, type Report } from "@/lib/api";

const COLUMNS: { title: string; statuses: string[] }[] = [
  { title: "Unassigned", statuses: ["UNDER REVIEW"] },
  { title: "In field", statuses: ["ASSIGNED", "INVESTIGATING"] },
  { title: "Awaiting review", statuses: ["VERIFIED", "PARTIALLY VERIFIED", "NEEDS FURTHER INVESTIGATION"] },
];

function column(reports: Report[], statuses: string[]) {
  return reports.filter((r) => statuses.includes(r.status));
}

export default async function AdminInvestigationsPage() {
  const token = await getSessionToken();
  const data = token ? await getReportsFull(token).catch(() => null) : null;
  const reports = data?.reports ?? [];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Field operations
        </p>
        <h1 className="text-2xl font-semibold">Investigation control</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = column(reports, col.statuses);
          return (
            <Card key={col.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wide">
                  {col.title} <span className="text-muted-foreground">({items.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((r) => (
                  <div key={r.id} className="rounded-md border border-border p-3 text-sm">
                    <p className="font-semibold">{r.id}</p>
                    <p className="text-muted-foreground">{r.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.district}, {r.state}
                      {r.assigned_official_name ? ` · ${r.assigned_official_name}` : ""}
                    </p>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nothing here.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

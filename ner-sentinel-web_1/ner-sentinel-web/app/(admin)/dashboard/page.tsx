import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getSessionToken } from "@/lib/auth";
import { getDashboard } from "@/lib/api";

const STAT_LABELS: { key: string; label: string }[] = [
  { key: "active_incidents", label: "Active incidents" },
  { key: "high_risk_corridors", label: "High-risk corridors" },
  { key: "pending_reports", label: "Pending reports" },
  { key: "road_blockages", label: "Road blockages" },
];

export default async function AdminDashboardPage() {
  const token = await getSessionToken();
  const summary = token ? await getDashboard(token).catch(() => null) : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Command overview
        </p>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_LABELS.map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-wide">
                {stat.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {summary ? String(summary[stat.key] ?? "—") : "—"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!summary && (
        <Card>
          <CardHeader>
            <CardTitle>Live data unavailable</CardTitle>
            <CardDescription>
              Could not reach the NER Sentinel FastAPI backend at the
              configured API base. Start it with{" "}
              <code className="rounded bg-muted px-1 py-0.5">
                uv run uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
              </code>{" "}
              and set <code className="rounded bg-muted px-1 py-0.5">NER_SENTINEL_API_BASE</code>{" "}
              if it isn&apos;t on the default address.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Next up in this build</CardTitle>
          <CardDescription>
            The live GIS risk map, triage queue, state risk distribution and
            active-investigations panels from the legacy admin dashboard are
            the next views to port into this layout.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

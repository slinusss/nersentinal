import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getSessionToken } from "@/lib/auth";
import { getMapSegments, getRiskDetail } from "@/lib/api";

export default async function AdminIntelligencePage() {
  const token = await getSessionToken();
  const mapData = token ? await getMapSegments(token).catch(() => null) : null;
  const segments = mapData?.segments ?? [];

  const featured = [...segments].sort((a, b) => (b.risk?.score ?? 0) - (a.risk?.score ?? 0))[0];
  const detail = featured && token ? await getRiskDetail(token, featured.id).catch(() => null) : null;

  const distribution = segments.reduce<Record<string, number>>((acc, s) => {
    const key = s.is_blocked ? "BLOCKED" : s.risk?.category ?? "LOW";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Explainable AI
          </p>
          <h1 className="text-2xl font-semibold">Landslide risk intelligence</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current NER distribution</CardTitle>
            <CardDescription>{segments.length} monitored road segments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(distribution).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <span>{category}</span>
                <b>{count}</b>
              </div>
            ))}
            {segments.length === 0 && (
              <p className="text-sm text-muted-foreground">No segment data available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-wide">
              Feature contribution
            </CardDescription>
            <CardTitle>
              {featured ? `Why risk is elevated on ${featured.name}` : "No featured corridor"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {detail?.risk?.factors ? (
              Object.entries(detail.risk.factors).map(([factor, value]) => (
                <div key={factor} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="capitalize">{factor.replace(/_/g, " ")}</span>
                    <b>{String(value)}</b>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${Math.min(100, Number(value) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Backend does not return per-factor weights for this segment — showing overall
                score instead: <b>{featured?.risk?.score ?? "—"}</b>.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Predicted risk is probabilistic, not a guarantee of a landslide event.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

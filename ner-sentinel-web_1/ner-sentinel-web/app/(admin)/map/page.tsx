import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getSessionToken } from "@/lib/auth";
import { getMapSegments, getMapConfig } from "@/lib/api";
import { RiskMap, RiskLegend } from "@/components/map/risk-map-client";

export default async function AdminMapPage() {
  const token = await getSessionToken();
  const [mapData, mapConfig] = await Promise.all([
    token ? getMapSegments(token).catch(() => null) : null,
    getMapConfig().catch(() => null),
  ]);

  if (!mapData || !mapConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live safety map unavailable</CardTitle>
          <CardDescription>Could not reach the NER Sentinel API.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const critical = mapData.segments
    .filter((s) => s.risk?.category === "CRITICAL" || s.is_blocked)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Live GIS intelligence
        </p>
        <h1 className="text-2xl font-semibold">NER risk map</h1>
      </div>

      <RiskMap
        tileUrl={mapConfig.tile_url}
        attribution={mapConfig.attribution}
        segments={mapData.segments}
        incidents={mapData.incidents}
        height={520}
      />
      <RiskLegend />

      {critical.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {critical.map((segment) => (
            <Card key={segment.id}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">
                  {segment.state} · {segment.district}
                </CardDescription>
                <CardTitle className="text-base">{segment.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  Risk <b>{segment.risk?.score ?? "—"}</b> ·{" "}
                  {segment.is_blocked ? "BLOCKED" : segment.risk?.category}
                </p>
                <p className="text-muted-foreground">{segment.road_condition}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

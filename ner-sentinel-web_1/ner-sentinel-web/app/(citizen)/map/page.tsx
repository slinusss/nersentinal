import { getMapConfig } from "@/lib/api";
import { RoutePlanner } from "@/components/citizen/route-planner";

export default async function CitizenMapPage() {
  const config = await getMapConfig().catch(() => ({
    tile_url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    max_zoom: 18,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Safe route map</h1>
      <RoutePlanner tileUrl={config.tile_url} attribution={config.attribution} />
    </div>
  );
}

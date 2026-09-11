import { Card } from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { getSessionToken } from "@/lib/auth";
import { getIncidentsFull } from "@/lib/api";

export default async function AdminIncidentsPage() {
  const token = await getSessionToken();
  const data = token ? await getIncidentsFull(token).catch(() => null) : null;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Confirmed hazards
        </p>
        <h1 className="text-2xl font-semibold">Incident &amp; road-condition management</h1>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Road status</TableHead>
              <TableHead>Verified by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.incidents ?? []).map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-medium">{incident.id}</TableCell>
                <TableCell>
                  {incident.district}, {incident.state}
                </TableCell>
                <TableCell>{incident.type}</TableCell>
                <TableCell>{incident.risk_score}</TableCell>
                <TableCell>{incident.status}</TableCell>
                <TableCell>{incident.assigned_official_name ?? "—"}</TableCell>
              </TableRow>
            ))}
            {(!data || data.incidents.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {data ? "No confirmed incidents yet." : "Could not reach the NER Sentinel API."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

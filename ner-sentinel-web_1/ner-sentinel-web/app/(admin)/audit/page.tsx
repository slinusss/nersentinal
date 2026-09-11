import { Card } from "@/components/ui/card";
import { getSessionToken } from "@/lib/auth";
import { getAuditFull } from "@/lib/api";

export default async function AdminAuditPage() {
  const token = await getSessionToken();
  const data = token ? await getAuditFull(token).catch(() => null) : null;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Accountability
        </p>
        <h1 className="text-2xl font-semibold">Operational audit log</h1>
      </div>

      <Card className="divide-y divide-border">
        {(data?.audit ?? []).map((entry) => (
          <div key={entry.id} className="flex items-start justify-between gap-4 p-3 text-sm">
            <div>
              <p className="font-medium">
                {entry.actor_name ?? "System"} · {entry.action.replace(/_/g, " ")}
              </p>
              <p className="text-muted-foreground">
                {entry.entity_type} {entry.entity_id}
                {entry.details ? ` — ${entry.details}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{entry.created_at}</span>
          </div>
        ))}
        {(!data || data.audit.length === 0) && (
          <p className="p-4 text-sm text-muted-foreground">
            {data ? "No audit entries yet." : "Could not reach the NER Sentinel API."}
          </p>
        )}
      </Card>
    </div>
  );
}

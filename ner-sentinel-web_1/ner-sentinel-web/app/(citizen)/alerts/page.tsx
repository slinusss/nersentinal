import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSessionToken } from "@/lib/auth";
import { getNotifications } from "@/lib/api";

export default async function AlertsPage() {
  const token = await getSessionToken();
  const data = token ? await getNotifications(token).catch(() => null) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Alerts</h1>
      <div className="space-y-3">
        {(data?.notifications ?? []).map((n) => (
          <Card key={n.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{n.title}</CardTitle>
              <CardDescription>{n.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        {(!data || data.notifications.length === 0) && (
          <Card>
            <CardHeader>
              <CardTitle>No alerts</CardTitle>
              <CardDescription>
                {data ? "You're all caught up." : "Could not reach the NER Sentinel API."}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

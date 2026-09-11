import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getSessionToken } from "@/lib/auth";
import { getAnalyticsFull } from "@/lib/api";

export default async function AdminAnalyticsPage() {
  const token = await getSessionToken();
  const data = token ? await getAnalyticsFull(token).catch(() => null) : null;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pattern analysis
        </p>
        <h1 className="text-2xl font-semibold">NER risk analytics</h1>
      </div>

      {!data ? (
        <Card>
          <CardHeader>
            <CardTitle>Analytics unavailable</CardTitle>
            <CardDescription>Could not reach the NER Sentinel API.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Landslides by state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {data.landslides_by_state.map((row) => (
                <div key={row.state} className="flex justify-between">
                  <span>{row.state}</span>
                  <b>{row.count}</b>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly trend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {data.landslides_by_month.map((row) => (
                <div key={row.month} className="flex justify-between">
                  <span>Month {row.month}</span>
                  <b>{row.count}</b>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Report lifecycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {data.report_lifecycle.map((row) => (
                <div key={row.status} className="flex justify-between">
                  <span>{row.status}</span>
                  <b>{row.count}</b>
                </div>
              ))}
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground md:col-span-3">{data.seasonal_note}</p>
        </div>
      )}
    </div>
  );
}

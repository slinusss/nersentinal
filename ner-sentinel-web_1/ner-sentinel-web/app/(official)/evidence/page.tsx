import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceUploadForm } from "@/components/official/evidence-upload-form";

export default async function EvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ investigation?: string }>;
}) {
  const { investigation } = await searchParams;

  if (!investigation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No investigation selected</CardTitle>
          <CardDescription>
            Start an investigation from a report, then use &quot;Add evidence&quot; to get here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence capture</CardTitle>
        <CardDescription>Investigation {investigation}</CardDescription>
      </CardHeader>
      <CardContent>
        <EvidenceUploadForm investigationId={investigation} />
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Reporting
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Performance insights
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports and analytics</CardTitle>
          <CardDescription>
            Monitor activity and operational summaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            This area will soon include charts, exports, and report filters.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

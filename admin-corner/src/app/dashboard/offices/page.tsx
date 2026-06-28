import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OfficesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Offices
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Manage office locations
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Office overview</CardTitle>
          <CardDescription>
            Track locations, branches, and operational status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            This section will soon host office management tools and branch
            details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

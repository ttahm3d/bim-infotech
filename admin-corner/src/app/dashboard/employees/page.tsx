import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Employees
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Team management
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff directory</CardTitle>
          <CardDescription>
            View employee records and admin assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            This section will provide employee profiles, roles, and team
            insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

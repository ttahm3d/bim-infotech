import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Here is your command center for offices, employees, and reporting.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              See the most important operational activity at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              A quick summary layer will appear here soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent updates</CardTitle>
            <CardDescription>
              Track the latest changes made in your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Recent activity panels will be added here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>
              Jump into the most common admin tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Shortcuts will be wired in as features are built out.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

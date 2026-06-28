import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Settings
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Workspace preferences
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System settings</CardTitle>
          <CardDescription>
            Configure your dashboard experience and defaults.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            These preferences will be hooked up as the admin experience expands.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

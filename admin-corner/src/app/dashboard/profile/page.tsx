import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Profile
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Your account</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
          <CardDescription>
            Manage your account information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            This page will soon contain profile editing controls and account
            information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

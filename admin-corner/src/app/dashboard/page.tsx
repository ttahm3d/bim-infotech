import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            You are signed in and ready to manage the admin experience.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin overview</CardTitle>
            <CardDescription>
              Everything is ready for your next workflow.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>New report</Button>
            <Button variant="outline">Open settings</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Admin Corner
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Manage your workspace from a polished admin portal.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Start with a secure sign-in or create an account to access your
            dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Secure authentication</CardTitle>
              <CardDescription>
                Login and signup both connect to the Hono backend auth APIs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Successful auth stores the token locally and redirects you to
                the dashboard.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Black and white design</CardTitle>
              <CardDescription>
                The interface stays minimal, modern, and easy to scan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use the same theme system to extend the admin experience as
                features grow.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

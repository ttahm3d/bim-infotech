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
            Clean, monochrome UI for your admin experience.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            This setup uses a classic black-and-white shadcn-inspired palette
            with black as the primary action color.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Primary Action</Button>
            <Button variant="outline">Secondary</Button>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Black and white theme</CardTitle>
              <CardDescription>
                Neutral surfaces with bold black accents for clarity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The theme tokens are configured for a polished, minimal look
                that works well for dashboards and admin tools.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shadcn-ready components</CardTitle>
              <CardDescription>
                Buttons and cards are already wired for rapid UI building.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add more UI primitives from the same pattern as your product
                grows.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

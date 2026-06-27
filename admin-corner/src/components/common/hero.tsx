import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Award } from "lucide-react";

const stats = [
  { value: "1200+", label: "Students trained" },
  { value: "8 yrs", label: "Industry experience" },
  { value: "4", label: "Training centres" },
  { value: "100%", label: "Hands-on curriculum" },
];

const locations = [
  "Bengaluru — Koramangala",
  "Bengaluru — Whitefield",
  "Bengaluru — Jayanagar",
  "Gauribidanur",
];

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-zinc-100 px-6 py-20 text-center text-zinc-800">
      {/* Eyebrow badge */}
      <Badge
        variant="outline"
        className="mb-6 gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-zinc-600"
      >
        <Award className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
        Autodesk Authorised Training
      </Badge>

      {/* Headline */}
      <h1 className="max-w-2xl text-5xl font-medium leading-[1.1] tracking-tight text-zinc-900">
        Build your career in{" "}
        <span className="text-indigo-400">BIM &amp; Revit</span>
        <br />
        the right way.
      </h1>

      {/* Sub-copy */}
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-zinc-600">
        Hands-on courses in Revit, AutoCAD, and BIM workflows — taught by
        practitioners, not just instructors. From beginner to professional, we
        meet you where you are.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          size="lg"
          className="bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] transition-all"
        >
          Explore courses
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-indigo-700 bg-transparent text-indigo-500 hover:bg-indigo-900 hover:text-white active:scale-[0.98] transition-all"
        >
          Learn about us
        </Button>
      </div>

      {/* Stats strip */}
      <div className="mt-14 flex flex-wrap items-stretch justify-center divide-x divide-zinc-300 overflow-hidden rounded-xl border border-zinc-300 bg-white">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center px-8 py-5">
            <span className="text-xl font-medium tracking-tight text-zinc-900">
              {s.value}
            </span>
            <span className="mt-1 text-xs text-zinc-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Location pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {locations.map((loc) => (
          <span
            key={loc}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-600"
          >
            <MapPin className="h-3 w-3 text-indigo-500" aria-hidden="true" />
            {loc}
          </span>
        ))}
      </div>
    </section>
  );
}

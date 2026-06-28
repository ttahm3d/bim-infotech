import { cn } from "@/lib/utils";

interface LogoProps {
  mode?: "brand" | "light" | "dark";
  className?: string;
}

export default function Logo({ mode = "brand", className }: LogoProps) {
  const colors = {
    brand: {
      text: "text-indigo-600",
      subText: "text-slate-600",
    },
    light: {
      text: "text-white",
      subText: "text-slate-300",
    },
    dark: {
      text: "text-slate-900",
      subText: "text-slate-600",
    },
  };

  const current = colors[mode];

  return (
    <div className={cn("flex flex-col justify-center", className)}>
      <h2 className={cn("text-xl font-bold", current.text)}>BIM Infotech</h2>
      <small className={cn("text-sm tracking-wider", current.subText)}>
        Admin corner
      </small>
    </div>
  );
}

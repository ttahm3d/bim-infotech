import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Hero from "@/components/common/hero";
import Header from "@/components/common/header";

export default function Home() {
  return (
    <main className="min-h-screen bg-accent">
      <Header />
      <Hero />
    </main>
  );
}

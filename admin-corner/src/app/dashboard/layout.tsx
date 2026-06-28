"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import Sidebar from "@/components/common/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      const timeout = window.setTimeout(() => {
        router.replace("/");
      }, 1200);
      return () => window.clearTimeout(timeout);
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
            403 Unauthorized
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100">
            Access denied
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            You need to be signed in to view the dashboard. Redirecting you back
            home.
          </p>
          <Button
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500"
            onClick={() => router.replace("/")}
          >
            Go to home
          </Button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      {/* Main content — no header */}
      <main className="relative flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        {/* Floating hamburger — mobile only */}
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 shadow-lg transition-colors hover:bg-zinc-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {children}
      </main>
    </div>
  );
}

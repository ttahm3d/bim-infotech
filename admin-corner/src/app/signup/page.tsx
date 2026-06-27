"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post<{
        data?: { token?: string };
        error?: string;
      }>("/auth/signup", { name, email, password });

      const data = response.data;

      if (!response.status || response.status >= 400) {
        throw new Error(data.error || "Signup failed");
      }

      const token = data.data?.token;
      if (!token) {
        throw new Error("Authentication token missing");
      }

      useAuthStore.getState().setAuth({ token, name, email });

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-foreground lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
      >
        ← Back to home
      </Link>

      <section className="flex items-center justify-center bg-indigo-600 px-6 py-16 text-white sm:px-10 lg:px-16">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-indigo-100">
            Admin Corner
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Create your admin account.
          </h1>
          <p className="text-lg text-indigo-100/90">
            Set up your workspace with a secure, polished sign-up experience.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>
                Sign up to access the admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-indigo-500"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-indigo-500"
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-indigo-500"
                    placeholder="At least 8 characters"
                  />
                </div>
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <p className="mt-6 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

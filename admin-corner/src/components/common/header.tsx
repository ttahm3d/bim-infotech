"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function Header() {
  const { isSignedIn, name, email } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initial = (
    name?.trim().charAt(0) ||
    email?.trim().charAt(0) ||
    "U"
  ).toUpperCase();

  return (
    <header className="flex items-center justify-between bg-black px-6 py-4 text-white">
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-bold">BIM Infotech</h2>
        <small className="text-sm tracking-wider">Admin corner</small>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => {
            if (!isSignedIn) {
              setMenuOpen((open) => !open);
            }
          }}
          aria-label={isSignedIn ? "Signed in account" : "Open account menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/20"
        >
          {isSignedIn ? (
            <span className="text-sm font-semibold">{initial}</span>
          ) : (
            <User className="h-5 w-5" />
          )}
        </button>

        {menuOpen && !isSignedIn ? (
          <div className="absolute right-0 mt-2 w-40 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
            <Link
              href="/login"
              className="block rounded px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block rounded px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              onClick={() => setMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}

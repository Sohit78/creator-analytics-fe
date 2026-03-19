"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { clearStoredAuth, getStoredAuth } from "../lib/auth";

function NavLink({ href, label }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        active ? "bg-brand-200 text-slate-900" : "text-slate-700 hover:bg-brand-100"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AppShell({ children, adminOnly = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredAuth();

    if (!stored?.token || !stored?.user) {
      router.replace("/login");
      return;
    }

    setAuth(stored);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    async function validateSession() {
      if (!auth?.token) {
        return;
      }

      try {
        const res = await api.me();
        const nextAuth = { token: auth.token, user: res.user };
        setAuth(nextAuth);
        localStorage.setItem("creator_analytics_auth", JSON.stringify(nextAuth));

        if (adminOnly && res.user.role !== "admin") {
          router.replace("/dashboard");
        }
      } catch (err) {
        setError(err.message || "Session expired");
        clearStoredAuth();
        router.replace("/login");
      }
    }

    validateSession();
  }, [auth?.token, adminOnly, router]);

  const links = useMemo(() => {
    if (!auth?.user) {
      return [];
    }

    const base = [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/creators", label: "Creators" }
    ];

    if (auth.user.role === "admin") {
      base.push({ href: "/admin", label: "Admin" });
    }

    return base;
  }, [auth]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore server logout errors for stateless JWT.
    }

    clearStoredAuth();
    router.replace("/login");
  };

  if (loading || !auth) {
    return <main className="p-8 text-center text-slate-600">Checking session...</main>;
  }

  if (adminOnly && auth.user.role !== "admin") {
    return <main className="p-8 text-center text-slate-600">Redirecting...</main>;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-100 bg-brand-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900">Creator Analytics</h1>
            <nav className="flex items-center gap-1">
              {links.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-600">
              Signed in as <span className="font-semibold">{auth.user.name}</span> ({auth.user.role})
            </p>
            <button type="button" className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {error ? <p className="mx-auto mt-4 max-w-6xl px-4 text-sm text-rose-600">{error}</p> : null}

      <main className="mx-auto max-w-6xl px-4 py-6">{children(auth)}</main>
    </div>
  );
}

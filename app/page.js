"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuth } from "../lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth?.token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return <main className="p-8 text-center text-slate-600">Redirecting...</main>;
}

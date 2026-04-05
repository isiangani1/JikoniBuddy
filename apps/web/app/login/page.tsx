"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const MotionDiv = motion.div as any;
  const delicacies = [
    { name: "Nairobi Grill", note: "Smoky tilapia with herb rice" },
    { name: "Kilimani Kitchen", note: "Weekday meal-prep bundles" },
    { name: "Swahili Spice", note: "Coconut curry with chapati" },
    { name: "Urban Plates", note: "Protein-packed bowls" },
    { name: "Mama Jay", note: "Comfort food for families" },
    { name: "Green Bowl Co.", note: "Fresh salads & detox juices" },
    { name: "TasteHub Express", note: "Lunch boxes in 45 mins" },
    { name: "Amani Caterers", note: "Events & office trays" }
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Login failed. Check your credentials.");
      }

      const data = (await response.json()) as {
        role?: string;
        buddy?: { id?: string; name?: string };
      };
      const role = data.role ?? "buyer";
      sessionStorage.setItem("jb_auth", "true");
      sessionStorage.setItem("jb_role", role);
      localStorage.removeItem("jb_auth");
      localStorage.removeItem("jb_role");
      localStorage.removeItem("jb_user_name");
      localStorage.removeItem("jb_helper_id");
      if (data.buddy?.name) {
        sessionStorage.setItem("jb_user_name", data.buddy.name);
      } else if (email) {
        sessionStorage.setItem("jb_user_name", email.split("@")[0] ?? "User");
      }
      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      if (role === "buddy") {
        if (data.buddy?.id) {
          sessionStorage.setItem("jb_helper_id", data.buddy.id);
        }
        router.push("/buddy-portal/dashboard");
        return;
      }

      router.push(`/${role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(20,6,40,0.35)]">
            <h2 className="text-lg font-semibold text-white">Sign in</h2>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
              <label className="flex flex-col gap-2 text-sm text-white/70">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@jikoni.buddy"
                  defaultValue="buyer@jikoni.buddy"
                  required
                  className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="demo"
                  required
                  className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                />
              </label>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <button type="submit" className="rounded-full bg-[#2dd4bf] px-4 py-3 text-sm font-semibold text-[#0d0a14]">
                {isLoading ? "Signing in..." : "Continue"}
              </button>
            </form>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
              <span>Don’t have an account?</span>
              <a className="text-white underline" href="/register?role=buyer">
                Create one
              </a>
            </div>
          </section>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Jikoni Buddy</p>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Jikoni Buddy Marketplace</h1>
              <p className="text-base text-white/70">
                Buyer, seller, and admin experiences in one secure platform. Log in
                to access your tailored dashboard.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Today on Jikoni Buddy</p>
                <h3 className="text-xl font-semibold text-white">Fresh delicacies moving live in Nairobi.</h3>
                <p className="text-sm text-white/60">
                  Watch top dishes glide by as you sign in.
                </p>
              </div>
              <div className="mt-6 h-64 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4">
                <MotionDiv
                  className="flex flex-col gap-3"
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{ duration: 18, ease: "linear", repeat: Infinity }}
                >
                  {[...delicacies, ...delicacies].map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-[#2dd4bf]" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                        <p className="text-xs text-white/60">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </MotionDiv>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">Live</span>
                  <span>Chef availability updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">Auto</span>
                  <span>Real-time rotation</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

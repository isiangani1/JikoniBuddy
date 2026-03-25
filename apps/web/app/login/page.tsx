"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Jikoni Buddy</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Jikoni Buddy Marketplace</h1>
            <p className="text-base text-white/70">
              Buyer, seller, and admin experiences in one secure platform. Log in
              to access your tailored dashboard.
            </p>
          </div>

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
              <a className="text-white underline" href="/register">
                Create one
              </a>
            </div>
          </section>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Buyer Flow",
              desc: "Scheduled orders, chat, real-time updates, and ratings."
            },
            {
              title: "Seller Flow",
              desc: "Menus, lead times, availability, and Buddy Pool requests."
            },
            {
              title: "Admin Flow",
              desc: "Approvals, disputes, refunds, and metrics dashboard."
            }
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-white/60">{card.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}

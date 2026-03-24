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
      localStorage.setItem("jb_auth", "true");
      localStorage.setItem("jb_role", role);
      if (data.buddy?.name) {
        localStorage.setItem("jb_user_name", data.buddy.name);
      } else if (email) {
        localStorage.setItem("jb_user_name", email.split("@")[0] ?? "User");
      }
      if (role === "buddy") {
        if (data.buddy?.id) {
          localStorage.setItem("jb_helper_id", data.buddy.id);
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
      <main className="login-page">
        <section className="hero hero-landing parallax-section">
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow">Jikoni Buddy</p>
            <h1>Jikoni Buddy Marketplace</h1>
            <p className="subhead">
              Buyer, seller, and admin experiences in one secure platform. Log in
              to access your tailored dashboard.
            </p>
          </div>

          <div className="hero-panel">
            <section className="login-card" style={{ margin: 0 }}>
              <h2>Sign in</h2>
              <form onSubmit={handleSubmit} className="form">
                <label className="field">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@jikoni.buddy"
                    defaultValue="buyer@jikoni.buddy"
                    required
                  />
                </label>
                <label className="field">
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    defaultValue="demo"
                    required
                  />
                </label>
                {error ? <p className="error">{error}</p> : null}
                <button type="submit" className="primary">
                  {isLoading ? "Signing in..." : "Continue"}
                </button>
              </form>
              <div className="form-footer">
                <span className="muted">Don’t have an account?</span>
                <a className="link" href="/register">
                  Create one
                </a>
              </div>
            </section>
          </div>
        </section>

        <section className="feature parallax-section alt">
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Buyer Flow</h3>
              <p>Scheduled orders, chat, real-time updates, and ratings.</p>
            </div>
            <div className="feature-card">
              <h3>Seller Flow</h3>
              <p>Menus, lead times, availability, and Buddy Pool requests.</p>
            </div>
            <div className="feature-card">
              <h3>Admin Flow</h3>
              <p>Approvals, disputes, refunds, and metrics dashboard.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

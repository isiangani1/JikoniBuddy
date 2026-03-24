"use client";

import { useParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { buddies } from "@/data/buddies";

export default function BuddyProfilePage() {
  const params = useParams();
  const buddy = buddies.find((item) => item.id === params.id);

  if (!buddy) {
    return (
      <>
        <SiteHeader />
        <main className="category-page">
          <section className="section fade-in">
            <h2>Buddy not found</h2>
            <p className="muted">Please return to Buddy Pool.</p>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Buddy Profile</p>
            <h1>{buddy.name}</h1>
            <p className="subhead">{buddy.role}</p>
            <p className="muted">Rating {buddy.rating.toFixed(1)} ★</p>
            <div className="hero-actions">
              {buddy.skills.map((skill) => (
                <span key={skill} className="badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="category-hero-card">
            <h3>Reserve this buddy</h3>
            <p className="muted">Available for flexible schedules.</p>
            <button className="primary full">Request Buddy</button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

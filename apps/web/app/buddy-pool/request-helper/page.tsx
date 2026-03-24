import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BuddyPoolRequestForm from "@/components/BuddyPoolRequestForm";

export default function RequestHelperPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Buddy Pool</p>
            <h1>Request a Helper</h1>
            <p className="subhead">
              Tell us what you need, when you need it, and we’ll match you with
              trusted helpers.
            </p>
          </div>
          <div className="category-hero-card">
            <h3>Fast matching</h3>
            <p className="muted">Matches are ranked by distance, skill, and rating.</p>
            <button className="primary full">Learn Matching</button>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Request details</h2>
          <BuddyPoolRequestForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

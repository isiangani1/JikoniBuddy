import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function HowMatchingWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Buddy Pool</p>
            <h1>How Matching Works</h1>
            <p className="subhead">
              We match helpers based on distance, skills, availability, and
              rating. The best fit gets priority.
            </p>
          </div>
          <div className="category-hero-card">
            <h3>Matching signals</h3>
            <ul>
              <li>Location proximity</li>
              <li>Skill match</li>
              <li>Availability</li>
              <li>Ratings</li>
            </ul>
            <button className="primary full">View Request Flow</button>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Step-by-step</h2>
          <div className="steps">
            <div className="step-card">
              <span>1</span>
              <h3>Request created</h3>
              <p>Seller specifies task, time, and location.</p>
            </div>
            <div className="step-card">
              <span>2</span>
              <h3>Helpers ranked</h3>
              <p>System scores helpers and notifies the best ones.</p>
            </div>
            <div className="step-card">
              <span>3</span>
              <h3>Seller confirms</h3>
              <p>Seller chooses a helper and confirms assignment.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

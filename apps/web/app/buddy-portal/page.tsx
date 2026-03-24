import Link from "next/link";

const skillTiles = [
  {
    title: "Cooking",
    note: "Prep, cook, and plate orders for busy sellers."
  },
  {
    title: "Packaging",
    note: "Handle boxing, labeling, and sealing with care."
  },
  {
    title: "Delivery",
    note: "Move orders quickly while keeping them secure."
  }
];

const portalSteps = [
  {
    title: "Apply & verify",
    note: "Submit your ID, photo, and contact details for review."
  },
  {
    title: "Go online",
    note: "Set your availability so sellers can find you instantly."
  },
  {
    title: "Accept jobs",
    note: "Pick work that matches your skill and location."
  },
  {
    title: "Get paid",
    note: "Track earnings and payout status in one place."
  }
];

export default function BuddyPortalLandingPage() {
  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Buddy Portal</p>
            <h1>Step into the Buddy Pool and get booked fast.</h1>
            <p className="subhead">
              Turn your cooking, packaging, or delivery skills into reliable work.
              Go online, accept requests, and build your rating.
            </p>
            <div className="hero-actions">
              <Link className="primary" href="/buddy-portal/signup">
                Start Buddy Onboarding
              </Link>
              <Link className="ghost" href="/buddy-portal/status">
                Check Application Status
              </Link>
            </div>
          </div>
          <div className="category-hero-card">
            <h3>What you control</h3>
            <ul>
              <li>Skills and job types</li>
              <li>Preferred locations</li>
              <li>Online hours</li>
              <li>Job acceptance</li>
            </ul>
            <Link className="primary full" href="/buddy-portal/signup">
              Become a Buddy
            </Link>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Choose your skill track</h2>
          <div className="category-grid">
            {skillTiles.map((skill) => (
              <div key={skill.title} className="category-card">
                <h3>{skill.title}</h3>
                <p>{skill.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section fade-in">
          <h2>Your Buddy journey</h2>
          <div className="steps">
            {portalSteps.map((step, index) => (
              <div key={step.title} className="step-card">
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section fade-in">
          <div className="section-header">
            <h2>Ready to get verified?</h2>
            <p>Fast verification helps you accept requests sooner.</p>
          </div>
          <div className="hero-actions">
            <Link className="primary" href="/buddy-portal/signup">
              Submit your application
            </Link>
            <Link className="ghost" href="/buddy-portal/status">
              View status lifecycle
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

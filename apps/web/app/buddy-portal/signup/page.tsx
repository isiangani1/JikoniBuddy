 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuddyPortalSignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const skills = ["cooking", "packaging", "delivery"].filter((skill) =>
      formData.get(`skill-${skill}`)
    );

    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      skills,
      location: {
        label: String(formData.get("location") ?? "Nairobi"),
        lat: Number(formData.get("lat") ?? -1.2833),
        lng: Number(formData.get("lng") ?? 36.8167)
      },
      radiusKm: Number(formData.get("radius") ?? 5),
      idNumber: String(formData.get("idNumber") ?? "")
    };

    try {
      const response = await fetch("/api/buddy/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Unable to submit. Please try again.");
      }

      router.push("/buddy-portal/status");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Buddy Onboarding</p>
            <h1>Apply to join the Buddy Pool.</h1>
            <p className="subhead">
              Share your skills, location, and verification documents. Our team
              reviews every application to keep sellers and buyers safe.
            </p>
            <div className="hero-actions">
              <button className="primary">Submit application</button>
              <button className="ghost">Save for later</button>
            </div>
          </div>
          <div className="category-hero-card">
            <h3>What we need</h3>
            <ul>
              <li>Personal details and contact</li>
              <li>Skill selection</li>
              <li>Preferred service area</li>
              <li>Verification uploads</li>
            </ul>
            <p className="subhead">
              Status starts as Pending and moves to Approved after review.
            </p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Buddy application form</h2>
          <form className="support-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="field">
                <span>Full name</span>
                <input name="name" placeholder="e.g. Amina Otieno" required />
              </label>
              <label className="field">
                <span>Phone number</span>
                <input name="phone" placeholder="e.g. +254 712 345 678" required />
              </label>
            </div>

            <div className="form-row">
              <label className="field">
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  placeholder="amina@example.com"
                  required
                />
              </label>
              <label className="field">
                <span>Create password</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                  required
                />
              </label>
            </div>

            <div className="category-hero-card">
              <h3>Choose your skill type</h3>
              <div className="form-row">
                <label className="field">
                  <span>
                    <input name="skill-cooking" type="checkbox" /> Cooking
                  </span>
                </label>
                <label className="field">
                  <span>
                    <input name="skill-packaging" type="checkbox" /> Packaging
                  </span>
                </label>
                <label className="field">
                  <span>
                    <input name="skill-delivery" type="checkbox" /> Delivery
                  </span>
                </label>
              </div>
              <p className="subhead">
                Select all skills you are comfortable with. This determines job
                requests you receive.
              </p>
            </div>

            <div className="category-hero-card">
              <h3>Location & availability</h3>
              <div className="form-row">
                <label className="field">
                  <span>Primary location</span>
                  <input
                    name="location"
                    placeholder="Westlands, Kilimani, CBD"
                    required
                  />
                </label>
                <label className="field">
                  <span>Preferred radius</span>
                  <input name="radius" placeholder="e.g. 5" />
                </label>
              </div>
              <label className="field">
                <span>Typical availability</span>
                <input placeholder="Weekdays 9am - 7pm" />
              </label>
              <div className="form-row">
                <label className="field">
                  <span>Latitude</span>
                  <input name="lat" placeholder="-1.2833" />
                </label>
                <label className="field">
                  <span>Longitude</span>
                  <input name="lng" placeholder="36.8167" />
                </label>
              </div>
            </div>

            <div className="category-hero-card">
              <h3>Verification uploads</h3>
              <div className="form-row">
                <label className="field">
                  <span>Government ID</span>
                  <input name="idNumber" placeholder="ID / Passport number" />
                </label>
                <label className="field">
                  <span>Profile photo</span>
                  <input type="file" />
                </label>
              </div>
              <p className="subhead">
                Clear, well-lit images speed up review time.
              </p>
            </div>

            {error ? <p className="error">{error}</p> : null}
            <button className="primary full" type="submit">
              {isSubmitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

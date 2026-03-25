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
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Buddy Onboarding</p>
            <h1>Apply to join the Buddy Pool.</h1>
            <p className="text-white/70 m-0 text-lg">
              Share your skills, location, and verification documents. Our team
              reviews every application to keep sellers and buyers safe.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">Submit application</button>
              <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur">Save for later</button>
            </div>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>What we need</h3>
            <ul>
              <li>Personal details and contact</li>
              <li>Skill selection</li>
              <li>Preferred service area</li>
              <li>Verification uploads</li>
            </ul>
            <p className="text-white/70 m-0 text-lg">
              Status starts as Pending and moves to Approved after review.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
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

            <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
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
              <p className="text-white/70 m-0 text-lg">
                Select all skills you are comfortable with. This determines job
                requests you receive.
              </p>
            </div>

            <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
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

            <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
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
              <p className="text-white/70 m-0 text-lg">
                Clear, well-lit images speed up review time.
              </p>
            </div>

            {error ? <p className="error">{error}</p> : null}
            <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity" type="submit">
              {isSubmitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

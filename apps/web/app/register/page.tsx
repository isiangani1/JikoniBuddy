"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });
const MotionDiv = motion.div as any;

type Role = "buyer" | "seller" | "buddy";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("buyer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [mapError, setMapError] = useState<string | null>(null);
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
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      role,
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      skills: ["cooking", "packaging", "delivery"].filter((skill) =>
        formData.get(`skill-${skill}`)
      ),
      location: {
        label: String(formData.get("location") ?? "Nairobi"),
        lat: Number(formData.get("lat") ?? -1.2833),
        lng: Number(formData.get("lng") ?? 36.8167)
      },
      radiusKm: Number(formData.get("radius") ?? 5),
      idNumber: String(formData.get("idNumber") ?? "")
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as {
        role?: string;
        buddy?: { id?: string };
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Registration failed. Please try again.");
      }
      // After successful registration, send users to login.
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseCurrent = () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported on this device.");
      return;
    }
    setMapError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsMapOpen(true);
      },
      () => setMapError("Unable to fetch current location.")
    );
  };

  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Create Account</p>
            <h1>Join Jikoni Buddy in one step.</h1>
          </div>
        </section>

        <section className="section fade-in register-grid">
          <div className="register-form">
            <h2>Registration form</h2>
            <form className="support-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Choose your role</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="buddy">Buddy</option>
              </select>
            </label>

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

              {role === "buddy" ? (
              <>
                <div className="category-hero-card">
                  <h3>Buddy skills</h3>
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
                </div>

                <div className="category-hero-card">
                  <h3>Location details</h3>
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
                      <span>Preferred radius (km)</span>
                      <input name="radius" placeholder="e.g. 5" />
                    </label>
                  </div>
                  <div className="location-actions">
                    <button type="button" className="ghost" onClick={handleUseCurrent}>
                      Use my location
                    </button>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => setIsMapOpen(true)}
                    >
                      Pick on map
                    </button>
                  </div>
                  <div className="map-coords">
                    <span className="muted">
                      Selected coordinates:{" "}
                      {coords
                        ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                        : "Not selected yet"}
                    </span>
                  </div>
                  <input name="lat" type="hidden" value={coords?.lat ?? -1.2833} />
                  <input name="lng" type="hidden" value={coords?.lng ?? 36.8167} />
                </div>

                <div className="category-hero-card">
                  <h3>Verification</h3>
                  <div className="form-row">
                    <label className="field">
                      <span>ID number</span>
                      <input name="idNumber" placeholder="ID / Passport number" />
                    </label>
                    <label className="field">
                      <span>Profile photo</span>
                      <input type="file" />
                    </label>
                  </div>
                </div>
              </>
            ) : null}

              {error ? <p className="error">{error}</p> : null}
              <button className="primary full" type="submit">
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>

          <div className="register-showcase">
            <div className="showcase-header">
              <p className="eyebrow">Today on Jikoni Buddy</p>
              <h3>Fresh delicacies moving live in Nairobi.</h3>
              <p className="muted">
                Watch top dishes glide by as you sign up.
              </p>
            </div>
            <div className="showcase-rail">
              <MotionDiv
                className="showcase-track"
                animate={{ y: ["0%", "-50%"] }}
                transition={{ duration: 18, ease: "linear", repeat: Infinity }}
              >
                {/* Clone the columns to create a seamless infinite scroll loop */}
                {[...delicacies, ...delicacies].map((item, index) => (
                  <div key={`${item.name}-${index}`} className="showcase-card">
                    <div className="showcase-dot" />
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.note}</p>
                    </div>
                  </div>
                ))}
              </MotionDiv>
            </div>
            <div className="showcase-footer">
              <div>
                <span className="badge">Live</span>
                <span className="muted">Chef availability updates</span>
              </div>
              <div>
                <span className="badge ghost">Auto</span>
                <span className="muted">Real-time rotation</span>
              </div>
            </div>
          </div>
        </section>

        {isMapOpen ? (
          <div className="map-modal" onClick={() => setIsMapOpen(false)}>
            <div className="map-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="map-header">
                <div>
                  <h3>Select your service location</h3>
                  <p className="muted">
                    Click on the map to drop a pin for your Buddy service area.
                  </p>
                  {mapError ? <p className="error">{mapError}</p> : null}
                </div>
                <button className="ghost" onClick={() => setIsMapOpen(false)}>
                  Close
                </button>
              </div>
              <div className="map-preview">
                <MapPicker
                  lat={coords?.lat}
                  lng={coords?.lng}
                  onSelect={(next) => setCoords(next)}
                />
              </div>
              <div className="map-actions">
                <button className="ghost" onClick={() => setIsMapOpen(false)}>
                  Cancel
                </button>
                <button className="primary" onClick={() => setIsMapOpen(false)}>
                  Use this location
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}

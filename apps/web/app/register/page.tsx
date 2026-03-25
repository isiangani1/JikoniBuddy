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
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Create Account</p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Join Jikoni Buddy in one step.</h1>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(20,6,40,0.35)]">
            <h2 className="text-lg font-semibold text-white">Registration form</h2>
            <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm text-white/70">
                <span>Choose your role</span>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as Role)}
                  className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white focus:border-white/30 focus:outline-none"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="buddy">Buddy</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  <span>Full name</span>
                  <input name="name" placeholder="e.g. Amina Otieno" required className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  <span>Phone number</span>
                  <input name="phone" placeholder="e.g. +254 712 345 678" required className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none" />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  <span>Email address</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="amina@example.com"
                    required
                    className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-white/70">
                  <span>Create password</span>
                  <input
                    name="password"
                    type="password"
                    placeholder="Create a secure password"
                    required
                    className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                  />
                </label>
              </div>

              {role === "buddy" ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h3 className="text-sm font-semibold text-white">Buddy skills</h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm text-white/70">
                      <label className="flex items-center gap-2">
                        <input name="skill-cooking" type="checkbox" /> Cooking
                      </label>
                      <label className="flex items-center gap-2">
                        <input name="skill-packaging" type="checkbox" /> Packaging
                      </label>
                      <label className="flex items-center gap-2">
                        <input name="skill-delivery" type="checkbox" /> Delivery
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h3 className="text-sm font-semibold text-white">Location details</h3>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm text-white/70">
                        <span>Primary location</span>
                        <input
                          name="location"
                          placeholder="Westlands, Kilimani, CBD"
                          required
                          className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm text-white/70">
                        <span>Preferred radius (km)</span>
                        <input name="radius" placeholder="e.g. 5" className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none" />
                      </label>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:text-white" onClick={handleUseCurrent}>
                        Use my location
                      </button>
                      <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:text-white" onClick={() => setIsMapOpen(true)}>
                        Pick on map
                      </button>
                    </div>
                    <div className="mt-3 text-xs text-white/50">
                      Selected coordinates:{" "}
                      {coords
                        ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                        : "Not selected yet"}
                    </div>
                    <input name="lat" type="hidden" value={coords?.lat ?? -1.2833} />
                    <input name="lng" type="hidden" value={coords?.lng ?? 36.8167} />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <h3 className="text-sm font-semibold text-white">Verification</h3>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm text-white/70">
                        <span>ID number</span>
                        <input name="idNumber" placeholder="ID / Passport number" className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none" />
                      </label>
                      <label className="flex flex-col gap-2 text-sm text-white/70">
                        <span>Profile photo</span>
                        <input type="file" className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white/70" />
                      </label>
                    </div>
                  </div>
                </>
              ) : null}

              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <button className="w-full rounded-full bg-[#2dd4bf] px-4 py-3 text-sm font-semibold text-[#0d0a14]" type="submit">
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Today on Jikoni Buddy</p>
              <h3 className="text-xl font-semibold text-white">Fresh delicacies moving live in Nairobi.</h3>
              <p className="text-sm text-white/60">
                Watch top dishes glide by as you sign up.
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
        </section>

        {isMapOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur" onClick={() => setIsMapOpen(false)}>
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#120c1c] p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Select your service location</h3>
                  <p className="text-sm text-white/60">
                    Click on the map to drop a pin for your Buddy service area.
                  </p>
                  {mapError ? <p className="text-sm text-red-400">{mapError}</p> : null}
                </div>
                <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:text-white" onClick={() => setIsMapOpen(false)}>
                  Close
                </button>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <MapPicker
                  lat={coords?.lat}
                  lng={coords?.lng}
                  onSelect={(next) => setCoords(next)}
                />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white" onClick={() => setIsMapOpen(false)}>
                  Cancel
                </button>
                <button className="rounded-full bg-[#2dd4bf] px-4 py-2 text-sm font-semibold text-[#0d0a14]" onClick={() => setIsMapOpen(false)}>
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

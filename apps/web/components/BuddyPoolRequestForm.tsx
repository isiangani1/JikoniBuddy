"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const taskOptions = [
  { label: "Cooking", value: "cooking" },
  { label: "Packaging", value: "packaging" },
  { label: "Delivery Help", value: "delivery" }
];

type BuddyPoolRequestFormProps = {
  onSuccess?: (requestId: string) => void;
  sellerId?: string;
};

export default function BuddyPoolRequestForm({ onSuccess, sellerId: defaultSellerId }: BuddyPoolRequestFormProps = {}) {
  const [status, setStatus] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [mapError, setMapError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const form = new FormData(event.currentTarget);

    const payload = {
      sellerId: String(form.get("sellerId") ?? defaultSellerId ?? "seller-1"),
      taskType: String(form.get("taskType") ?? "cooking"),
      location: {
        label: String(form.get("location") ?? "Nairobi"),
        lat: Number(form.get("lat") ?? -1.286389),
        lng: Number(form.get("lng") ?? 36.817223)
      },
      timeWindow: {
        start: `${form.get("date")}T${form.get("startTime")}:00.000Z`,
        end: `${form.get("date")}T${form.get("endTime")}:00.000Z`
      },
      durationHours: Number(form.get("durationHours") ?? 2),
      compensation: Number(form.get("compensation") ?? 0) || undefined
    };

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      const response = await fetch(`${baseUrl}/buddy/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to create request.");
      }

      const data = await response.json();
      setStatus("Request created and matching started.");
      event.currentTarget.reset();
      
      if (onSuccess && data.request && data.request.id) {
        onSuccess(data.request.id);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Request failed.");
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
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(next);
        setIsMapOpen(true);
      },
      () => setMapError("Unable to fetch current location.")
    );
  };

  const mapSrc = useMemo(() => {
    if (!coords) return null;
    const delta = 0.01;
    const left = coords.lng - delta;
    const right = coords.lng + delta;
    const top = coords.lat + delta;
    const bottom = coords.lat - delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;
  }, [coords]);

  return (
    <form className="support-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Seller ID</span>
        <input name="sellerId" defaultValue={defaultSellerId} placeholder="seller-1" />
      </label>
      <p className="muted">
        Don’t have a seller profile?{" "}
        <Link href="/seller" className="link">
          Create one
        </Link>
        .
      </p>
      <label className="field">
        <span>Task type</span>
        <select name="taskType">
          {taskOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Location label</span>
        <input name="location" placeholder="Westlands, Nairobi" required />
      </label>
      <div className="location-actions">
        <button type="button" className="ghost" onClick={handleUseCurrent}>
          Use my location
        </button>
        <button type="button" className="ghost" onClick={() => setIsMapOpen(true)}>
          Pick on map
        </button>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Latitude</span>
          <input name="lat" type="number" step="0.000001" required />
        </label>
        <label className="field">
          <span>Longitude</span>
          <input name="lng" type="number" step="0.000001" required />
        </label>
      </div>
      <label className="field">
        <span>Date</span>
        <input name="date" type="date" required />
      </label>
      <div className="form-row">
        <label className="field">
          <span>Start time</span>
          <input name="startTime" type="time" required />
        </label>
        <label className="field">
          <span>End time</span>
          <input name="endTime" type="time" required />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Duration (hours)</span>
          <input name="durationHours" type="number" min="1" required />
        </label>
        <label className="field">
          <span>Compensation (optional)</span>
          <input name="compensation" type="number" min="0" />
        </label>
      </div>
      {status ? <p className="muted">{status}</p> : null}
      <button type="submit" className="primary full">
        Submit Buddy Request
      </button>

      {isMapOpen ? (
        <div className="map-modal" onClick={() => setIsMapOpen(false)}>
          <div className="map-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="map-header">
              <div>
                <h3>Select delivery location</h3>
                <p className="muted">Pin the exact spot for the helper.</p>
                {mapError ? <p className="error">{mapError}</p> : null}
              </div>
              <button className="ghost" onClick={() => setIsMapOpen(false)}>
                Close
              </button>
            </div>
            <div className="map-preview">
              {mapSrc ? (
                <iframe title="Buddy map" className="map-iframe" src={mapSrc} />
              ) : (
                <>
                  <div className="map-pin">📍</div>
                  <p>Use current location to load the map.</p>
                </>
              )}
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
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderWidget() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

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
        setLocation("Current location (Auto-detected)");
      },
      () => {
        setMapError("Unable to fetch current location.");
      }
    );
  };

  const handlePickFromMap = () => {
    setIsMapOpen(true);
  };

  const handleConfirmPin = () => {
    setLocation(
      coords
        ? `Pinned location (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`
        : location || "Pinned location (Exact spot)"
    );
    setIsMapOpen(false);
  };

  const handleSearchLocation = async () => {
    if (!location.trim()) return;
    setIsSearching(true);
    setMapError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const results = (await response.json()) as Array<{
        lat: string;
        lon: string;
      }>;
      if (!results.length) {
        throw new Error("Location not found.");
      }
      setCoords({ lat: Number(results[0].lat), lng: Number(results[0].lon) });
      setIsMapOpen(true);
    } catch (error) {
      setMapError(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setIsSearching(false);
    }
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
    <>
      <div className="order-widget">
        <h3>Schedule an Order</h3>
        <label className="field">
          <span>Delivery Location</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Enter location"
          />
        </label>
        <div className="location-actions">
          <button type="button" className="ghost" onClick={handleUseCurrent}>
            Use my location
          </button>
          <button type="button" className="ghost" onClick={handlePickFromMap}>
            Pick on map
          </button>
          <button
            type="button"
            className="ghost"
            onClick={handleSearchLocation}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search location"}
          </button>
        </div>
        <label className="field">
          <span>Date</span>
          <input type="date" />
        </label>
        <label className="field">
          <span>Time Window</span>
          <input placeholder="12:00 - 14:00" />
        </label>
        <button
          className="primary full"
          type="button"
          onClick={() => router.push("/buyer")}
        >
          Find Food
        </button>
      </div>

      {isMapOpen ? (
        <div className="map-modal">
          <div className="map-sheet">
            <div className="map-header">
              <div>
                <h3>Pick a delivery pin</h3>
                <p className="muted">Drag the pin to your exact drop-off point.</p>
                {mapError ? <p className="error">{mapError}</p> : null}
              </div>
              <button className="ghost" onClick={() => setIsMapOpen(false)}>
                Close
              </button>
            </div>
            <div className="map-preview">
              {mapSrc ? (
                <iframe
                  title="Delivery map"
                  className="map-iframe"
                  src={mapSrc}
                />
              ) : (
                <>
                  <div className="map-pin">📍</div>
                  <p>Search or use current location to load the map.</p>
                </>
              )}
            </div>
            <div className="map-actions">
              <button className="ghost" onClick={() => setIsMapOpen(false)}>
                Cancel
              </button>
              <button className="primary" onClick={handleConfirmPin}>
                Use this location
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

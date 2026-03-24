"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface DemandMapModalProps {
  onClose: () => void;
}

const DEMAND_ZONES = [
  { id: 1, lat: -1.2635, lng: 36.7644, label: "Westlands", intensity: "HIGH", radius: 50 },
  { id: 2, lat: -1.2985, lng: 36.7904, label: "Kilimani", intensity: "MEDIUM", radius: 35 },
  { id: 3, lat: -1.2185, lng: 36.8804, label: "Roysambu", intensity: "HIGH", radius: 45 },
  { id: 4, lat: -1.3032, lng: 36.8246, label: "CBD", intensity: "URGENT", radius: 60 }
];

export default function DemandMapModal({ onClose }: DemandMapModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div className="modal-card demand-map-modal" style={{ maxWidth: "900px", width: "95%" }}>
        <div className="modal-header" style={{ marginBottom: "1rem" }}>
          <div>
            <h2 style={{ margin: 0, color: "#2dd4bf" }}>🔥 Real-Time Demand Map</h2>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.6)" }}>Showing high-order zones near you</p>
          </div>
          <button className="ghost" onClick={onClose} style={{ fontSize: "1.5rem" }}>×</button>
        </div>

        <div className="map-frame" style={{ height: "450px", borderRadius: "16px", overflow: "hidden", border: "1px solid #7C5CFF" }}>
          <MapContainer center={[-1.2635, 36.7644]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {DEMAND_ZONES.map((zone) => (
              <CircleMarker
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  fillColor: zone.intensity === "URGENT" ? "#ff4e50" : (zone.intensity === "HIGH" ? "#7C5CFF" : "#2dd4bf"),
                  color: "white",
                  weight: 1,
                  fillOpacity: 0.4
                }}
              >
                <Popup>
                  <div style={{ color: "#000" }}>
                    <strong>{zone.label}</strong>
                    <br />
                    Status: <span style={{ color: zone.intensity === "URGENT" ? "red" : "purple" }}>{zone.intensity} Demand</span>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="modal-footer" style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="header-chip" style={{ background: "rgba(255, 78, 80, 0.2)" }}>
              <span className="dot" style={{ background: "#ff4e50" }}></span> Urgent
            </div>
            <div className="header-chip" style={{ background: "rgba(124, 92, 255, 0.2)" }}>
              <span className="dot" style={{ background: "#7C5CFF" }}></span> High
            </div>
          </div>
          <button className="primary" onClick={onClose}>ACKNOWLEDGE & START WORKING</button>
        </div>
      </div>
    </div>
  );
}

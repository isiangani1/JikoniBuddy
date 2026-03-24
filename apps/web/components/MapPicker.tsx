"use client";

import { useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

const defaultCenter: [number, number] = [-1.2833, 36.8167];

const markerIcon = new L.Icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
type MapPickerProps = {
  lat?: number;
  lng?: number;
  onSelect: (coords: { lat: number; lng: number }) => void;
};

function LocationMarker({
  position,
  onSelect
}: {
  position: [number, number];
  onSelect: (coords: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(event) {
      onSelect({ lat: event.latlng.lat, lng: event.latlng.lng });
    }
  });

  return <Marker position={position} icon={markerIcon} />;
}

export default function MapPicker({ lat, lng, onSelect }: MapPickerProps) {
  const position = useMemo<[number, number]>(
    () => [lat ?? defaultCenter[0], lng ?? defaultCenter[1]],
    [lat, lng]
  );

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom
      className="leaflet-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} onSelect={onSelect} />
    </MapContainer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map as MaplibreMap,
  NavigationControl,
  Popup,
  type ErrorEvent as MapErrorEvent,
  type GeoJSONSource,
  type MapLayerMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Race } from "@/lib/types";

const ISRAEL_CENTER: [number, number] = [34.9, 31.35];
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

interface MapViewProps {
  races: Race[];
  selectedId: string | null;
  onSelectRace: (id: string) => void;
}

function buildGeoJSON(races: Race[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: races
      .filter((r) => r.lat != null && r.lng != null)
      .map((r) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [r.lng as number, r.lat as number] },
        properties: {
          id: r.id,
          name: r.name,
          city: r.city,
          date: r.date,
        },
      })),
  };
}

function showPopup(
  popupRef: React.RefObject<Popup | null>,
  map: MaplibreMap,
  coords: [number, number],
  name: string,
  city: string,
  date: string
) {
  popupRef.current?.remove();
  const formattedDate = new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  popupRef.current = new Popup({ closeButton: true, offset: 14 })
    .setLngLat(coords)
    .setHTML(
      `<div style="padding:12px 14px;min-width:180px">
         <div style="font-weight:600;font-size:14px;color:#222">${escapeHtml(name)}</div>
         <div style="font-size:13px;color:#6a6a6a;margin-top:4px">${escapeHtml(city)} · ${formattedDate}</div>
       </div>`
    )
    .addTo(map);
}

export function MapView({ races, selectedId, onSelectRace }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const loadedRef = useRef(false);
  const [mapError, setMapError] = useState(false);
  const [ready, setReady] = useState(false);

  // init map once
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MaplibreMap({
      container: containerRef.current,
      style: MAP_STYLE,
      center: ISRAEL_CENTER,
      zoom: 6.4,
      minZoom: 5,
      maxZoom: 16,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.addControl(new NavigationControl({ showCompass: false }), "top-left");

    const onError = (e: MapErrorEvent) => {
      // only surface as a fatal banner if the base style itself failed
      if (!loadedRef.current) setMapError(true);
      console.error("map error", e?.error);
    };
    map.on("error", onError);

    map.on("load", () => {
      loadedRef.current = true;
      setReady(true);

      map.addSource("races", {
        type: "geojson",
        data: buildGeoJSON(races),
        cluster: true,
        clusterRadius: 48,
        clusterMaxZoom: 13,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "races",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#ffd1da",
            5,
            "#ff8ba0",
            15,
            "#ff385c",
          ],
          "circle-radius": ["step", ["get", "point_count"], 16, 5, 20, 15, 26],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "races",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 13,
        },
        paint: {
          "text-color": ["step", ["get", "point_count"], "#222222", 15, "#ffffff"],
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "races",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#ff385c",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.on("click", "clusters", (e: MapLayerMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0]?.properties?.cluster_id;
        const source = map.getSource("races") as GeoJSONSource;
        if (clusterId == null) return;
        source
          .getClusterExpansionZoom(clusterId)
          .then((zoom) => {
            const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
            map.easeTo({ center: coords, zoom });
          })
          .catch(() => {});
      });

      map.on("click", "unclustered-point", (e: MapLayerMouseEvent) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const { id, name, city, date } = feature.properties as {
          id: string;
          name: string;
          city: string;
          date: string;
        };
        onSelectRace(id);
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        showPopup(popupRef, map, coords, name, city, date);
      });

      for (const layer of ["clusters", "unclustered-point"]) {
        map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep source data fresh when the filtered race list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const source = map.getSource("races") as GeoJSONSource | undefined;
    source?.setData(buildGeoJSON(races));
  }, [races, ready]);

  // fly to + popup the selected race when chosen from a card
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !selectedId) return;
    const race = races.find((r) => r.id === selectedId);
    if (!race || race.lat == null || race.lng == null) return;
    map.flyTo({ center: [race.lng, race.lat], zoom: 12, duration: 900 });
    showPopup(popupRef, map, [race.lng, race.lat], race.name, race.city, race.date);
  }, [selectedId, races, ready]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      <div ref={containerRef} className="h-full w-full" />
      {mapError && (
        <div className="pointer-events-none absolute inset-x-3 top-3 rounded-sm bg-canvas/95 px-4 py-2 text-[13px] text-body shadow-card">
          לא ניתן לטעון את אריחי המפה כרגע (בעיית רשת) — רשימת המרוצים למטה עדיין זמינה ומעודכנת.
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

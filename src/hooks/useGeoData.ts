import { useState, useEffect } from "react";
import type { FeatureCollection } from "geojson";
import type { GeoDataHook, ResolutionType } from "../types/globe.types";

export const useGeoData = (resolution: ResolutionType = "low"): GeoDataHook => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fileName =
          resolution === "low" ? "countries110.geojson" : "countries50.geojson";
        const response = await fetch(`${import.meta.env.BASE_URL}${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data: FeatureCollection = await response.json();
        setGeoData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error loading GeoJSON";
        setError(errorMessage);
        console.error("Error loading GeoJSON:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGeoData();
  }, [resolution]);

  return { geoData, loading, error };
};

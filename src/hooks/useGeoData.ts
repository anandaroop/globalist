import { useState, useEffect } from "react";
import type { FeatureCollection } from "geojson";
import type { GeoDataHook } from "../types/globe.types";

export const useGeoData = (): GeoDataHook => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/src/data/countries110.geojson");
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
  }, []);

  return { geoData, loading, error };
};

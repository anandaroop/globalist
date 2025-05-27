---
mode: "agent"
---

There is a file at data/countries.geojson that contains a GeoJSON file with the country boundaries and basic metadata.

We will use that to render a globe-style map of the world with d3-geo and its geoOrthographic projection.

The map will be static for now, no extra interactivity or animations.

Install any dependencies needed to work with D3 and GeoJSON.

Implement this at src/Globe.tsx and update the project so that we display that instead of the placeholder in src/App.tsx.

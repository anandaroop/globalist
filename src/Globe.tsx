import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { select } from "d3-selection";
import { geoOrthographic, geoPath } from "d3-geo";
import { geoSatellite } from "d3-geo-projection";
import type { FeatureCollection } from "geojson";

interface GlobeProps {
  centralMeridian: number;
  centralParallel: number;
  zRotation: number;
  zoom: number;
  projectionType: "orthographic" | "satellite";
  onMeridianChange: (value: number) => void;
  onParallelChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  isDarkMode: boolean;
}

export interface GlobeRef {
  downloadSVG: () => void;
}

export const Globe = forwardRef<GlobeRef, GlobeProps>(
  (
    {
      centralMeridian,
      centralParallel,
      zRotation,
      zoom,
      projectionType,
      onMeridianChange,
      onParallelChange,
      onZoomChange,
      isDarkMode,
    },
    ref
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const projectionRef = useRef<ReturnType<typeof geoOrthographic> | null>(
      null
    );
    const pathRef = useRef<ReturnType<typeof geoPath> | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const currentZoomRef = useRef(zoom); // Track current zoom value

    // Keep zoom ref in sync with prop
    currentZoomRef.current = zoom;
    const dragStartRef = useRef<{
      mouse: [number, number];
      rotation: [number, number, number];
    } | null>(null);

    // Function to download the current SVG
    const downloadSVG = useCallback(() => {
      if (!svgRef.current) return;

      const svg = svgRef.current;

      // Create a complete SVG with proper XML declaration and namespace
      const completeSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}">
${svg.innerHTML}
</svg>`;

      // Create download link
      const blob = new Blob([completeSVG], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `globe-${centralMeridian.toFixed(1)}-${centralParallel.toFixed(1)}-${zRotation.toFixed(1)}-${zoom.toFixed(1)}x.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, [
      dimensions.width,
      dimensions.height,
      centralMeridian,
      centralParallel,
      zRotation,
      zoom,
    ]);

    // Expose downloadSVG method via ref
    useImperativeHandle(
      ref,
      () => ({
        downloadSVG,
      }),
      [downloadSVG]
    );

    // Calculate responsive dimensions
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Use 80% of the smaller dimension to ensure the globe fits
      const size = Math.min(containerWidth, containerHeight) * 0.8;

      setDimensions({ width: size, height: size });
    };

    // Update dimensions on mount and resize
    useEffect(() => {
      updateDimensions();

      const handleResize = () => updateDimensions();
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Load GeoJSON data once on mount
    useEffect(() => {
      fetch("/data/countries.geojson")
        .then((response) => response.json())
        .then((data: FeatureCollection) => {
          setGeoData(data);
        })
        .catch((error) => {
          console.error("Error loading GeoJSON:", error);
        });
    }, []);

    // Initialize the globe when data is loaded, dimensions change, or dark mode toggles
    useEffect(() => {
      if (!geoData) return;

      const { width, height } = dimensions;
      const baseSize = Math.min(width, height);

      // Empirically determined scales to make projections visually similar
      const baseScale =
        projectionType === "satellite"
          ? baseSize / 1.25 // Larger scale for satellite
          : baseSize / 2.15; // Original scale for orthographic

      // Apply zoom multiplication
      const scale = baseScale * zoom;

      // Define color schemes
      const lightTheme = {
        ocean: "#e8e8e8",
        oceanStroke: "#cccccc",
        countries: "#bbbbbb",
        countryStroke: "#ffffff",
      };

      const darkTheme = {
        ocean: "#333333",
        oceanStroke: "#555555",
        countries: "#666666",
        countryStroke: "#888888",
      };

      const colors = isDarkMode ? darkTheme : lightTheme;

      const svg = select(svgRef.current);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const projection =
        projectionType === "satellite"
          ? geoSatellite()
              .scale(scale)
              .translate([width / 2, height / 2])
              .rotate([-centralMeridian, -centralParallel, zRotation])
              .distance(2.0) // Reset to reasonable distance
              .clipAngle((Math.acos(1 / 2.0) * 180) / Math.PI)
          : geoOrthographic()
              .scale(scale)
              .translate([width / 2, height / 2])
              .rotate([-centralMeridian, -centralParallel, zRotation])
              .clipAngle(90);

      const path = geoPath().projection(projection);

      projectionRef.current = projection;
      pathRef.current = path;

      // Add ocean sphere (water background) first
      const graticule = { type: "Sphere" } as { type: "Sphere" };
      svg
        .append("path")
        .attr("class", "graticule")
        .datum(graticule)
        .attr("d", path)
        .attr("fill", colors.ocean)
        .attr("stroke", colors.oceanStroke)
        .attr("stroke-width", 1);

      // Render countries on top of ocean
      svg
        .selectAll(".country")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", colors.countries)
        .attr("stroke", colors.countryStroke)
        .attr("stroke-width", 0.5);
    }, [
      geoData,
      dimensions,
      isDarkMode,
      centralMeridian,
      centralParallel,
      zRotation,
      zoom,
      projectionType,
    ]);

    // Update only the projection when centralMeridian or centralParallel changes
    useEffect(() => {
      if (!geoData || !projectionRef.current || !pathRef.current) return;

      const svg = select(svgRef.current);

      // Update projection rotation
      projectionRef.current.rotate([
        -centralMeridian,
        -centralParallel,
        zRotation,
      ]);

      // Update all paths with new projection
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      svg.selectAll(".country").attr("d", pathRef.current as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      svg.select(".graticule").attr("d", pathRef.current as any);
    }, [
      centralMeridian,
      centralParallel,
      zRotation,
      zoom,
      geoData,
      projectionType,
    ]);

    // Convert screen coordinates to trackball sphere coordinates
    const mouseToSphere = useCallback(
      (
        x: number,
        y: number,
        width: number,
        height: number
      ): [number, number, number] => {
        // Normalize coordinates to [-1, 1] range
        const nx = (x - width / 2) / (Math.min(width, height) / 2);
        const ny = -(y - height / 2) / (Math.min(width, height) / 2); // Invert y

        const r2 = nx * nx + ny * ny;
        if (r2 <= 1) {
          // Inside sphere - project to sphere surface
          return [nx, ny, Math.sqrt(1 - r2)];
        } else {
          // Outside sphere - project to edge
          const r = Math.sqrt(r2);
          return [nx / r, ny / r, 0];
        }
      },
      []
    );

    // Calculate rotation from two sphere points
    const rotationFromVectors = useCallback(
      (
        v0: [number, number, number],
        v1: [number, number, number]
      ): [number, number, number] => {
        // Calculate rotation axis (cross product)
        const axis = [
          v0[1] * v1[2] - v0[2] * v1[1],
          v0[2] * v1[0] - v0[0] * v1[2],
          v0[0] * v1[1] - v0[1] * v1[0],
        ];

        // Calculate rotation angle
        const dot = v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
        const angle = Math.acos(Math.max(-1, Math.min(1, dot)));

        // Convert to Euler angles (approximation for small rotations)
        const k = angle / Math.sin(angle) || 0;
        return [
          (-axis[1] * k * 180) / Math.PI, // longitude (yaw)
          (axis[0] * k * 180) / Math.PI, // latitude (pitch)
          0, // roll (not used)
        ];
      },
      []
    );

    // Drag handlers
    const handleMouseDown = useCallback(
      (event: React.MouseEvent) => {
        if (!svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setIsDragging(true);
        dragStartRef.current = {
          mouse: [x, y],
          rotation: [centralMeridian, centralParallel, 0],
        };

        event.preventDefault();
      },
      [centralMeridian, centralParallel]
    );

    const handleMouseMove = useCallback(
      (event: React.MouseEvent) => {
        if (!isDragging || !dragStartRef.current || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Get sphere coordinates for start and current positions
        const v0 = mouseToSphere(
          dragStartRef.current.mouse[0],
          dragStartRef.current.mouse[1],
          rect.width,
          rect.height
        );
        const v1 = mouseToSphere(x, y, rect.width, rect.height);

        // Calculate rotation
        const deltaRotation = rotationFromVectors(v0, v1);

        // Apply rotation to initial state
        const newMeridian = dragStartRef.current.rotation[0] + deltaRotation[0];
        const newParallel = Math.max(
          -90,
          Math.min(90, dragStartRef.current.rotation[1] + deltaRotation[1])
        );

        onMeridianChange(newMeridian);
        onParallelChange(newParallel);
      },
      [
        isDragging,
        mouseToSphere,
        rotationFromVectors,
        onMeridianChange,
        onParallelChange,
      ]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      dragStartRef.current = null;
    }, []);

    // Touch handlers
    const handleTouchStart = useCallback(
      (event: React.TouchEvent) => {
        if (event.touches.length === 1 && svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          const touch = event.touches[0];
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;

          setIsDragging(true);
          dragStartRef.current = {
            mouse: [x, y],
            rotation: [centralMeridian, centralParallel, 0],
          };

          event.preventDefault();
        }
      },
      [centralMeridian, centralParallel]
    );

    const handleTouchMove = useCallback(
      (event: React.TouchEvent) => {
        if (
          !isDragging ||
          !dragStartRef.current ||
          !svgRef.current ||
          event.touches.length !== 1
        )
          return;

        const rect = svgRef.current.getBoundingClientRect();
        const touch = event.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const v0 = mouseToSphere(
          dragStartRef.current.mouse[0],
          dragStartRef.current.mouse[1],
          rect.width,
          rect.height
        );
        const v1 = mouseToSphere(x, y, rect.width, rect.height);

        const deltaRotation = rotationFromVectors(v0, v1);

        const newMeridian = dragStartRef.current.rotation[0] + deltaRotation[0];
        const newParallel = Math.max(
          -90,
          Math.min(90, dragStartRef.current.rotation[1] + deltaRotation[1])
        );

        onMeridianChange(newMeridian);
        onParallelChange(newParallel);

        event.preventDefault();
      },
      [
        isDragging,
        mouseToSphere,
        rotationFromVectors,
        onMeridianChange,
        onParallelChange,
      ]
    );

    const handleTouchEnd = useCallback(() => {
      setIsDragging(false);
      dragStartRef.current = null;
    }, []);

    // Wheel event handler for zoom
    const handleWheel = useCallback(
      (event: WheelEvent) => {
        event.preventDefault();

        if (!projectionRef.current || !pathRef.current || !svgRef.current)
          return;

        // Map wheel delta to zoom change (negative because scroll up should zoom in)
        const deltaZoom = -event.deltaY * 0.001;
        const newZoom = Math.max(
          1.0,
          Math.min(8.0, currentZoomRef.current + deltaZoom)
        );

        // Update ref immediately for next event
        currentZoomRef.current = newZoom;

        // Calculate new scale and update projection directly
        const baseSize = Math.min(dimensions.width, dimensions.height);
        const baseScale =
          projectionType === "satellite" ? baseSize / 1.25 : baseSize / 2.15;
        const newScale = baseScale * newZoom;

        // Update existing projection scale directly (much faster than recreating)
        projectionRef.current.scale(newScale);

        // Re-render paths with updated projection
        const svg = select(svgRef.current);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        svg.selectAll(".country").attr("d", pathRef.current as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        svg.select(".graticule").attr("d", pathRef.current as any);

        // Update state for slider sync
        onZoomChange(newZoom);
      },
      [zoom, onZoomChange, projectionType, dimensions.width, dimensions.height]
    );

    // Add wheel event listener to SVG
    useEffect(() => {
      const svg = svgRef.current;
      if (!svg) return;

      svg.addEventListener("wheel", handleWheel);

      return () => {
        svg.removeEventListener("wheel", handleWheel);
      };
    }, [handleWheel]);

    // Global event listeners for dragging outside the SVG
    useEffect(() => {
      if (!isDragging || !dragStartRef.current || !svgRef.current) return;

      const handleGlobalMouseMove = (event: MouseEvent) => {
        if (!svgRef.current || !dragStartRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const v0 = mouseToSphere(
          dragStartRef.current.mouse[0],
          dragStartRef.current.mouse[1],
          rect.width,
          rect.height
        );
        const v1 = mouseToSphere(x, y, rect.width, rect.height);

        const deltaRotation = rotationFromVectors(v0, v1);

        const newMeridian = dragStartRef.current.rotation[0] + deltaRotation[0];
        const newParallel = Math.max(
          -90,
          Math.min(90, dragStartRef.current.rotation[1] + deltaRotation[1])
        );

        onMeridianChange(newMeridian);
        onParallelChange(newParallel);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        dragStartRef.current = null;
      };

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }, [
      isDragging,
      mouseToSphere,
      rotationFromVectors,
      onMeridianChange,
      onParallelChange,
    ]);

    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg
          ref={svgRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none",
          }}
        ></svg>
      </div>
    );
  }
);

Globe.displayName = "Globe";

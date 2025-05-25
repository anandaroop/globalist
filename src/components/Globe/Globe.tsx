import { useEffect, useImperativeHandle, forwardRef, useCallback } from "react";
import type { GlobeProps, GlobeRef } from "../../types/globe.types";
import { useGeoData } from "../../hooks/useGeoData";
import { useDimensions } from "../../hooks/useDimensions";
import { useD3Projection } from "../../hooks/useD3Projection";
import { useGlobeInteraction } from "../../hooks/useGlobeInteraction";
import { useGlobeZoom } from "../../hooks/useGlobeZoom";
import {
  downloadSVGFromElement,
  generateGlobeFilename,
} from "../../utils/download";
import styles from "./Globe.module.css";

export const Globe = forwardRef<GlobeRef, GlobeProps>(
  (
    {
      centralMeridian,
      centralParallel,
      zRotation,
      zoom,
      projectionType,
      distance,
      onMeridianChange,
      onParallelChange,
      onZoomChange,
      isDarkMode,
    },
    ref
  ) => {
    const { geoData, loading, error } = useGeoData();
    const { dimensions, containerRef } = useDimensions();
    const { projection, path, svgRef, renderGlobe, updateProjection } =
      useD3Projection();

    const interaction = useGlobeInteraction({
      svgRef,
      onMeridianChange,
      onParallelChange,
      centralMeridian,
      centralParallel,
    });

    useGlobeZoom({
      svgRef,
      projection,
      path,
      projectionType,
      dimensions,
      zoom,
      onZoomChange,
    });

    // Download SVG functionality
    const downloadSVG = useCallback(() => {
      if (!svgRef.current) return;

      const filename = generateGlobeFilename(
        centralMeridian,
        centralParallel,
        zRotation,
        zoom
      );

      downloadSVGFromElement(
        svgRef.current,
        dimensions.width,
        dimensions.height,
        filename
      );
    }, [
      dimensions.width,
      dimensions.height,
      centralMeridian,
      centralParallel,
      zRotation,
      zoom,
      svgRef,
    ]);

    // Expose downloadSVG method via ref
    useImperativeHandle(
      ref,
      () => ({
        downloadSVG,
      }),
      [downloadSVG]
    );

    // Initial render when data is loaded or major properties change
    useEffect(() => {
      if (!geoData) return;

      renderGlobe({
        geoData,
        dimensions,
        centralMeridian,
        centralParallel,
        zRotation,
        zoom,
        projectionType,
        distance,
        isDarkMode,
      });
    }, [
      geoData,
      dimensions,
      isDarkMode,
      centralMeridian,
      centralParallel,
      zRotation,
      zoom,
      projectionType,
      distance,
      renderGlobe,
    ]);

    // Fast update for rotation changes only
    useEffect(() => {
      if (!geoData) return;

      updateProjection({
        centralMeridian,
        centralParallel,
        zRotation,
      });
    }, [
      centralMeridian,
      centralParallel,
      zRotation,
      updateProjection,
      geoData,
    ]);

    if (loading) {
      return (
        <div className={styles.container}>
          <div>Loading globe data...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.container}>
          <div>Error loading globe: {error}</div>
        </div>
      );
    }

    return (
      <div ref={containerRef} className={styles.container}>
        <svg
          ref={svgRef}
          className={`${styles.svg} ${interaction.isDragging ? styles.dragging : styles.idle}`}
          onMouseDown={interaction.handleMouseDown}
          onMouseMove={interaction.handleMouseMove}
          onMouseUp={interaction.handleMouseUp}
          onTouchStart={interaction.handleTouchStart}
          onTouchMove={interaction.handleTouchMove}
          onTouchEnd={interaction.handleTouchEnd}
        />
      </div>
    );
  }
);

Globe.displayName = "Globe";

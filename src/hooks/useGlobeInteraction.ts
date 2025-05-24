import { useState, useRef, useCallback, useEffect } from "react";
import type { DragState } from "../types/globe.types";
import { mouseToSphere, rotationFromVectors, clamp } from "../utils/math";
import { ROTATION_LIMITS } from "../utils/constants";

interface UseGlobeInteractionProps {
  svgRef: React.RefObject<SVGSVGElement>;
  onMeridianChange: (value: number) => void;
  onParallelChange: (value: number) => void;
  centralMeridian: number;
  centralParallel: number;
}

export const useGlobeInteraction = ({
  svgRef,
  onMeridianChange,
  onParallelChange,
  centralMeridian,
  centralParallel,
}: UseGlobeInteractionProps) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStart: null,
  });

  const dragStartRef = useRef<{
    mouse: [number, number];
    rotation: [number, number, number];
  } | null>(null);

  const startDrag = useCallback(
    (x: number, y: number) => {
      setDragState({ isDragging: true, dragStart: null });
      dragStartRef.current = {
        mouse: [x, y],
        rotation: [centralMeridian, centralParallel, 0],
      };
    },
    [centralMeridian, centralParallel]
  );

  const updateDrag = useCallback(
    (x: number, y: number) => {
      if (!dragState.isDragging || !dragStartRef.current || !svgRef.current)
        return;

      const rect = svgRef.current.getBoundingClientRect();

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
      const newParallel = clamp(
        dragStartRef.current.rotation[1] + deltaRotation[1],
        ROTATION_LIMITS.parallel.min,
        ROTATION_LIMITS.parallel.max
      );

      onMeridianChange(newMeridian);
      onParallelChange(newParallel);
    },
    [dragState.isDragging, svgRef, onMeridianChange, onParallelChange]
  );

  const endDrag = useCallback(() => {
    setDragState({ isDragging: false, dragStart: null });
    dragStartRef.current = null;
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      startDrag(x, y);
      event.preventDefault();
    },
    [startDrag, svgRef]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      updateDrag(x, y);
    },
    [updateDrag, svgRef]
  );

  const handleMouseUp = useCallback(() => {
    endDrag();
  }, [endDrag]);

  // Touch handlers
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (event.touches.length === 1 && svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const touch = event.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        startDrag(x, y);
        event.preventDefault();
      }
    },
    [startDrag, svgRef]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (
        !dragState.isDragging ||
        !svgRef.current ||
        event.touches.length !== 1
      )
        return;

      const rect = svgRef.current.getBoundingClientRect();
      const touch = event.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      updateDrag(x, y);
      event.preventDefault();
    },
    [dragState.isDragging, updateDrag, svgRef]
  );

  const handleTouchEnd = useCallback(() => {
    endDrag();
  }, [endDrag]);

  // Global event listeners for dragging outside the SVG
  useEffect(() => {
    if (!dragState.isDragging || !dragStartRef.current || !svgRef.current)
      return;

    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!svgRef.current || !dragStartRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      updateDrag(x, y);
    };

    const handleGlobalMouseUp = () => {
      endDrag();
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [dragState.isDragging, updateDrag, endDrag, svgRef]);

  return {
    isDragging: dragState.isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

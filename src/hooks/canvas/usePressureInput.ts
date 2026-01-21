import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Configuration for pressure input handling.
 */
export interface PressureConfig {
  /** Minimum stroke width multiplier (0-1, default: 0.3) */
  minPressure: number;
  /** Maximum stroke width multiplier (1-2, default: 1.5) */
  maxPressure: number;
  /** Smoothing factor for pressure values (0-1, default: 0.3) */
  smoothing: number;
  /** Whether pressure sensitivity is enabled */
  enabled: boolean;
}

/**
 * Pressure data from a pointer event.
 */
export interface PressureData {
  /** Normalized pressure value (0-1) */
  pressure: number;
  /** Type of pointer device */
  pointerType: 'pen' | 'mouse' | 'touch' | 'unknown';
  /** Tilt angle on X axis (degrees, -90 to 90) */
  tiltX: number;
  /** Tilt angle on Y axis (degrees, -90 to 90) */
  tiltY: number;
  /** Whether pressure is being applied */
  isActive: boolean;
}

const DEFAULT_CONFIG: PressureConfig = {
  minPressure: 0.3,
  maxPressure: 1.5,
  smoothing: 0.3,
  enabled: true,
};

/**
 * Hook for handling pressure-sensitive input from graphic tablets and styluses.
 * Uses the Pointer Events API to detect pressure, tilt, and pointer type.
 *
 * @param config - Optional configuration for pressure handling
 * @returns Pressure handling utilities and state
 */
export function usePressureInput(config: Partial<PressureConfig> = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // State for current pressure data
  const [pressureData, setPressureData] = useState<PressureData>({
    pressure: 0.5,
    pointerType: 'unknown',
    tiltX: 0,
    tiltY: 0,
    isActive: false,
  });

  // State for tablet detection
  const [isTabletDetected, setIsTabletDetected] = useState(false);
  const [isPenActive, setIsPenActive] = useState(false);

  // Ref for smoothed pressure value
  const smoothedPressure = useRef(0.5);

  // Track if we've ever seen a pen input
  const hasSeenPen = useRef(false);

  /**
   * Extract pressure data from a native PointerEvent.
   */
  const extractPressureData = useCallback(
    (event: PointerEvent): PressureData => {
      const pointerType = (event.pointerType as 'pen' | 'mouse' | 'touch') || 'unknown';

      // Detect tablet on first pen input
      if (pointerType === 'pen' && !hasSeenPen.current) {
        hasSeenPen.current = true;
        setIsTabletDetected(true);
      }

      // Get pressure (0-1), defaults to 0.5 for mouse
      let pressure = event.pressure;

      // For mouse, pressure is 0 when not pressed and 0.5 when pressed
      // We normalize this to always have a usable value
      if (pointerType === 'mouse') {
        pressure = event.buttons > 0 ? 0.5 : 0;
      }

      // Apply smoothing for pen input
      if (pointerType === 'pen' && mergedConfig.smoothing > 0) {
        smoothedPressure.current =
          smoothedPressure.current * mergedConfig.smoothing +
          pressure * (1 - mergedConfig.smoothing);
        pressure = smoothedPressure.current;
      }

      return {
        pressure,
        pointerType,
        tiltX: event.tiltX || 0,
        tiltY: event.tiltY || 0,
        isActive: event.buttons > 0,
      };
    },
    [mergedConfig.smoothing]
  );

  /**
   * Calculate stroke width based on pressure.
   * Returns a multiplier to apply to the base stroke width.
   */
  const calculateStrokeWidth = useCallback(
    (basePressure: number): number => {
      if (!mergedConfig.enabled) return 1;

      // Map pressure (0-1) to stroke multiplier range
      const range = mergedConfig.maxPressure - mergedConfig.minPressure;
      return mergedConfig.minPressure + basePressure * range;
    },
    [mergedConfig.enabled, mergedConfig.minPressure, mergedConfig.maxPressure]
  );

  /**
   * Handle pointer events from Konva.
   * Call this with the native event from a Konva event handler.
   */
  const handlePointerEvent = useCallback(
    (nativeEvent: MouseEvent | PointerEvent) => {
      // Check if it's actually a PointerEvent
      if ('pressure' in nativeEvent) {
        const data = extractPressureData(nativeEvent as PointerEvent);
        setPressureData(data);
        setIsPenActive(data.pointerType === 'pen' && data.isActive);
        return data;
      }

      // Fallback for regular MouseEvent
      return {
        pressure: 0.5,
        pointerType: 'mouse' as const,
        tiltX: 0,
        tiltY: 0,
        isActive: nativeEvent.buttons > 0,
      };
    },
    [extractPressureData]
  );

  /**
   * Get pressure-adjusted stroke widths for a series of points.
   * Used for variable-width strokes in freehand drawing.
   */
  const getPressureWeights = useCallback(
    (pressures: number[]): number[] => {
      return pressures.map((p) => calculateStrokeWidth(p));
    },
    [calculateStrokeWidth]
  );

  /**
   * Reset pressure state (call when drawing ends).
   */
  const resetPressure = useCallback(() => {
    smoothedPressure.current = 0.5;
    setIsPenActive(false);
    setPressureData((prev) => ({ ...prev, isActive: false, pressure: 0.5 }));
  }, []);

  // Effect to detect tablet on component mount by listening for pen events
  useEffect(() => {
    const detectTablet = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setIsTabletDetected(true);
        hasSeenPen.current = true;
        // Remove listener after detection
        window.removeEventListener('pointerdown', detectTablet);
      }
    };

    window.addEventListener('pointerdown', detectTablet);
    return () => window.removeEventListener('pointerdown', detectTablet);
  }, []);

  return {
    // State
    pressureData,
    isTabletDetected,
    isPenActive,
    config: mergedConfig,

    // Methods
    handlePointerEvent,
    extractPressureData,
    calculateStrokeWidth,
    getPressureWeights,
    resetPressure,

    // Utility to get current pressure multiplier
    getCurrentPressureMultiplier: () => calculateStrokeWidth(pressureData.pressure),
  };
}

/**
 * Type for the return value of usePressureInput
 */
export type PressureInputHook = ReturnType<typeof usePressureInput>;

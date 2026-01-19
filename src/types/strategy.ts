/**
 * Valorant map names
 */
export type MapName =
  | 'abyss'
  | 'ascent'
  | 'bind'
  | 'breeze'
  | 'corrode'
  | 'fracture'
  | 'haven'
  | 'icebox'
  | 'lotus'
  | 'pearl'
  | 'split'
  | 'sunset';

/**
 * Map metadata
 */
export interface ValorantMap {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  splash: string;
  coordinates?: string;
}

/**
 * Agent metadata
 */
export interface Agent {
  id: string;
  name: string;
  displayName: string;
  role: {
    name: string;
    icon?: string;
  };
  icon: string;
  portrait: string;
  abilities: Ability[];
}

/**
 * Agent ability
 */
export interface Ability {
  slot: string;
  name: string;
  description: string;
  icon: string;
}

/**
 * Strategy side (attack/defense)
 */
export type StrategySide = 'attack' | 'defense';

/**
 * Canvas element types
 */
export type ElementType = 'agent' | 'ability' | 'line' | 'arrow' | 'circle' | 'rectangle' | 'text' | 'freehand';

/**
 * Base canvas element
 */
export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

/**
 * Agent placement on canvas
 */
export interface AgentPlacement extends CanvasElement {
  type: 'agent';
  agentId: string;
  side: StrategySide;
  color?: string;
}

/**
 * Ability placement on canvas
 */
export interface AbilityPlacement extends CanvasElement {
  type: 'ability';
  abilityIcon: string;
  abilityName?: string;
  side: StrategySide;
  subType?: 'default' | 'smoke' | 'wall' | 'curved-wall' | 'rect' | 'area' | 'path' | 'icon' | 'guided-path';
  radius?: number;
  innerRadius?: number; // For area: inner detection radius (e.g., Alarmbot)
  opacity?: number;
  color?: string;
  points?: number[]; // For wall/path
  guidedPoints?: number[]; // For guided-path (free-form trajectory)
  width?: number;
  height?: number;
  isGlobal?: boolean;
  tension?: number; // For curved-wall: 0 = straight, 0.3 = smooth curves
  intermediatePoints?: number; // For curved-wall: number of points between start and end
}

/**
 * Drawing element (line, arrow, shape, text)
 */
export interface DrawingElement extends CanvasElement {
  type: 'line' | 'arrow' | 'circle' | 'rectangle' | 'text' | 'freehand';
  color?: string;
  strokeWidth?: number;
  points?: number[];
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
}

/**
 * Strategy canvas data
 */
export interface CanvasData {
  version: string;
  mapName: MapName;
  side: StrategySide;
  elements: (AgentPlacement | AbilityPlacement | DrawingElement)[];
}

/**
 * Complete strategy
 */
export interface Strategy {
  id: string;
  title: string;
  description?: string;
  map: MapName;
  side: StrategySide;
  tags: string[];
  isPublic: boolean;
  canvasData: CanvasData;
  authorId?: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasCommonProps {
  id: string;
  x: number;
  y: number;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  draggable: boolean;
  perfectDrawEnabled: boolean;
  shadowForStrokeEnabled: boolean;
  listening?: boolean;
}

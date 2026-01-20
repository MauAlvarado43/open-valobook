import type {
  CanvasData,
  MapName,
  StrategySide,
  AgentPlacement,
  AbilityPlacement,
  DrawingElement,
} from '@/types/strategy';

export interface EditorState {
  // Canvas state
  selectedMap: MapName | null;
  strategySide: StrategySide;
  canvasData: CanvasData;

  // Editor mode
  tool:
    | 'select'
    | 'agent'
    | 'ability'
    | 'line'
    | 'arrow'
    | 'circle'
    | 'rectangle'
    | 'text'
    | 'pen'
    | 'timer-path'
    | 'vision-cone'
    | 'icon'
    | 'image';
  selectedElementId: string | null;
  status: { type: 'success' | 'error' | 'loading'; msg: string } | null;
  confirmModal: { title: string; message: string; onConfirm: () => void } | null;
  selectedElementIds: string[];
  selectedAgentId: string | null;
  selectedAbilityIcon: string | null;
  selectedAbilityName: string | null;
  selectedAbilitySubType:
    | 'default'
    | 'smoke'
    | 'wall'
    | 'curved-wall'
    | 'rect'
    | 'area'
    | 'path'
    | 'icon'
    | 'guided-path';
  selectedAbilityColor: string | null;
  selectedAbilityIsGlobal: boolean;
  currentColor: string;
  strategyName: string;
  strategyId: string;
  language: 'en' | 'es';

  // History
  history: CanvasData[];
  historyIndex: number;

  // Actions
  setSelectedMap: (map: MapName) => void;
  setStrategySide: (side: StrategySide) => void;
  setTool: (tool: EditorState['tool']) => void;
  setSelectedAgentId: (id: string | null) => void;
  setSelectedAbilityIcon: (
    icon: string | null,
    name?: string | null,
    subType?:
      | 'default'
      | 'smoke'
      | 'wall'
      | 'curved-wall'
      | 'rect'
      | 'area'
      | 'path'
      | 'icon'
      | 'guided-path',
    color?: string | null,
    isGlobal?: boolean
  ) => void;
  setSelectedAbilitySubType: (
    subType:
      | 'default'
      | 'smoke'
      | 'wall'
      | 'curved-wall'
      | 'rect'
      | 'area'
      | 'path'
      | 'icon'
      | 'guided-path'
  ) => void;
  setCurrentColor: (color: string) => void;
  setStrategyName: (name: string) => void;
  setStatus: (
    status: { type: 'success' | 'error' | 'loading'; msg: string } | null,
    duration?: number
  ) => void;
  setConfirmModal: (
    modal: { title: string; message: string; onConfirm: () => void } | null
  ) => void;
  addElement: (element: AgentPlacement | AbilityPlacement | DrawingElement) => void;
  updateElement: (
    id: string,
    updates: Partial<AgentPlacement | AbilityPlacement | DrawingElement>
  ) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  toggleElementSelection: (id: string) => void;
  clearSelection: () => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  saveStrategy: () => Promise<void>;
  loadStrategy: () => Promise<void>;
  exportAsImage: () => void;
  saveToLibrary: () => Promise<void>;
  loadProject: (data: CanvasData) => void;
  resetProject: () => void;
  setLanguage: (lang: 'en' | 'es') => void;
}

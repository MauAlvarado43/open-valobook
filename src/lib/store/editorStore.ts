import { create } from 'zustand';
import type { 
  CanvasData, 
  MapName, 
  StrategySide, 
  AgentPlacement, 
  AbilityPlacement, 
  DrawingElement 
} from '@/types/strategy';

export interface EditorState {
  // Canvas state
  selectedMap: MapName | null;
  strategySide: StrategySide;
  canvasData: CanvasData;
  
  // Editor mode
  tool: 'select' | 'agent' | 'ability' | 'line' | 'arrow' | 'circle' | 'rectangle' | 'text' | 'pen';
  selectedElementId: string | null;
  selectedElementIds: string[];
  currentColor: string;
  
  // History
  history: CanvasData[];
  historyIndex: number;
  
  // Actions
  setSelectedMap: (map: MapName) => void;
  setStrategySide: (side: StrategySide) => void;
  setTool: (tool: EditorState['tool']) => void;
  setCurrentColor: (color: string) => void;
  addElement: (element: AgentPlacement | AbilityPlacement | DrawingElement) => void;
  updateElement: (id: string, updates: Partial<AgentPlacement | AbilityPlacement | DrawingElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  toggleElementSelection: (id: string) => void;
  clearSelection: () => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
}

const initialCanvasData: CanvasData = {
  version: '1.0',
  mapName: 'ascent',
  side: 'attack',
  elements: [],
};

const saveToHistory = (state: EditorState): Partial<EditorState> => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.canvasData)));
  return {
    history: newHistory.slice(-50), // Keep last 50 states
    historyIndex: Math.min(newHistory.length - 1, 49),
  };
};

export const useEditorStore = create<EditorState>((set) => ({
  // Initial state
  selectedMap: null,
  strategySide: 'attack',
  canvasData: initialCanvasData,
  tool: 'select',
  selectedElementId: null,
  selectedElementIds: [],
  currentColor: '#FF4655',
  history: [initialCanvasData],
  historyIndex: 0,
  
  // Actions
  setSelectedMap: (map) =>
    set((state) => ({
      selectedMap: map,
      canvasData: { ...state.canvasData, mapName: map },
    })),
    
  setStrategySide: (side) =>
    set((state) => ({
      strategySide: side,
      canvasData: { ...state.canvasData, side },
    })),
    
  setTool: (tool) => set({ tool }),
  
  setCurrentColor: (color) => set({ currentColor: color }),
  
  addElement: (element) =>
    set((state) => {
      const newCanvasData = {
        ...state.canvasData,
        elements: [...state.canvasData.elements, element],
      };
      return {
        canvasData: newCanvasData,
        ...saveToHistory({ ...state, canvasData: newCanvasData }),
      };
    }),
    
  updateElement: (id, updates) =>
    set((state) => {
      const newCanvasData = {
        ...state.canvasData,
        elements: state.canvasData.elements.map((el) =>
          el.id === id ? { ...el, ...updates } as AgentPlacement | AbilityPlacement | DrawingElement : el
        ),
      };
      return {
        canvasData: newCanvasData,
        ...saveToHistory({ ...state, canvasData: newCanvasData }),
      };
    }),
    
  removeElement: (id) =>
    set((state) => {
      const newCanvasData = {
        ...state.canvasData,
        elements: state.canvasData.elements.filter((el) => el.id !== id),
      };
      return {
        canvasData: newCanvasData,
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        selectedElementIds: state.selectedElementIds.filter(selId => selId !== id),
        ...saveToHistory({ ...state, canvasData: newCanvasData }),
      };
    }),
    
  selectElement: (id) => set({ selectedElementId: id, selectedElementIds: id ? [id] : [] }),
  
  toggleElementSelection: (id) =>
    set((state) => {
      const isSelected = state.selectedElementIds.includes(id);
      const newSelection = isSelected
        ? state.selectedElementIds.filter(selId => selId !== id)
        : [...state.selectedElementIds, id];
      return {
        selectedElementIds: newSelection,
        selectedElementId: newSelection.length === 1 ? newSelection[0] : null,
      };
    }),
    
  clearSelection: () => set({ selectedElementId: null, selectedElementIds: [] }),
  
  clearCanvas: () =>
    set((state) => {
      const newCanvasData = {
        ...state.canvasData,
        elements: [],
      };
      return {
        canvasData: newCanvasData,
        selectedElementId: null,
        ...saveToHistory({ ...state, canvasData: newCanvasData }),
      };
    }),
    
  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return {};
      const newIndex = state.historyIndex - 1;
      return {
        canvasData: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
      };
    }),
    
  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return {};
      const newIndex = state.historyIndex + 1;
      return {
        canvasData: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
      };
    }),
}));

import { create } from 'zustand';
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
}

declare global {
  interface Window {
    electron: {
      platform: string;
      quitApp: () => void;
      saveFileDialog: (data: string, isImage?: boolean, format?: string) => Promise<string | null>;
      openFileDialog: () => Promise<{ path: string; content: string } | null>;
      saveToLibrary: (filename: string, data: string) => Promise<string>;
      listLibrary: () => Promise<
        Array<{
          id: string;
          name: string;
          mapName: string;
          side: string;
          updatedAt: Date;
          data: CanvasData;
        }>
      >;
      deleteFromLibrary: (filename: string) => Promise<boolean>;
    };
  }
}

const initialCanvasData: CanvasData = {
  id: crypto.randomUUID(),
  name: 'My Strategy',
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
  selectedAgentId: null,
  selectedAbilityIcon: null,
  selectedAbilityName: null,
  selectedAbilitySubType: 'default',
  selectedAbilityColor: null,
  selectedAbilityIsGlobal: false,
  currentColor: '#FF4655',
  strategyName: initialCanvasData.name,
  strategyId: initialCanvasData.id,
  status: null,
  confirmModal: null,
  history: [initialCanvasData],
  historyIndex: 0,

  // Actions
  setSelectedMap: (map) =>
    set((state) => ({
      selectedMap: map,
      canvasData: { ...state.canvasData, mapName: map },
    })),

  setStrategyName: (name) =>
    set((state) => ({
      strategyName: name,
      canvasData: { ...state.canvasData, name },
    })),

  setStrategySide: (side) =>
    set((state) => ({
      strategySide: side,
      canvasData: { ...state.canvasData, side },
    })),

  setTool: (tool) => set({ tool }),

  setSelectedAgentId: (id) => set({ selectedAgentId: id }),

  setSelectedAbilityIcon: (
    icon,
    name = null,
    subType: AbilityPlacement['subType'] = 'default',
    color = null,
    isGlobal = false
  ) =>
    set({
      selectedAbilityIcon: icon,
      selectedAbilityName: name,
      selectedAbilitySubType: subType,
      selectedAbilityColor: color,
      selectedAbilityIsGlobal: isGlobal,
    }),

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
  ) => set({ selectedAbilitySubType: subType }),

  setCurrentColor: (color) => set({ currentColor: color }),

  setStatus: (status, duration = 3000) => {
    set({ status });
    if (status && status.type !== 'loading') {
      setTimeout(() => {
        const current = useEditorStore.getState().status;
        if (current?.msg === status.msg) {
          set({ status: null });
        }
      }, duration);
    }
  },

  setConfirmModal: (modal) => set({ confirmModal: modal }),

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
          el.id === id
            ? ({ ...el, ...updates } as AgentPlacement | AbilityPlacement | DrawingElement)
            : el
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
        selectedElementIds: state.selectedElementIds.filter((selId) => selId !== id),
        ...saveToHistory({ ...state, canvasData: newCanvasData }),
      };
    }),

  selectElement: (id) =>
    set((state) => {
      if (
        state.selectedElementId === id &&
        state.selectedElementIds.length === 1 &&
        state.selectedElementIds[0] === id
      ) {
        return state;
      }
      return { selectedElementId: id, selectedElementIds: id ? [id] : [] };
    }),

  toggleElementSelection: (id) =>
    set((state) => {
      const isSelected = state.selectedElementIds.includes(id);
      const newSelection = isSelected
        ? state.selectedElementIds.filter((selId) => selId !== id)
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

  saveStrategy: async () => {
    const { canvasData, setStatus } = useEditorStore.getState();
    const data = JSON.stringify(canvasData, null, 2);
    if (window.electron?.saveFileDialog) {
      const result = await window.electron.saveFileDialog(data, false, 'ovb');
      if (result) setStatus({ type: 'success', msg: 'File exported successfully' });
    }
  },

  loadStrategy: async () => {
    const { loadProject, setStatus } = useEditorStore.getState();
    if (window.electron?.openFileDialog) {
      const result = await window.electron.openFileDialog();
      if (result && result.content) {
        try {
          const data = JSON.parse(result.content) as CanvasData;
          loadProject(data);
          setStatus({ type: 'success', msg: 'Strategy loaded' });
        } catch (e) {
          console.error('Failed to parse strategy file', e);
          setStatus({ type: 'error', msg: 'Corrupted file' });
        }
      }
    }
  },

  exportAsImage: () => {
    window.dispatchEvent(new CustomEvent('canvas:export'));
  },

  saveToLibrary: async () => {
    const { canvasData, strategyName } = useEditorStore.getState();
    const finalData = {
      ...canvasData,
      name: strategyName,
    };
    const dataString = JSON.stringify(finalData, null, 2);

    if (window.electron?.saveToLibrary) {
      try {
        // Use strategyId as filename to keep identity fixed
        await window.electron.saveToLibrary(canvasData.id, dataString);
      } catch (error) {
        console.error('Failed to save to library:', error);
      }
    }
  },

  loadProject: (data) =>
    set(() => ({
      canvasData: data,
      selectedMap: data.mapName,
      strategySide: data.side,
      strategyName: data.name || 'Untitled Strategy',
      strategyId: data.id,
      history: [data],
      historyIndex: 0,
      selectedElementId: null,
      selectedElementIds: [],
    })),

  resetProject: () =>
    set(() => {
      const newId = crypto.randomUUID();
      const newData = { ...initialCanvasData, id: newId };
      return {
        canvasData: newData,
        strategyName: newData.name,
        strategyId: newData.id,
        selectedMap: null,
        strategySide: 'attack',
        history: [newData],
        historyIndex: 0,
        selectedElementId: null,
        selectedElementIds: [],
      };
    }),
}));

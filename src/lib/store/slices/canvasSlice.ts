import type { StateCreator } from 'zustand';
import type { EditorState } from '@/lib/store/types';
import { saveToHistory } from '@/lib/store/historyHelper';
import type { AgentPlacement, AbilityPlacement, DrawingElement } from '@/types/strategy';

export const createCanvasSlice: StateCreator<EditorState, [], [], Partial<EditorState>> = (
  set
) => ({
  addElement: (element) =>
    set((state) => {
      const newCanvasData = {
        ...state.canvasData,
        elements: [...state.canvasData.elements, element],
      };
      return {
        canvasData: newCanvasData,
        ...saveToHistory({ ...state, canvasData: newCanvasData } as EditorState),
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
        ...saveToHistory({ ...state, canvasData: newCanvasData } as EditorState),
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
        ...saveToHistory({ ...state, canvasData: newCanvasData } as EditorState),
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
        ...saveToHistory({ ...state, canvasData: newCanvasData } as EditorState),
      };
    }),
});

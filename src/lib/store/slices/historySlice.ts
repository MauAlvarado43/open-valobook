import type { StateCreator } from 'zustand';
import type { EditorState } from '@/lib/store/types';

export const createHistorySlice: StateCreator<EditorState, [], [], Partial<EditorState>> = (
  set
) => ({
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
});

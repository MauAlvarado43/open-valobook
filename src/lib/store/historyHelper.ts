import type { CanvasData } from '@/types/strategy';
import type { EditorState } from '@/lib/store/types';

export const initialCanvasData: CanvasData = {
  id: crypto.randomUUID(),
  name: 'My Strategy',
  version: '1.0',
  mapName: 'ascent',
  side: 'attack',
  elements: [],
};

export const saveToHistory = (state: EditorState): Partial<EditorState> => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.canvasData)));
  return {
    history: newHistory.slice(-50), // Keep last 50 states
    historyIndex: Math.min(newHistory.length - 1, 49),
  };
};

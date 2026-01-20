import type { StateCreator } from 'zustand';
import type { EditorState } from '@/lib/store/types';
import type { CanvasData } from '@/types/strategy';

export const createPersistenceSlice: StateCreator<EditorState, [], [], Partial<EditorState>> = (
  set,
  get
) => ({
  saveStrategy: async () => {
    const { canvasData, setStatus } = get() as EditorState;
    const data = JSON.stringify(canvasData, null, 2);
    if (window.electron?.saveFileDialog) {
      const result = await window.electron.saveFileDialog(data, false, 'ovb');
      if (result) setStatus({ type: 'success', msg: 'File exported successfully' });
    }
  },

  loadStrategy: async () => {
    const { loadProject, setStatus } = get() as EditorState;
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
    const { canvasData, strategyName } = get() as EditorState;
    const finalData = {
      ...canvasData,
      name: strategyName,
    };
    const dataString = JSON.stringify(finalData, null, 2);

    if (window.electron?.saveToLibrary) {
      try {
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
    set((state) => {
      const newId = crypto.randomUUID();
      const initialData = state.history[0]; // This is hacky, initialCanvasData would be better but it's in another file
      // Actually, I can just use initialCanvasData if I import it or use a well-known default
      const newData = {
        id: newId,
        name: 'My Strategy',
        version: '1.0',
        mapName: 'ascent' as any,
        side: 'attack' as any,
        elements: [],
      };
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
});

import { create } from 'zustand';
import type { EditorState } from '@/lib/store/types';
import { initialCanvasData } from '@/lib/store/historyHelper';
import { createCanvasSlice } from '@/lib/store/slices/canvasSlice';
import { createUISlice } from '@/lib/store/slices/uiSlice';
import { createHistorySlice } from '@/lib/store/slices/historySlice';
import { createPersistenceSlice } from '@/lib/store/slices/persistenceSlice';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';

// Custom storage to use Electron local file instead of localStorage
const electronStorage = {
  getItem: async (name: string) => {
    const config = await window.electron?.getConfig();
    return config ? JSON.stringify(config[name]) : null;
  },
  setItem: async (name: string, value: string) => {
    const currentConfig = (await window.electron?.getConfig()) || {};
    currentConfig[name] = JSON.parse(value);
    await window.electron?.saveConfig(currentConfig);
  },
  removeItem: async (name: string) => {
    const currentConfig = (await window.electron?.getConfig()) || {};
    delete currentConfig[name];
    await window.electron?.saveConfig(currentConfig);
  },
};

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector(
    persist(
      (set, get, store) =>
        ({
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
          language: 'en',
          autoSave: true,
          storagePath: null,
          status: null,
          confirmModal: null,
          history: [initialCanvasData],
          historyIndex: 0,

          // Slices
          ...createCanvasSlice(set, get, store),
          ...createUISlice(set, get, store),
          ...createHistorySlice(set, get, store),
          ...createPersistenceSlice(set, get, store),
        }) as EditorState,
      {
        name: 'openvalobook-store',
        storage: createJSONStorage(() => electronStorage),
        partialize: (state) => ({
          language: state.language,
          autoSave: state.autoSave,
          storagePath: state.storagePath,
          // Any other settings we want to persist go here
        }),
      }
    )
  )
);

// Auto-save subscriber
let autoSaveTimer: NodeJS.Timeout | null = null;

useEditorStore.subscribe(
  (state) => state.canvasData,
  (canvasData) => {
    const { autoSave, saveToLibrary } = useEditorStore.getState();
    if (autoSave) {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        saveToLibrary();
      }, 2000);
    }
  }
);

export type { EditorState };

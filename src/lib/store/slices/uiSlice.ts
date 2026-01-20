import type { StateCreator } from 'zustand';
import type { EditorState } from '@/lib/store/types';
import type { AbilityPlacement } from '@/types/strategy';

export const createUISlice: StateCreator<EditorState, [], [], Partial<EditorState>> = (
  set,
  get
) => ({
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

  setSelectedAbilitySubType: (subType) => set({ selectedAbilitySubType: subType }),

  setCurrentColor: (color) => set({ currentColor: color }),

  setStatus: (status, duration = 3000) => {
    set({ status });
    if (status && status.type !== 'loading') {
      setTimeout(() => {
        const current = (get() as EditorState).status;
        if (current?.msg === status.msg) {
          set({ status: null });
        }
      }, duration);
    }
  },

  setConfirmModal: (modal) => set({ confirmModal: modal }),
});

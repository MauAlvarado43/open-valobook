import { create } from 'zustand';
import type { EditorState } from '@/lib/store/types';
import { initialCanvasData } from '@/lib/store/historyHelper';
import { createCanvasSlice } from '@/lib/store/slices/canvasSlice';
import { createUISlice } from '@/lib/store/slices/uiSlice';
import { createHistorySlice } from '@/lib/store/slices/historySlice';
import { createPersistenceSlice } from '@/lib/store/slices/persistenceSlice';

export const useEditorStore = create<EditorState>(
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
      status: null,
      confirmModal: null,
      history: [initialCanvasData],
      historyIndex: 0,

      // Slices
      ...createCanvasSlice(set, get, store),
      ...createUISlice(set, get, store),
      ...createHistorySlice(set, get, store),
      ...createPersistenceSlice(set, get, store),
    }) as EditorState
);

export type { EditorState };

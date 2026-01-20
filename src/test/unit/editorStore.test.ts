import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../../lib/store/editorStore';

describe('Editor Store', () => {
  beforeEach(() => {
    useEditorStore.setState({
      selectedMap: null,
      strategySide: 'attack',
      canvasData: {
        version: '1.0',
        mapName: 'ascent',
        side: 'attack',
        elements: [],
      },
      tool: 'select',
      selectedElementId: null,
      selectedElementIds: [],
      history: [
        {
          version: '1.0',
          mapName: 'ascent',
          side: 'attack',
          elements: [],
        },
      ],
      historyIndex: 0,
      strategyName: 'My Strategy',
    });
  });

  it('should have correct initial state', () => {
    const state = useEditorStore.getState();
    expect(state.selectedMap).toBeNull();
    expect(state.strategySide).toBe('attack');
  });

  it('should update selected map', () => {
    useEditorStore.getState().setSelectedMap('bind');
    expect(useEditorStore.getState().selectedMap).toBe('bind');
  });

  it('should manage undo/redo history', () => {
    const element = {
      id: '1',
      type: 'circle',
      x: 0,
      y: 0,
      radius: 10,
      color: '#000',
      strokeWidth: 1,
    };
    useEditorStore.getState().addElement(element);
    expect(useEditorStore.getState().canvasData.elements).toHaveLength(1);

    useEditorStore.getState().undo();
    expect(useEditorStore.getState().canvasData.elements).toHaveLength(0);

    useEditorStore.getState().redo();
    expect(useEditorStore.getState().canvasData.elements).toHaveLength(1);
  });
});

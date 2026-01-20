import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StrategyCanvas } from '../../components/StrategyCanvas';
import { useEditorStore } from '../../lib/store/editorStore';
import React from 'react';

// Mock react-konva to avoid canvas rendering issues in JSDOM
vi.mock('react-konva', () => ({
  Stage: ({ children, onMouseDown, onMouseMove, onMouseUp }: any) => (
    <div
      data-testid="konva-stage"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {children}
    </div>
  ),
  Layer: ({ children }: any) => <div data-testid="konva-layer">{children}</div>,
  Image: () => <div data-testid="konva-image" />,
  Rect: () => <div data-testid="konva-rect" />,
  Line: () => <div data-testid="konva-line" />,
  Arrow: () => <div data-testid="konva-arrow" />,
  Circle: () => <div data-testid="konva-circle" />,
  Group: ({ children }: any) => <div data-testid="konva-group">{children}</div>,
}));

// Mock use-image
vi.mock('use-image', () => ({
  default: () => [{}],
}));

describe('Keyboard Shortcuts Integration', () => {
  beforeEach(() => {
    useEditorStore.setState({
      tool: 'select',
      canvasData: { version: '1.0', mapName: 'ascent', side: 'attack', elements: [] },
      selectedElementIds: [],
      selectedElementId: null,
      history: [{ version: '1.0', mapName: 'ascent', side: 'attack', elements: [] }],
      historyIndex: 0,
    });
  });

  it('should change tool when pressing keys (v, p, l, etc.)', () => {
    render(<StrategyCanvas />);

    fireEvent.keyDown(window, { key: 'p', code: 'KeyP' });
    expect(useEditorStore.getState().tool).toBe('pen');

    fireEvent.keyDown(window, { key: 'l', code: 'KeyL' });
    expect(useEditorStore.getState().tool).toBe('line');

    fireEvent.keyDown(window, { key: 'v', code: 'KeyV' });
    expect(useEditorStore.getState().tool).toBe('select');
  });

  it('should trigger undo/redo with Ctrl+Z', () => {
    const store = useEditorStore.getState();
    const element = {
      id: '1',
      type: 'circle' as const,
      x: 10,
      y: 10,
      radius: 5,
      color: '#000',
      strokeWidth: 1,
    };

    // Add element directly to store to test undo listener
    store.addElement(element);
    expect(useEditorStore.getState().canvasData.elements).toHaveLength(1);

    render(<StrategyCanvas />);

    // Simulate Ctrl+Z
    fireEvent.keyDown(window, { key: 'z', code: 'KeyZ', ctrlKey: true });
    expect(useEditorStore.getState().canvasData.elements).toHaveLength(0);

    // Simulate Redo (Ctrl+Shift+Z)
    fireEvent.keyDown(window, { key: 'z', code: 'KeyZ', ctrlKey: true, shiftKey: true });
    expect(useEditorStore.getState().canvasData.elements).toHaveLength(1);
  });
});

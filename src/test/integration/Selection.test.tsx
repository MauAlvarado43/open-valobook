import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StrategyCanvas } from '@/components/StrategyCanvas';
import { useEditorStore } from '@/lib/store/editorStore';
import React from 'react';

// Simplified mock for hit testing simulation
// We will simply attach onClick/onMouseDown handlers to the divs

vi.mock('react-konva', () => ({
  Stage: ({ children, onMouseDown, onMouseUp }: any) => (
    <div
      data-testid="stage"
      onMouseDown={(e) => {
        const konvaEvent = {
          evt: {
            ...e.nativeEvent,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
            button: e.button,
            preventDefault: () => {},
          },
          target: { getStage: () => ({ container: () => ({ style: {} }) }) },
        };
        if (onMouseDown) onMouseDown(konvaEvent);
      }}
      onMouseUp={onMouseUp}
    >
      {children}
    </div>
  ),
  Layer: ({ children }: any) => <div>{children}</div>,
  Group: ({ children, onClick, onMouseDown, id }: any) => (
    <div
      data-testid={`group-${id}`}
      onClick={(e) => {
        const konvaEvent = {
          evt: {
            ...e.nativeEvent,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
            button: e.button,
            preventDefault: () => {},
          },
          target: {
            id: () => id,
            getStage: () => ({ container: () => ({ style: {} }) }),
            stopDrag: () => {},
          },
          cancelBubble: false,
        };
        if (onClick) onClick(konvaEvent);
      }}
      onMouseDown={(e) => {
        const konvaEvent = {
          evt: {
            ...e.nativeEvent,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
            button: e.button,
            preventDefault: () => {},
          },
          target: {
            id: () => id,
            getStage: () => ({ container: () => ({ style: {} }) }),
            stopDrag: () => {},
          },
          cancelBubble: false,
        };
        if (onMouseDown) onMouseDown(konvaEvent);
      }}
    >
      {children}
    </div>
  ),
  Image: () => <div />,
  Rect: () => <div />,
  Circle: () => <div />,
  Line: () => <div />,
  Arrow: () => <div />,
}));

vi.mock('use-image', () => ({
  default: () => [new Image(), 'loaded'],
}));

describe('Selection Integration', () => {
  beforeEach(() => {
    useEditorStore.setState({
      tool: 'select',
      canvasData: {
        id: '1',
        name: 'test',
        version: '1.0',
        mapName: 'ascent',
        side: 'attack',
        elements: [
          { id: '1', type: 'agent', agentId: 'astra', x: 100, y: 100, side: 'attack' },
          { id: '2', type: 'agent', agentId: 'brimstone', x: 200, y: 200, side: 'attack' },
        ],
      },
      selectedElementIds: [],
      selectedElementId: null,
      history: [],
      historyIndex: 0,
    });
  });

  it('should toggle selection with Shift+Click', () => {
    const { getByTestId } = render(<StrategyCanvas />);

    // Select first element
    const el1 = getByTestId('group-1');
    fireEvent.mouseDown(el1, { shiftKey: false, ctrlKey: false, button: 0 });

    // Verify first selection
    expect(useEditorStore.getState().selectedElementIds).toContain('1');
    expect(useEditorStore.getState().selectedElementIds).not.toContain('2');

    // Shift+Click second element
    const el2 = getByTestId('group-2');
    fireEvent.mouseDown(el2, { shiftKey: true, ctrlKey: false, button: 0 });

    // Verify both selected
    const state = useEditorStore.getState();
    expect(state.selectedElementIds).toContain('1');
    expect(state.selectedElementIds).toContain('2');
    expect(state.selectedElementIds).toHaveLength(2);
  });

  it('should exclusive select without Shift', () => {
    const { getByTestId } = render(<StrategyCanvas />);
    const el1 = getByTestId('group-1');
    const el2 = getByTestId('group-2');

    // Select 1
    fireEvent.mouseDown(el1, { button: 0 });
    expect(useEditorStore.getState().selectedElementIds).toEqual(['1']);

    // Select 2 (no shift)
    fireEvent.mouseDown(el2, { button: 0 });
    expect(useEditorStore.getState().selectedElementIds).toEqual(['2']);
  });
});

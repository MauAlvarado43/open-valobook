import { useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';
import type { EditorState } from '@/lib/store/editorStore';
import { useTranslation } from '@/hooks/useTranslation';

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    selectedElementId,
    selectedElementIds,
    removeElement,
    setTool,
    saveToLibrary,
    strategyName,
    strategySide,
    setStrategySide,
    exportAsImage,
    clearCanvas,
    setStatus,
    setConfirmModal,
  } = useEditorStore();
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      // System Actions
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey || e.altKey) {
          redo();
          setStatus({ type: 'success', msg: t('common', 'redo') }, 1000);
        } else {
          undo();
          setStatus({ type: 'success', msg: t('common', 'undo') }, 1000);
        }
      } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        setStatus({ type: 'success', msg: 'Redo' }, 1000);
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
        // Explicitly handle Ctrl+Shift+Z for some layouts
        e.preventDefault();
        redo();
        setStatus({ type: 'success', msg: 'Redo' }, 1000);
      } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveToLibrary();
        setStatus({ type: 'success', msg: t('common', 'saveSuccess') });
      } else if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        exportAsImage();
        setStatus({ type: 'loading', msg: t('common', 'exporting') });
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (selectedElementIds.length > 0 || selectedElementId) {
          if (selectedElementIds.length > 0) {
            selectedElementIds.forEach((id) => removeElement(id));
          } else if (selectedElementId) {
            removeElement(selectedElementId);
          }
          setStatus({ type: 'success', msg: t('common', 'elementsDeleted') }, 1000);
        }
      } else if (e.shiftKey && e.key === 'Escape') {
        e.preventDefault();
        setConfirmModal({
          title: t('common', 'clearCanvasTitle'),
          message: t('common', 'clearCanvasMessage'),
          onConfirm: clearCanvas,
        });
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setStrategySide(strategySide === 'attack' ? 'defense' : 'attack');
      }

      // Tool Selection
      const keyMap: Record<string, EditorState['tool']> = {
        v: 'select',
        p: 'pen',
        o: 'timer-path',
        l: 'line',
        a: 'arrow',
        c: 'circle',
        r: 'rectangle',
        w: 'vision-cone',
        m: 'icon',
        i: 'image',
        t: 'text',
      };
      const key = e.key.toLowerCase();
      if (keyMap[key] && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setTool(keyMap[key]);
        setStatus(
          { type: 'success', msg: `${t('toolbar', keyMap[key] as any)} ${t('common', 'active')}` },
          800
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    selectedElementId,
    selectedElementIds,
    removeElement,
    setTool,
    saveToLibrary,
    strategyName,
    strategySide,
    setStrategySide,
    exportAsImage,
    clearCanvas,
    setStatus,
    setConfirmModal,
    t,
  ]);
}

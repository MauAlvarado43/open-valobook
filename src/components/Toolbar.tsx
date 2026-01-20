import { useState, useRef } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';
import { ToolbarBranding } from '@/components/toolbar/ToolbarBranding';
import { ToolbarActions } from '@/components/toolbar/ToolbarActions';
import { TacticalSwitcher } from '@/components/toolbar/TacticalSwitcher';
import { ToolSelector } from '@/components/toolbar/ToolSelector';
import { ColorControl } from '@/components/toolbar/ColorControl';

export function Toolbar() {
  const {
    tool,
    setTool,
    strategySide,
    setStrategySide,
    clearCanvas,
    currentColor,
    setCurrentColor,
    clearSelection,
    saveStrategy,
    loadStrategy,
    exportAsImage,
    saveToLibrary,
    strategyName,
    setStrategyName,
    status,
    setStatus,
    setConfirmModal,
  } = useEditorStore();

  const [exportFormat, setExportFormat] = useState<'png' | 'pdf'>('png');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);

  const handleAction = async (action: () => Promise<unknown>, successMsg: string) => {
    setStatus({ type: 'loading', msg: 'Processing...' });
    try {
      await action();
      setStatus({ type: 'success', msg: successMsg });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Action failed' });
    }
  };

  const triggerExport = () => {
    if (exportFormat === 'pdf') {
      window.dispatchEvent(new CustomEvent('canvas:export:pdf'));
    } else {
      exportAsImage();
    }
    setStatus({ type: 'loading', msg: `Exporting ${exportFormat.toUpperCase()}...` });
  };

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleCustomColorChange = (color: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setCurrentColor(color);
    }, 50);
  };

  const hClassTop = 'h-9';
  const hClassBottom = 'h-12';
  const bgModule = 'bg-[#0F1923]/80 border border-white/5 backdrop-blur-md shadow-lg';

  return (
    <div className="p-4 border-b border-white/5 bg-[#0F1922] flex flex-col gap-3 select-none relative z-[1000]">
      {/* Meta Row: Identity & System */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <ToolbarBranding
          strategyName={strategyName}
          setStrategyName={setStrategyName}
          onSaveToLibrary={() => handleAction(() => saveToLibrary(), 'Save Successful')}
          bgModule={bgModule}
          hClassTop={hClassTop}
        />

        {/* Center: Status Hub */}
        <div className="hidden md:flex flex-1 justify-center pointer-events-none">
          {status && (
            <div
              className={`px-4 py-1.5 rounded text-[9px] font-black uppercase italic tracking-widest animate-in fade-in fill-mode-both duration-300 pointer-events-auto ${
                status.type === 'success'
                  ? 'bg-green-500 text-black'
                  : status.type === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white animate-pulse'
              }`}
            >
              {status.msg}
            </div>
          )}
        </div>

        <ToolbarActions
          handleAction={handleAction}
          saveStrategy={saveStrategy}
          loadStrategy={loadStrategy}
          triggerExport={triggerExport}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          showExportOptions={showExportOptions}
          setShowExportOptions={setShowExportOptions}
          bgModule={bgModule}
          hClassTop={hClassTop}
        />
      </div>

      {/* Main Creation Row: Tools & Tactical */}
      <div className="grid grid-cols-[minmax(120px,1fr)_auto_minmax(120px,1fr)] items-center w-full gap-4 shrink-0 h-12 relative z-0">
        <TacticalSwitcher
          strategySide={strategySide}
          setStrategySide={setStrategySide}
          clearSelection={clearSelection}
          bgModule={bgModule}
          hClassBottom={hClassBottom}
        />

        <ToolSelector
          tool={tool}
          setTool={setTool}
          clearSelection={clearSelection}
          showMoreTools={showMoreTools}
          setShowMoreTools={setShowMoreTools}
          bgModule={bgModule}
          hClassBottom={hClassBottom}
        />

        <ColorControl
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          handleCustomColorChange={handleCustomColorChange}
          onClearCanvas={() => {
            setConfirmModal({
              title: 'Wipe Canvas',
              message:
                'Are you sure you want to delete all elements? This action cannot be undone unless you have history points.',
              onConfirm: clearCanvas,
            });
          }}
          bgModule={bgModule}
          hClassBottom={hClassBottom}
        />
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';
import type { EditorState } from '@/lib/store/editorStore';
import {
  MousePointer2,
  Minus,
  ArrowRight,
  Circle,
  Square,
  Type,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  Image as ImageIcon,
  Timer,
  Save,
  Upload,
  Download,
  Swords,
  Shield,
  Library,
  ChevronDown,
  FileText,
  MoreHorizontal,
} from 'lucide-react';

interface DropdownToolsProps {
  items: Array<{ id: string; label: string; Icon: any }>;
  current: string;
  onSelect: (id: EditorState['tool']) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  clearSelection: () => void;
}

function DropdownTools({
  items,
  current,
  onSelect,
  open,
  setOpen,
  clearSelection,
}: DropdownToolsProps) {
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`h-9 w-10 flex items-center justify-center rounded transition-all active:scale-75 shrink-0 ${
          items.some((t) => t.id === current)
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-white/20 hover:text-white/60 hover:bg-white/5'
        } ${open ? 'bg-white/10 text-white' : ''}`}
        title="More tools"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-1 bg-[#1A2530] border border-white/10 rounded-lg shadow-2xl z-[1002] grid grid-cols-2 gap-1 animate-in fade-in slide-in-from-top-1 min-w-[100px]">
          {items.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                clearSelection();
                onSelect(t.id as EditorState['tool']);
                setOpen(false);
              }}
              className={`h-10 w-11 flex items-center justify-center rounded transition-all ${
                current === t.id
                  ? 'bg-blue-600 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              title={t.label}
            >
              <t.Icon size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

  const tools = [
    { id: 'select', label: 'Select [V]', Icon: MousePointer2 },
    { id: 'pen', label: 'Pen [P]', Icon: Pencil },
    { id: 'timer-path', label: 'Rotation', Icon: Timer },
    { id: 'line', label: 'Line [L]', Icon: Minus },
    { id: 'arrow', label: 'Arrow [A]', Icon: ArrowRight },
    { id: 'circle', label: 'Circle [C]', Icon: Circle },
    { id: 'rectangle', label: 'Rectangle [R]', Icon: Square },
    { id: 'vision-cone', label: 'Vision', Icon: Eye },
    { id: 'icon', label: 'Marker [I]', Icon: MapPin },
    { id: 'image', label: 'Image', Icon: ImageIcon },
    { id: 'text', label: 'Text [T]', Icon: Type },
  ] as const;

  const colors = [
    { value: '#FF4655', label: 'Valorant Red' },
    { value: '#FFFFFF', label: 'White' },
    { value: '#00D4FF', label: 'Cyan' },
    { value: '#FFFF00', label: 'Yellow' },
    { value: '#00FF00', label: 'Green' },
    { value: '#FF6B00', label: 'Orange' },
    { value: '#A855F7', label: 'Purple' },
  ];

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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Project Branding */}
        <div
          className={`flex items-center rounded-lg overflow-hidden group focus-within:ring-1 focus-within:ring-[#FF4655]/50 ${bgModule} ${hClassTop} w-full sm:w-auto`}
        >
          <div className="px-3 flex flex-col justify-center flex-1 sm:min-w-[200px]">
            <span className="text-[6px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-0.5">
              STRATEGY_NAME
            </span>
            <input
              type="text"
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase italic border-none p-0 focus:ring-0 w-full placeholder:text-white/10 text-white"
              placeholder="UNNAMED_FILE"
              title="Project title"
            />
          </div>
          <button
            onClick={() => handleAction(() => saveToLibrary(), 'Save Successful')}
            className="h-full px-4 bg-[#FF4655] text-white hover:bg-[#FF4655]/90 active:scale-95 transition-all flex items-center justify-center shrink-0"
            title="Save to Library [S]"
          >
            <Library size={14} />
          </button>
        </div>

        {/* Center: Status Hub (only visible if status exists and on larger screens or as a floating overlay) */}
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

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className={`flex rounded-lg overflow-hidden ${bgModule} ${hClassTop}`}>
            <button
              onClick={() => handleAction(saveStrategy, 'Exported File')}
              className="h-full px-3 text-white/40 hover:text-white hover:bg-white/5 transition-all border-r border-white/5"
              title="Save Local"
            >
              <Save size={12} />
            </button>
            <button
              onClick={() => handleAction(loadStrategy, 'Imported File')}
              className="h-full px-3 text-white/40 hover:text-white hover:bg-white/5 transition-all"
              title="Load Local"
            >
              <Upload size={12} />
            </button>
          </div>

          <div
            className={`relative flex items-center bg-blue-600 rounded-lg active:scale-95 transition-all ${hClassTop}`}
          >
            <button
              onClick={triggerExport}
              className="h-full pl-4 pr-3 text-white font-black uppercase italic text-[9px] flex items-center gap-2.5 hover:bg-blue-500 transition-colors rounded-l-lg"
              title={`Export as ${exportFormat.toUpperCase()} [Ctrl+E]`}
            >
              <Download size={14} />
              EXPORT {exportFormat}
            </button>
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="h-full w-9 text-white/60 hover:text-white border-l border-white/10 hover:bg-blue-500 transition-all rounded-r-lg flex items-center justify-center"
              title="Select format"
            >
              <ChevronDown size={14} />
            </button>

            {showExportOptions && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A2530] border border-white/10 rounded-lg shadow-2xl z-[100] overflow-hidden p-1 animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => {
                    setExportFormat('png');
                    setShowExportOptions(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded text-[9px] font-black uppercase italic transition flex items-center gap-3 ${exportFormat === 'png' ? 'bg-[#FF4655] text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  <ImageIcon size={14} />
                  PNG_IMAGE
                </button>
                <button
                  onClick={() => {
                    setExportFormat('pdf');
                    setShowExportOptions(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded text-[9px] font-black uppercase italic transition flex items-center gap-3 ${exportFormat === 'pdf' ? 'bg-[#FF4655] text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                >
                  <FileText size={14} />
                  PDF_PACKAGE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Creation Row: Tools & Tactical */}
      <div className="grid grid-cols-[minmax(120px,1fr)_auto_minmax(120px,1fr)] items-center w-full gap-4 shrink-0 h-12">
        {/* Left: Tactical Side */}
        <div className="flex justify-start overflow-hidden">
          <div className={`flex p-1 gap-1 rounded-lg ${hClassBottom} ${bgModule} shrink-0`}>
            <button
              onClick={() => {
                clearSelection();
                setStrategySide('attack');
              }}
              className={`px-3 2xl:px-6 rounded text-[10px] font-black uppercase italic flex items-center justify-center gap-2.5 transition-all shrink-0 ${
                strategySide === 'attack'
                  ? 'bg-[#FF4655] text-white shadow-lg shadow-[#FF4655]/30'
                  : 'text-white/30 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Swords size={16} />
              <span className="hidden 2xl:inline">ATTACK</span>
            </button>
            <button
              onClick={() => {
                clearSelection();
                setStrategySide('defense');
              }}
              className={`px-3 2xl:px-6 rounded text-[10px] font-black uppercase italic flex items-center justify-center gap-2.5 transition-all shrink-0 ${
                strategySide === 'defense'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-white/30 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <Shield size={16} />
              <span className="hidden 2xl:inline">DEFENSE</span>
            </button>
          </div>
        </div>

        {/* CENTER: Main Toolbar (Granular Responsiveness) */}
        <div className="flex justify-center min-w-0">
          <div
            className={`flex items-center px-1.5 gap-0.5 rounded-lg ${hClassBottom} ${bgModule} relative`}
          >
            {/* Ultra High Res (>1536px): All tools */}
            <div className="hidden 2xl:flex items-center gap-0.5">
              {tools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    clearSelection();
                    setTool(t.id as EditorState['tool']);
                  }}
                  className={`h-9 w-10 flex items-center justify-center rounded transition-all active:scale-75 ${
                    tool === t.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-white/20 hover:text-white/60 hover:bg-white/5'
                  }`}
                  title={t.label}
                >
                  <t.Icon size={18} />
                </button>
              ))}
            </div>

            {/* Medium Res (LG): 6 tools + Dropdown */}
            <div className="hidden xl:flex 2xl:hidden items-center gap-0.5">
              {tools.slice(0, 6).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    clearSelection();
                    setTool(t.id as EditorState['tool']);
                  }}
                  className={`h-9 w-10 flex items-center justify-center rounded transition-all active:scale-75 ${
                    tool === t.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-white/20 hover:text-white/60 hover:bg-white/5'
                  }`}
                  title={t.label}
                >
                  <t.Icon size={18} />
                </button>
              ))}
              <div className="w-px h-6 bg-white/5 mx-1" />
              <DropdownTools
                items={Array.from(tools.slice(6))}
                current={tool}
                onSelect={setTool}
                open={showMoreTools}
                setOpen={setShowMoreTools}
                clearSelection={clearSelection}
              />
            </div>

            {/* Small Res (<LG): 5 tools + Dropdown */}
            <div className="flex xl:hidden items-center gap-0.5">
              {tools.slice(0, 5).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    clearSelection();
                    setTool(t.id as EditorState['tool']);
                  }}
                  className={`h-9 w-10 flex items-center justify-center rounded transition-all active:scale-75 shrink-0 ${
                    tool === t.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-white/20 hover:text-white/60 hover:bg-white/5'
                  }`}
                  title={t.label}
                >
                  <t.Icon size={18} />
                </button>
              ))}
              <div className="w-px h-6 bg-white/5 mx-1" />
              <DropdownTools
                items={Array.from(tools.slice(5))}
                current={tool}
                onSelect={setTool}
                open={showMoreTools}
                setOpen={setShowMoreTools}
                clearSelection={clearSelection}
              />
            </div>
          </div>
        </div>

        {/* Right: Color Control & Dangerous Actions */}
        <div className="flex justify-end gap-2 overflow-hidden">
          <div
            className={`flex items-center px-2 2xl:px-3 gap-2 2xl:gap-3 rounded-lg ${bgModule} ${hClassBottom} shrink-0`}
          >
            <div className="flex gap-1 items-center">
              {/* Palace only on high res */}
              <div className="hidden xl:flex gap-1 items-center">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCurrentColor(c.value)}
                    className={`w-5 2xl:w-6 h-5 2xl:h-6 rounded-sm transition-all relative ${
                      currentColor === c.value
                        ? 'ring-2 ring-white z-10 shadow-lg scale-110'
                        : 'opacity-20 hover:opacity-100 hover:rotate-3'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
                <div className="w-px h-4 bg-white/10 mx-1" />
              </div>

              <div className="relative group">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="absolute inset-0 w-6 h-6 opacity-0 cursor-pointer z-[1001]"
                  title="Choose custom color"
                />
                <div
                  className={`w-6 h-6 rounded-sm border border-dashed text-[6px] font-black flex items-center justify-center transition-all ${
                    !colors.some((c) => c.value === currentColor)
                      ? 'bg-[#FF4655] text-white ring-2 ring-white border-transparent'
                      : 'border-white/20 text-white/20'
                  }`}
                >
                  HEX
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setConfirmModal({
                title: 'Wipe Canvas',
                message:
                  'Are you sure you want to delete all elements? This action cannot be undone unless you have history points.',
                onConfirm: clearCanvas,
              });
            }}
            className={`w-12 h-12 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white border border-red-600/20 transition-all flex items-center justify-center active:scale-90 shrink-0`}
            title="Clear Canvas [Shift+Esc]"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

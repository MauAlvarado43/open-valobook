import { DropdownTools } from '@/components/toolbar/DropdownTools';
import type { EditorState } from '@/lib/store/editorStore';
import { TOOLS } from '@/lib/constants/toolbar';

interface ToolSelectorProps {
  tool: string;
  setTool: (tool: EditorState['tool']) => void;
  clearSelection: () => void;
  showMoreTools: boolean;
  setShowMoreTools: (show: boolean) => void;
  bgModule: string;
  hClassBottom: string;
}

export function ToolSelector({
  tool,
  setTool,
  clearSelection,
  showMoreTools,
  setShowMoreTools,
  bgModule,
  hClassBottom,
}: ToolSelectorProps) {
  return (
    <div className="flex justify-center min-w-0">
      <div
        className={`flex items-center px-1.5 gap-0.5 rounded-lg ${hClassBottom} ${bgModule} relative`}
      >
        {/* Ultra High Res (>1536px): All tools */}
        <div className="hidden 2xl:flex items-center gap-0.5">
          {TOOLS.map((t) => (
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
          {TOOLS.slice(0, 6).map((t) => (
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
            items={Array.from(TOOLS.slice(6))}
            current={tool}
            onSelect={setTool}
            open={showMoreTools}
            setOpen={setShowMoreTools}
            clearSelection={clearSelection}
          />
        </div>

        {/* Small Res (<LG): 5 tools + Dropdown */}
        <div className="flex xl:hidden items-center gap-0.5">
          {TOOLS.slice(0, 5).map((t) => (
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
            items={Array.from(TOOLS.slice(5))}
            current={tool}
            onSelect={setTool}
            open={showMoreTools}
            setOpen={setShowMoreTools}
            clearSelection={clearSelection}
          />
        </div>
      </div>
    </div>
  );
}

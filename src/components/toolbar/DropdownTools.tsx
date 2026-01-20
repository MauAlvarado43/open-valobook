import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { EditorState } from '@/lib/store/editorStore';

interface DropdownToolsProps {
  items: Array<{ id: string; label: string; Icon: any }>;
  current: string;
  onSelect: (id: EditorState['tool']) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  clearSelection: () => void;
}

export function DropdownTools({
  items,
  current,
  onSelect,
  open,
  setOpen,
  clearSelection,
}: DropdownToolsProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`h-9 w-10 flex items-center justify-center rounded transition-all active:scale-75 shrink-0 ${
          items.some((t) => t.id === current)
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-white/20 hover:text-white/60 hover:bg-white/5'
        } ${open ? 'bg-white/10 text-white' : ''}`}
        title={t('common', 'moreTools')}
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-1 bg-[#1A2530] border border-white/10 rounded-lg shadow-2xl z-[1002] grid grid-cols-2 gap-1 animate-in fade-in slide-in-from-top-1 min-w-[100px]">
          {items.map((toolItem) => (
            <button
              key={toolItem.id}
              onClick={() => {
                clearSelection();
                onSelect(toolItem.id as EditorState['tool']);
                setOpen(false);
              }}
              className={`h-10 w-11 flex items-center justify-center rounded transition-all ${
                current === toolItem.id
                  ? 'bg-blue-600 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              title={t('toolbar', toolItem.id as any)}
            >
              <toolItem.Icon size={18} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

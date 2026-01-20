import { Trash2 } from 'lucide-react';
import { COLORS } from '@/lib/constants/toolbar';

interface ColorControlProps {
  currentColor: string;
  setCurrentColor: (color: string) => void;
  handleCustomColorChange: (color: string) => void;
  onClearCanvas: () => void;
  bgModule: string;
  hClassBottom: string;
}

export function ColorControl({
  currentColor,
  setCurrentColor,
  handleCustomColorChange,
  onClearCanvas,
  bgModule,
  hClassBottom,
}: ColorControlProps) {
  return (
    <div className="flex justify-end gap-2 overflow-hidden">
      <div
        className={`flex items-center px-2 2xl:px-3 gap-2 2xl:gap-3 rounded-lg ${bgModule} ${hClassBottom} shrink-0`}
      >
        <div className="flex gap-1 items-center">
          {/* Palace only on high res */}
          <div className="hidden xl:flex gap-1 items-center">
            {COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setCurrentColor(c.value)}
                className={`w-5 2xl:w-6 h-5 2xl:h-6 rounded-sm transition-all relative ${
                  currentColor === c.value
                    ? 'ring-2 ring-white z-10 shadow-lg scale-110'
                    : 'opacity-20 hover:opacity-100 hover:rotate-3'
                }`}
                // eslint-disable-next-line react/forbid-component-props
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
                !COLORS.some((c) => c.value === currentColor)
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
        onClick={onClearCanvas}
        className={`w-12 h-12 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white border border-red-600/20 transition-all flex items-center justify-center active:scale-90 shrink-0`}
        title="Clear Canvas [Shift+Esc]"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

import { Save, Upload, Download, ChevronDown, ImageIcon, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ToolbarActionsProps {
  handleAction: (action: () => Promise<unknown>, successMsg: string) => void;
  saveStrategy: () => Promise<void>;
  loadStrategy: () => Promise<void>;
  triggerExport: () => void;
  exportFormat: 'png' | 'pdf';
  setExportFormat: (format: 'png' | 'pdf') => void;
  showExportOptions: boolean;
  setShowExportOptions: (show: boolean) => void;
  bgModule: string;
  hClassTop: string;
}

export function ToolbarActions({
  handleAction,
  saveStrategy,
  loadStrategy,
  triggerExport,
  exportFormat,
  setExportFormat,
  showExportOptions,
  setShowExportOptions,
  bgModule,
  hClassTop,
}: ToolbarActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
      <div className={`flex rounded-lg overflow-hidden ${bgModule} ${hClassTop}`}>
        <button
          onClick={() => handleAction(saveStrategy, t('common', 'success'))}
          className="h-full px-3 text-white/40 hover:text-white hover:bg-white/5 transition-all border-r border-white/5"
          title={t('toolbar', 'save')}
        >
          <Save size={12} />
        </button>
        <button
          onClick={() => handleAction(loadStrategy, t('common', 'success'))}
          className="h-full px-3 text-white/40 hover:text-white hover:bg-white/5 transition-all"
          title={t('toolbar', 'import')}
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
          title={`${t('toolbar', 'export')} [Ctrl+E]`}
        >
          <Download size={14} />
          {t('toolbar', 'export')} {exportFormat.toUpperCase()}
        </button>
        <button
          onClick={() => setShowExportOptions(!showExportOptions)}
          className="h-full w-9 text-white/60 hover:text-white border-l border-white/10 hover:bg-blue-500 transition-all rounded-r-lg flex items-center justify-center"
          title={t('common', 'settings')}
        >
          <ChevronDown size={14} />
        </button>

        {showExportOptions && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A2530] border border-white/10 rounded-lg shadow-2xl z-[2000] overflow-hidden p-1 animate-in fade-in slide-in-from-top-1">
            <button
              onClick={() => {
                setExportFormat('png');
                setShowExportOptions(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded text-[10px] font-black uppercase italic transition flex items-center gap-3 ${
                exportFormat === 'png'
                  ? 'bg-[#FF4655] text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon size={14} />
              PNG {t('toolbar', 'image')}
            </button>
            <button
              onClick={() => {
                setExportFormat('pdf');
                setShowExportOptions(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded text-[10px] font-black uppercase italic transition flex items-center gap-3 ${
                exportFormat === 'pdf'
                  ? 'bg-[#FF4655] text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={14} />
              PDF {t('toolbar', 'text')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

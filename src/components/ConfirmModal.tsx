'use client';

import { useEditorStore } from '@/lib/store/editorStore';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmModal() {
  const { confirmModal, setConfirmModal } = useEditorStore();
  const { t } = useTranslation();

  if (!confirmModal) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setConfirmModal(null)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#0F1923] border border-white/10 shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        {/* Valorant Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF4655]" />

        {/* Header */}
        <div className="p-6 pb-2 flex items-start gap-4">
          <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">
              {confirmModal.title}
            </h3>
            <p className="text-white/50 text-xs mt-1 font-medium tracking-wide leading-relaxed">
              {confirmModal.message}
            </p>
          </div>
          <button
            onClick={() => setConfirmModal(null)}
            className="text-white/20 hover:text-white transition-colors"
            title={t('common', 'close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="p-6 flex gap-3">
          <button
            onClick={() => setConfirmModal(null)}
            className="flex-1 h-11 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase italic tracking-[0.2em] transition-all border border-white/5 active:scale-95"
          >
            {t('common', 'cancel')}
          </button>
          <button
            onClick={() => {
              confirmModal.onConfirm();
              setConfirmModal(null);
            }}
            className="flex-1 h-11 bg-[#FF4655] hover:bg-[#FF4655]/90 text-white text-[10px] font-black uppercase italic tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-[#FF4655]/20"
          >
            {t('common', 'confirm')}
          </button>
        </div>

        {/* Decoration background element */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}

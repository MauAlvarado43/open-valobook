import { useEffect } from 'react';
import type Konva from 'konva';
import { useEditorStore } from '@/lib/store/editorStore';

export function useCanvasExport(stageRef: React.RefObject<Konva.Stage>) {
  const { setStatus } = useEditorStore();

  useEffect(() => {
    const handleExport = async (e: Event) => {
      const type = e.type === 'canvas:export:pdf' ? 'pdf' : 'png';

      if (!stageRef.current) return;

      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });

      if (window.electron?.saveFileDialog) {
        try {
          let exportData = dataUrl;

          if (type === 'pdf') {
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'px',
              format: [stageRef.current.width() * 2, stageRef.current.height() * 2],
            });
            pdf.addImage(
              dataUrl,
              'PNG',
              0,
              0,
              stageRef.current.width() * 2,
              stageRef.current.height() * 2
            );
            exportData = pdf.output('datauristring').split(',')[1];
          }

          const result = await window.electron.saveFileDialog(exportData, true, type);
          if (result) {
            setStatus({ type: 'success', msg: `${type.toUpperCase()} Saved Successfully` });
          } else {
            setStatus(null);
          }
        } catch (error) {
          console.error('Export failed:', error);
          setStatus({ type: 'error', msg: 'Export Failed' });
        }
      }
    };

    window.addEventListener('canvas:export', handleExport);
    window.addEventListener('canvas:export:pdf', handleExport);
    return () => {
      window.removeEventListener('canvas:export', handleExport);
      window.removeEventListener('canvas:export:pdf', handleExport);
    };
  }, [stageRef, setStatus]);
}

import { useState } from 'react';
import { Section } from '@/lib/validationSchemas';
import { toPng } from 'html-to-image';

interface DownloadPdfParams {
  tema: string;
  nivel: string;
  secciones: Section[];
}

interface UseDownloadPdfParams {
  containerRef: React.RefObject<HTMLDivElement>;
}

interface MermaidImage {
  sectionIndex: number;
  dataUrl: string;
}

export default function useDownloadPdf({ containerRef }: UseDownloadPdfParams) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async ({ tema, nivel, secciones }: DownloadPdfParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const mermaidImages: MermaidImage[] = [];

      // Buscar cada sección mermaid en el DOM y convertirla a PNG
      for (let i = 0; i < secciones.length; i++) {
        if (secciones[i].isMermaid) {
          const element = containerRef.current?.querySelector(`#mermaid-${i}`) as HTMLElement;
          if (element) {
            const dataUrl = await toPng(element, { cacheBust: true });
            mermaidImages.push({ sectionIndex: i, dataUrl });
          }
        }
      }

      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, nivel, secciones, mermaidImages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Error al generar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tema}-${nivel}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleDownload, isLoading, error };
}

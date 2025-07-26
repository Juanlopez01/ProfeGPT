import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export interface MermaidImage {
  sectionIndex: number;
  dataUrl: string;
}

export const useMermaidImages = (secciones: { content: string; isMermaid?: boolean }[]) => {
  const [images, setImages] = useState<MermaidImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderMermaidToPng = async (svgText: string, width = 600, height = 400): Promise<string> => {
      return new Promise((resolve, reject) => {
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        img.crossOrigin = 'anonymous'; // 🔐 Esto ayuda a evitar tainted canvas
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No se pudo obtener el contexto del canvas');

            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
          } catch (e) {
            reject('Error convirtiendo SVG a PNG: canvas tainted');
          }
        };

        img.onerror = reject;
        img.src = url;
      });
    };

    const generateImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const mermaidSections = secciones.map((section, index) => ({ ...section, index })).filter(s => s.isMermaid);
        const results: MermaidImage[] = [];

        for (const { content, index } of mermaidSections) {
          const { svg } = await mermaid.render(`mermaid-${index}`, content);
          const dataUrl = await renderMermaidToPng(svg);
          results.push({ sectionIndex: index, dataUrl });
        }

        setImages(results);
      } catch (err) {
        setError('Error generando imágenes Mermaid');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (secciones.some(s => s.isMermaid)) {
      generateImages();
    }
  }, [secciones]);

  return { images, loading, error };
};

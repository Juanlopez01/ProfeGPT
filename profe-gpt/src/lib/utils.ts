import { PDFFont } from "pdf-lib";

export function cn(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) lines.push(currentLine);
  }

  return lines;
}

import mermaid from 'mermaid';

export const svgToPngBase64 = (svgCode: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Crear un blob local con el SVG (sin depender de CORS)
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Esto es preventivo, aunque con blob no suele ser necesario
    img.onload = () => {
      // Crear canvas del mismo tamaño que la imagen
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 800;
      canvas.height = img.height || 400;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('No se pudo obtener el contexto del canvas');
        return;
      }

      ctx.drawImage(img, 0, 0);
      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (error) {
        reject('Error generando la imagen PNG del canvas');
      } finally {
        URL.revokeObjectURL(url); // limpieza de memoria
      }
    };

    img.onerror = () => {
      reject('Error al cargar la imagen SVG');
      URL.revokeObjectURL(url); // limpieza
    };

    img.src = url; // se asigna al final
  });
};

export async function renderMermaidSvg(code: string): Promise<string> {
  mermaid.initialize({ startOnLoad: false });

  const element = document.createElement('div');
  element.style.display = 'none';
  document.body.appendChild(element);

  return mermaid.render('generatedDiagram', code, element)
    .then((result) => {
      element.remove();
      return result.svg;
    });
}
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Section } from '@/lib/validationSchemas';

interface MermaidImage {
  sectionIndex: number;
  dataUrl: string;
}

interface GeneratePdfParams {
  tema: string;
  nivel: string;
  secciones: Section[];
  mermaidImages?: MermaidImage[];
}

export async function generateStudyPdf({ tema, nivel, secciones, mermaidImages }: GeneratePdfParams): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const fontSize = 12;
  const lineHeight = 16;
  const margin = 50;
  let y = height - margin;

  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
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
    return lines;
  };

  for (let index = 0; index < secciones.length; index++) {
    const section = secciones[index];

    // Título
    const titleLines = wrapText(section.title, width - 2 * margin);
    for (const line of titleLines) {
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize + 2, font, color: rgb(0, 0.4, 0.6) });
      y -= lineHeight;
    }

    y -= 6; // Espacio extra

    // Si es una sección mermaid, insertar imagen
    if (section.isMermaid && mermaidImages) {
    const imageMatch = mermaidImages.find((img) => img.sectionIndex === index);
    if (imageMatch) {
      const imageBytes = await fetch(imageMatch.dataUrl).then((res) => res.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(imageBytes);
      const pngDims = pngImage.scale(0.5);

      if (y - pngDims.height < margin) {
        page = pdfDoc.addPage(); // ⚠️ Asegurate que "page" esté declarado con "let"
        y = height - margin;
      }

      page.drawImage(pngImage, {
        x: margin,
        y: y - pngDims.height,
        width: pngDims.width,
        height: pngDims.height,
      });

      y -= pngDims.height + lineHeight;
      continue;
    }
  }

    const contentLines = wrapText(section.content.replace(/\n/g, ' '), width - 2 * margin);
    for (const line of contentLines) {
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font });
      y -= lineHeight;
    }

    y -= lineHeight;
  }
  console.log(pdfDoc)
  return await pdfDoc.save();
}
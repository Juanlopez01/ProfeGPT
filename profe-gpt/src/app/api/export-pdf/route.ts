import { NextRequest, NextResponse } from 'next/server';
import { generateStudyPdf } from '@/lib/exportToPdf';
import { z } from 'zod';

const sectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  isMermaid: z.boolean().optional(),
});

const mermaidImageSchema = z.object({
  sectionIndex: z.number(),
  dataUrl: z.string(),
});

const bodySchema = z.object({
  tema: z.string(),
  nivel: z.string(),
  secciones: z.array(sectionSchema),
  mermaidImages: z.array(mermaidImageSchema).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tema, nivel, secciones, mermaidImages } = bodySchema.parse(body);
    console.log(body);
    
    const pdfBytes = await generateStudyPdf({ tema, nivel, secciones, mermaidImages });

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${tema}-${nivel}.pdf"`,
      },
    });
  } catch (err) {
    console.error('Error generando PDF:', err);
    return NextResponse.json({ error: 'Error generando el PDF' }, { status: 500 });
  }
}
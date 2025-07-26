import { openai } from '@/lib/openAi';
import { NextResponse } from 'next/server';
import { staticTestResponse } from '@/lib/staticTestResponse';
import { buildStudyPrompt } from '@/lib/buildStudyPrompt';
import {
  generateSchema,
  parsedResponseSchema,
  generatedStudySchema
} from '@/lib/validationSchemas';
import { parseResponse } from '@/lib/parseResponse';

export async function POST(req: Request) {
  try {
    // 1. Parseamos y validamos el input con Zod
    const body = await req.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.format() }, { status: 400 });
    }

    const { tema, nivel } = parsed.data;

    // 2. Generamos el prompt con función externa
    const prompt = buildStudyPrompt(tema, nivel);

    // 3. Ejecutamos modelo (modo real o test)
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-4o',
    //   messages: [{ role: 'user', content: prompt }],
    //   temperature: 0.7,
    // });
    // const text = completion.choices[0].message?.content || '';
    const text = staticTestResponse;

    // 4. Parseamos la respuesta generada
    const secciones = parseResponse(text);

    // 5. Validamos que la estructura parseada sea correcta
    const validated = parsedResponseSchema.safeParse(secciones);
    if (!validated.success) {
      return NextResponse.json({ error: 'Error en el formato de la respuesta generada', details: validated.error.format() }, { status: 500 });
    }

    // 6. Devolvemos toda la estructura (opcional: solo secciones si preferís)
    return NextResponse.json({
      tema,
      nivel,
      secciones
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error generando explicación' }, { status: 500 });
  }
}

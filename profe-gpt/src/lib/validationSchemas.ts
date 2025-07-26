import { z } from 'zod';

export const NivelEducativo = z.enum([
  'primaria',
  'secundaria',
  'universidad',
  'general',
]);

export const generateSchema = z.object({
  tema: z.string().min(3, 'El tema debe tener al menos 3 caracteres'),
  nivel: NivelEducativo,
});

export type GenerateInput = z.infer<typeof generateSchema>;

export const sectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  isMermaid: z.boolean().optional(), // solo si ya parseás esto en backend
});

export const parsedResponseSchema = z.array(sectionSchema);

export type Section = z.infer<typeof sectionSchema>;
// Estructura completa para guardar o exportar una respuesta generada
export const generatedStudySchema = z.object({
  tema: z.string(),
  nivel: NivelEducativo,
  secciones: parsedResponseSchema,
});

export type GeneratedStudy = z.infer<typeof generatedStudySchema>;

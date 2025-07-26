export interface Section {
  title: string;
  content: string;
  isMermaid?: boolean;
}

export interface EnrichedSection extends Section {
  imageBase64?: string;
}

export interface DownloadPdfParams {
  tema: string;
  nivel: string;
  secciones: EnrichedSection[];
}
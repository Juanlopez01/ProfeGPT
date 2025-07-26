'use client';

import React from 'react';
import { useDownloadPdf } from '@/hooks/useDownloadPdf';
import type { Section } from '@/lib/validationSchemas';

interface DownloadPdfButtonProps {
  tema: string;
  nivel: string;
  secciones: Section[];
}

export const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ tema, nivel, secciones }) => {
  const { handleDownload, isLoading, error } = useDownloadPdf();

  return (
    <div className="w-full flex flex-col items-end gap-2 mb-6">
      <button
        onClick={() => handleDownload({ tema, nivel, secciones })}
        disabled={isLoading}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generando PDF...' : 'Descargar PDF'}
      </button>

      {error && (
        <span className="text-sm text-red-500">
          Error al generar el PDF: {error}
        </span>
      )}
    </div>
  );
};

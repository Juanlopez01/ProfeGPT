'use client';

import { useRef } from 'react';
import { Section } from '@/lib/validationSchemas';
import MermaidChart from './mermaidChart';
import { DownloadPdfButton } from './downloadPdfButton';
import useDownloadPdf from '@/hooks/useDownloadPdf';

interface OutputSectionProps {
  tema: string;
  nivel: string;
  output: Section[];
}

export default function OutputSection({ tema, nivel, output }: OutputSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6" ref={containerRef}>
      {output.map((section, index) => (
        <div
          key={index}
          className="bg-blue-950/50 border border-blue-700 shadow-md rounded-xl p-5 sm:p-6 text-blue-100"
        >
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-cyan-300 tracking-wide">
            {section.title}
          </h3>

          {!section.isMermaid && (
            <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed tracking-wide mb-4">
              {section.content}
            </p>
          )}

          {section.isMermaid && (
            <MermaidChart chart={section.content} id={index.toString()} />
          )}
        </div>
      ))}

    </div>
  );
}

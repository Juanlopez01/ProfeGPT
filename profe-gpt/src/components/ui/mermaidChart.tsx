// 📁 src/components/MermaidChart.tsx
'use client';

import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';

interface MermaidChartProps {
  chart: string;
  id: string; // Pasamos el id desde afuera
}

export default function MermaidChart({ chart, id }: MermaidChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ startOnLoad: false });

      mermaid.render(`mermaid-chart-${id}`, chart)
        .then(({ svg }) => {
          ref.current!.innerHTML = svg;
        })
        .catch((err) => {
          console.error('Error al renderizar Mermaid:', err);
          setError('No se pudo renderizar el gráfico.');
        });
    }
  }, [chart, id]);

  return (
    <div id={`mermaid-${id}`} ref={ref} className="w-full overflow-x-auto my-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { parseResponse } from '@/lib/parseResponse';
import { staticTestResponse } from '@/lib/staticTestResponse';
import  OutputSection  from '@/components/ui/outputSection';
import  CheckoutButton  from '@/components/ui/checkoutButton';

export default function HomePage() {
  const [tema, setTema] = useState('');
  const [nivel, setNivel] = useState<'primaria' | 'secundaria' | 'universidad'>('secundaria');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    // TEST MODE
    setTimeout(() => {
      setResponse(staticTestResponse);
      setLoading(false);
    }, 1000);
  };
  const handleCreatePreference = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, nivel }),
      });

      if (!res.ok) throw new Error('Error al crear preferencia');

      const data = await res.json();
      setPreferenceId(data.init_point); // O data.preferenceId si lo nombraste así
    } catch (err) {
      console.error(err);
      alert('Hubo un error al generar el enlace de pago.');
    } finally {
      setLoading(false);
    }
  };
  const output = parseResponse(response || '');

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-800 text-white font-sans px-4 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-20 w-full">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight text-blue-200 drop-shadow-md">
        Explicámelo Fácil 🧠
      </h1>
      <p className="text-center text-blue-100 text-base sm:text-lg mb-10 max-w-xl mx-auto">
        Pedí una explicación completa, entendé sin sufrir y estudiá con estilo futurista.
      </p>

      <div className="space-y-4 bg-blue-900/50 shadow-xl backdrop-blur-lg border border-blue-700 rounded-xl p-6 sm:p-8 w-full">
        <Textarea
          placeholder="¿Qué tema no entendés?"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          className="w-full min-h-[120px] resize-none bg-blue-950 text-blue-100 placeholder:text-cyan-400 border border-cyan-600 rounded-xl p-4 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-md shadow-cyan-500/30 transition-all duration-200 tracking-wide text-base font-light"
        />

        <select
          className="w-full rounded-md px-4 py-2 bg-blue-950/60 border border-blue-600 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={nivel}
          onChange={(e) => setNivel(e.target.value as typeof nivel)}
        >
          <option value="primaria">Primaria</option>
          <option value="secundaria">Secundaria</option>
          <option value="universidad">Universidad</option>
        </select>

        {loading ? (
          <Button
            disabled
            className="w-full flex justify-center items-center bg-gray-400 text-white py-3 rounded-xl"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando pago...
          </Button>
        ) : preferenceId ? (
          <CheckoutButton preferenceId={preferenceId} />
        ) : (
          <Button
            onClick={handleCreatePreference}
            disabled={!tema}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold tracking-wide shadow-lg border border-cyan-400 rounded-xl py-3 transition-all duration-200"
          >
            Pagar y desbloquear
          </Button>
        )}
      </div>
      <OutputSection output={output} tema={tema} nivel={nivel} />
    </main>
  );
}
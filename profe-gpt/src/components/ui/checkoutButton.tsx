'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  preferenceId: string;
}


export default function CheckoutButton({ preferenceId }: CheckoutButtonProps) {
  const [mercadoPagoReady, setMercadoPagoReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    if (window.MercadoPago) {
      setMercadoPagoReady(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => setMercadoPagoReady(true);
    script.onerror = () => console.error('Error cargando SDK de MercadoPago');
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isProcessing ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isProcessing]);

  const handleCheckout = () => {
    if (!window.MercadoPago) return;

    setIsProcessing(true);
    
    
    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, {
      locale: 'es-AR',
    });

    mp.checkout({
      preference: {
        id: preferenceId,
      },
      autoOpen: true,
    });

    // En caso de que el usuario cierre el modal sin pagar
    setTimeout(() => setIsProcessing(false), 4000);
  };

  return (
    <>
      <button
        onClick={handleCheckout}
        disabled={!mercadoPagoReady || isProcessing}
        className="w-full flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold tracking-wide shadow-lg shadow-cyan-500/20 border border-cyan-400 rounded-xl py-3 transition-all duration-200"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirigiendo...
          </>
        ) : !mercadoPagoReady ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando pago...
          </>
        ) : (
          'Pagar y desbloquear'
        )}
      </button>

      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="text-white text-lg flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            Redirigiendo al checkout...
          </div>
        </div>
      )}
    </>
  );
}

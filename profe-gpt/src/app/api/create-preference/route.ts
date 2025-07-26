import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const title = body.title || 'Solicitud de contenido';
    const price = Number(body.price) || 5;

    if (!title || !price) {
      return NextResponse.json({ error: 'Faltan datos en la preferencia' }, { status: 400 });
    }
    console.log('BACK URL SUCCESS:', process.env.NEXT_PUBLIC_BASE_URL + '/success');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: 'Falta NEXT_PUBLIC_BASE_URL' }, { status: 500 });
    }
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: `item-${Date.now()}`,
            title,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: price,
          },
        ],
        back_urls: {
          success: `${baseUrl}/success`,
          failure: `${baseUrl}/failure`,
          pending: `${baseUrl}/pending`,
        },
        auto_return: 'approved',
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    console.error('⚠️ Error al crear preferencia:', error);
    return NextResponse.json({ error: 'No se pudo crear la preferencia' }, { status: 500 });
  }
}

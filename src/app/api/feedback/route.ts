import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

// Public endpoint — uses service role to bypass RLS for inserts only
export async function POST(req: Request) {
  const body = await req.json();
  const { business_id, customer_name, customer_phone, rating, message } = body;
  if (!business_id || !rating) return NextResponse.json({ error: 'missing fields' }, { status: 400 });

  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const r = await fetch(`${serviceUrl}/rest/v1/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ business_id, customer_name, customer_phone, rating, message, status: 'new' }),
  });
  if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id, status, notes } = await req.json();
  const patch: any = {};
  if (status) patch.status = status;
  if (notes !== undefined) patch.notes = notes;
  const { error } = await supabase.from('feedback').update(patch).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

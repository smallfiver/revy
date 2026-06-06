import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { review_id } = await req.json();

  const { data: review } = await supabase.from('reviews').select('*, businesses(name)').eq('id', review_id).single();
  if (!review) return NextResponse.json({ error: 'review not found' }, { status: 404 });

  const { data: settings } = await supabase.from('settings').select('ai_tone, ai_signature').eq('business_id', review.business_id).maybeSingle();
  const tone = settings?.ai_tone || 'friendly';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith('REPLACE')) {
    const fallback = review.rating >= 4
      ? `Olá ${review.author_name}! Muito obrigado pela avaliação. Ficamos felizes em saber que você teve uma boa experiência. Conte sempre com a gente! 🙏`
      : `Olá ${review.author_name}. Sentimos muito pela experiência. Gostaríamos muito de entender o que aconteceu para melhorarmos. Pode entrar em contato com a gente?`;
    return NextResponse.json({ text: fallback, fallback: true });
  }

  const prompt = `Você é o gerente do negócio "${(review.businesses as any)?.name}". Um cliente deixou esta avaliação (${review.rating}/5 estrelas):\n"${review.comment || '(sem comentário)'}"\n\nResponda em português brasileiro, tom ${tone === 'formal' ? 'formal' : tone === 'casual' ? 'casual' : 'amigável e profissional'}. Máximo 3 frases. Use o nome do cliente: ${review.author_name}. ${settings?.ai_signature ? `Assine com: ${settings.ai_signature}` : ''}`;

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 200 })
  });
  if (!r.ok) return NextResponse.json({ error: 'openai error' }, { status: 500 });
  const j = await r.json();
  const text = j.choices?.[0]?.message?.content?.trim() || '';
  return NextResponse.json({ text });
}

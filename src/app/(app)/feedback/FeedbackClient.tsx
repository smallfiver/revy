'use client';
import { useState } from 'react';
import { MessageSquare, Copy, Star, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackClient({ initial, business, publicUrl }: { initial: any[]; business: any; publicUrl: string }) {
  const [items, setItems] = useState(initial);

  async function mark(id: string, status: string) {
    const res = await fetch('/api/feedback', { method: 'PATCH', body: JSON.stringify({ id, status }) });
    if (res.ok) setItems(items.map(i => i.id === id ? { ...i, status } : i));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><MessageSquare className="w-6 h-6 text-revy" /> Feedback Interno</h1>
        <p className="text-sm text-slate-500 mt-1">Avaliações negativas chegam aqui — em vez de ir parar no Google.</p>
      </div>

      <div className="card p-5 bg-gradient-to-r from-revy/5 to-revy-gold/5">
        <strong className="text-sm">Seu link público de feedback</strong>
        <div className="flex items-center gap-2 mt-2">
          <code className="flex-1 px-3 py-2 bg-white rounded-lg text-xs border border-slate-200 truncate">{publicUrl}</code>
          <button onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success('Copiado'); }} className="px-3 py-2 rounded-lg bg-revy text-white text-sm flex items-center gap-1">
            <Copy className="w-3 h-3" /> Copiar
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Envie esse link aos clientes. Quem avaliar com {business.rating_threshold}+ estrelas é redirecionado para o Google. Avaliações menores ficam aqui para você resolver antes.</p>
      </div>

      <div className="space-y-3">
        {items.length === 0 && <div className="card p-10 text-center text-slate-500">Nenhum feedback ainda.</div>}
        {items.map(f => (
          <div key={f.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <strong>{f.customer_name || 'Anônimo'}</strong>
                  <span className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= f.rating ? 'text-revy-gold fill-revy-gold' : 'text-slate-200'}`} />)}</span>
                </div>
                {f.customer_phone && <p className="text-xs text-slate-500 mt-1">{f.customer_phone}</p>}
                {f.message && <p className="text-sm text-slate-700 mt-2">{f.message}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-xs px-2 py-1 rounded-full text-center ${f.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : f.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{f.status}</span>
                {f.status !== 'resolved' && (
                  <button onClick={() => mark(f.id, 'resolved')} className="text-xs flex items-center gap-1 text-emerald-600"><CheckCircle className="w-3 h-3" /> Resolver</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

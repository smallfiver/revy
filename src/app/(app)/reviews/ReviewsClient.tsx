'use client';
import { useState } from 'react';
import { Star, Plus, Loader2, Sparkles, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Review = {
  id: string; author_name: string; rating: number; comment: string | null;
  reply: string | null; status: string | null; created_at: string;
};

export function ReviewsClient({ initial, businessId }: { initial: Review[]; businessId: string }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initial);
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied' | number>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Review | null>(null);

  const filtered = reviews.filter(r =>
    filter === 'all' ? true :
    filter === 'pending' ? r.status === 'pending' :
    filter === 'replied' ? r.status === 'replied' :
    typeof filter === 'number' ? r.rating === filter : true
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Avaliações</h1>
          <p className="text-sm text-slate-500 mt-1">{reviews.length} avaliações no total</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2.5 rounded-xl gradient-revy text-white font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Adicionar manualmente
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'replied'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${filter === f ? 'bg-revy text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Respondidas'}
          </button>
        ))}
        {[5, 4, 3, 2, 1].map(n => (
          <button key={n} onClick={() => setFilter(n)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${filter === n ? 'bg-revy text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {n} <Star className="w-3 h-3 fill-current" />
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card p-10 text-center text-slate-500">Nenhuma avaliação encontrada.</div>
        )}
        {filtered.map(r => (
          <div key={r.id} onClick={() => setSelected(r)} className="card p-5 cursor-pointer hover:shadow-pop transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <strong>{r.author_name}</strong>
                  <span className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'text-revy-gold fill-revy-gold' : 'text-slate-200'}`} />)}
                  </span>
                </div>
                {r.comment && <p className="text-sm text-slate-600 mt-2">{r.comment}</p>}
                {r.reply && <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm"><strong>Sua resposta:</strong> {r.reply}</div>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'replied' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {r.status === 'replied' ? 'Respondida' : 'Pendente'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showAdd && <AddModal businessId={businessId} onClose={() => setShowAdd(false)} onSaved={(r: Review) => { setReviews([r, ...reviews]); setShowAdd(false); router.refresh(); }} />}
      {selected && <ReviewDrawer review={selected} onClose={() => setSelected(null)} onUpdate={updated => { setReviews(reviews.map(r => r.id === updated.id ? updated : r)); setSelected(updated); }} />}
    </div>
  );
}

function AddModal({ businessId, onClose, onSaved }: any) {
  const [form, setForm] = useState({ author_name: '', rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  async function save() {
    setLoading(true);
    const res = await fetch('/api/reviews', { method: 'POST', body: JSON.stringify({ ...form, business_id: businessId }) });
    setLoading(false);
    if (res.ok) { const { review } = await res.json(); onSaved(review); toast.success('Avaliação adicionada'); }
    else toast.error('Erro');
  }
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50" onClick={onClose}>
      <div className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-xl font-bold mb-4">Adicionar avaliação</h2>
        <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-3" placeholder="Nome do cliente" value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} />
        <div className="flex gap-1 mb-3">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setForm({ ...form, rating: n })}><Star className={`w-7 h-7 ${n <= form.rating ? 'text-revy-gold fill-revy-gold' : 'text-slate-200'}`} /></button>
          ))}
        </div>
        <textarea className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-3 min-h-24" placeholder="Comentário (opcional)" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200">Cancelar</button>
          <button onClick={save} disabled={loading || !form.author_name} className="flex-1 py-2.5 rounded-xl gradient-revy text-white font-medium disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewDrawer({ review, onClose, onUpdate }: { review: Review; onClose: () => void; onUpdate: (r: Review) => void }) {
  const [reply, setReply] = useState(review.reply || '');
  const [gen, setGen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function generateAI() {
    setGen(true);
    const res = await fetch('/api/ai/reply', { method: 'POST', body: JSON.stringify({ review_id: review.id }) });
    setGen(false);
    if (res.ok) { const { text } = await res.json(); setReply(text); toast.success('Resposta gerada'); }
    else toast.error('Configure a OPENAI_API_KEY em Configurações');
  }

  async function save() {
    setSaving(true);
    const res = await fetch('/api/reviews', { method: 'PATCH', body: JSON.stringify({ id: review.id, reply, status: 'replied' }) });
    setSaving(false);
    if (res.ok) { onUpdate({ ...review, reply, status: 'replied' }); toast.success('Resposta salva'); }
    else toast.error('Erro');
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white p-6 overflow-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="text-sm text-slate-500 mb-4">← Fechar</button>
        <h2 className="font-display text-xl font-bold">{review.author_name}</h2>
        <div className="flex mt-1">
          {[1,2,3,4,5].map(i => <Star key={i} className={`w-5 h-5 ${i <= review.rating ? 'text-revy-gold fill-revy-gold' : 'text-slate-200'}`} />)}
        </div>
        {review.comment && <p className="mt-4 text-slate-700">{review.comment}</p>}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Sua resposta</label>
            <button onClick={generateAI} disabled={gen} className="text-xs flex items-center gap-1 text-revy font-medium">
              {gen ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Gerar com IA
            </button>
          </div>
          <textarea value={reply} onChange={e => setReply(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 min-h-32" placeholder="Escreva ou gere uma resposta..." />
          <button onClick={save} disabled={saving || !reply} className="mt-3 w-full py-2.5 rounded-xl gradient-revy text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Salvar resposta
          </button>
        </div>
      </div>
    </div>
  );
}

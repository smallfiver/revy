'use client';
import { useState } from 'react';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';

export function PublicFeedbackForm({ businessId, businessName, threshold, googleLink }: { businessId: string; businessName: string; threshold: number; googleLink: string | null }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!rating) return;
    setLoading(true);
    await fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ business_id: businessId, customer_name: name, customer_phone: phone, rating, message }) });
    setLoading(false);
    if (rating >= threshold && googleLink) {
      window.location.href = googleLink;
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="card p-10 max-w-md w-full text-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold">Obrigado!</h1>
        <p className="text-slate-600 mt-2">Recebemos seu feedback e vamos analisar com muito cuidado.</p>
      </div>
    );
  }

  return (
    <div className="card p-8 max-w-md w-full">
      <h1 className="font-display text-2xl font-bold text-center">{businessName}</h1>
      <p className="text-center text-slate-500 mt-1 mb-6">Como foi sua experiência?</p>

      <div className="flex justify-center gap-2 mb-6">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => setRating(n)}>
            <Star className={`w-10 h-10 ${n <= rating ? 'text-revy-gold fill-revy-gold' : 'text-slate-200'}`} />
          </button>
        ))}
      </div>

      {rating > 0 && rating < threshold && (
        <>
          <p className="text-sm text-slate-600 mb-3 text-center">Sentimos muito. Conte o que aconteceu para melhorarmos:</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-2" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="WhatsApp (com DDD)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 mb-2" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Descreva sua experiência" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 min-h-24 mb-3" />
        </>
      )}

      {rating > 0 && (
        <button onClick={submit} disabled={loading} className="w-full py-3 rounded-xl gradient-revy text-white font-medium disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : rating >= threshold ? 'Avaliar no Google' : 'Enviar feedback'}
        </button>
      )}
    </div>
  );
}

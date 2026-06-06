'use client';
import { useState } from 'react';
import { Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsClient({ business, settings }: { business: any; settings: any }) {
  const [biz, setBiz] = useState({ name: business.name || '', category: business.category || '', phone: business.phone || '', address: business.address || '', rating_threshold: business.rating_threshold || 4 });
  const [s, setS] = useState({
    ai_tone: settings.ai_tone || 'friendly',
    ai_signature: settings.ai_signature || '',
    ai_auto_reply: !!settings.ai_auto_reply,
    google_review_link: settings.google_review_link || '',
    whatsapp_message_template: settings.whatsapp_message_template || 'Olá {nome}! Como foi sua experiência conosco?',
    whatsapp_followup_positive: settings.whatsapp_followup_positive || 'Que ótimo! Poderia compartilhar sua avaliação no Google? 🙏 {link}',
    whatsapp_followup_negative: settings.whatsapp_followup_negative || 'Sentimos muito. Vamos entrar em contato para resolver.',
  });
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const r1 = await fetch('/api/business', { method: 'PATCH', body: JSON.stringify({ id: business.id, ...biz }) });
    const r2 = await fetch('/api/settings', { method: 'POST', body: JSON.stringify({ business_id: business.id, ...s }) });
    setLoading(false);
    if (r1.ok && r2.ok) toast.success('Configurações salvas');
    else toast.error('Erro ao salvar');
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><SettingsIcon className="w-6 h-6 text-revy" /> Configurações</h1>

      <Section title="Informações do negócio">
        <Field label="Nome" value={biz.name} onChange={v => setBiz({ ...biz, name: v })} />
        <Field label="Categoria" value={biz.category} onChange={v => setBiz({ ...biz, category: v })} />
        <Field label="Telefone" value={biz.phone} onChange={v => setBiz({ ...biz, phone: v })} />
        <Field label="Endereço" value={biz.address} onChange={v => setBiz({ ...biz, address: v })} />
        <label className="block mt-3">
          <span className="text-sm font-medium">Nota mínima para enviar ao Google (1-5)</span>
          <input type="number" min={1} max={5} value={biz.rating_threshold} onChange={e => setBiz({ ...biz, rating_threshold: +e.target.value })} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200" />
        </label>
      </Section>

      <Section title="Google Reviews">
        <Field label="Link público do Google Reviews" value={s.google_review_link} onChange={v => setS({ ...s, google_review_link: v })} placeholder="https://g.page/r/..." />
        <p className="text-xs text-slate-500 mt-1">Pegue em google.com/business → Compartilhar avaliações.</p>
      </Section>

      <Section title="Inteligência Artificial">
        <label className="block">
          <span className="text-sm font-medium">Tom das respostas</span>
          <select value={s.ai_tone} onChange={e => setS({ ...s, ai_tone: e.target.value })} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200">
            <option value="friendly">Amigável</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
        </label>
        <Field label="Assinatura nas respostas" value={s.ai_signature} onChange={v => setS({ ...s, ai_signature: v })} placeholder="— Equipe XYZ" />
        <label className="flex items-center gap-2 mt-3">
          <input type="checkbox" checked={s.ai_auto_reply} onChange={e => setS({ ...s, ai_auto_reply: e.target.checked })} />
          <span className="text-sm">Responder avaliações 5★ automaticamente</span>
        </label>
      </Section>

      <Section title="Mensagens WhatsApp (templates)">
        <Field label="Mensagem inicial" value={s.whatsapp_message_template} onChange={v => setS({ ...s, whatsapp_message_template: v })} />
        <Field label="Follow-up positivo" value={s.whatsapp_followup_positive} onChange={v => setS({ ...s, whatsapp_followup_positive: v })} />
        <Field label="Follow-up negativo" value={s.whatsapp_followup_negative} onChange={v => setS({ ...s, whatsapp_followup_negative: v })} />
      </Section>

      <button onClick={save} disabled={loading} className="px-6 py-3 rounded-xl gradient-revy text-white font-medium disabled:opacity-50">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar tudo'}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <div className="card p-6"><h3 className="font-display text-lg font-bold mb-3">{title}</h3>{children}</div>; }
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <label className="block mt-3"><span className="text-sm font-medium">{label}</span><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200" /></label>;
}

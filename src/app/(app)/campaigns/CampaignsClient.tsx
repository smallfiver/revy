'use client';
import { useState } from 'react';
import { Megaphone, Plus, Loader2, Upload, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function CampaignsClient({ initial, business }: { initial: any[]; business: any }) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [campaigns] = useState(initial);

  async function launch(id: string) {
    const res = await fetch('/api/campaigns/send', { method: 'POST', body: JSON.stringify({ campaign_id: id }) });
    if (res.ok) { const j = await res.json(); toast.success(`${j.sent} mensagens enviadas`); router.refresh(); }
    else { const j = await res.json(); toast.error(j.error || 'Erro'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Megaphone className="w-6 h-6 text-revy" /> Campanhas</h1>
          <p className="text-sm text-slate-500 mt-1">Solicite avaliações em massa via WhatsApp.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="px-4 py-2.5 rounded-xl gradient-revy text-white font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova campanha
        </button>
      </div>

      <div className="grid gap-3">
        {campaigns.length === 0 && <div className="card p-10 text-center text-slate-500">Nenhuma campanha ainda. Crie a primeira!</div>}
        {campaigns.map(c => (
          <div key={c.id} className="card p-5 flex items-center justify-between">
            <div>
              <strong>{c.name}</strong>
              <p className="text-sm text-slate-500 mt-1">{c.sent_count || 0}/{c.total_recipients || 0} enviadas · <span className="capitalize">{c.status}</span></p>
            </div>
            {c.status === 'draft' && (
              <button onClick={() => launch(c.id)} className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm flex items-center gap-1"><Play className="w-3 h-3" /> Iniciar</button>
            )}
          </div>
        ))}
      </div>

      {showNew && <NewCampaign business={business} onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); router.refresh(); }} />}
    </div>
  );
}

function NewCampaign({ business, onClose, onCreated }: any) {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('Olá {nome}! Como foi sua experiência conosco? Sua opinião é muito importante 🙏');
  const [csv, setCsv] = useState('');
  const [loading, setLoading] = useState(false);

  async function save() {
    const customers = csv.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
      const [nameC, phoneC] = line.split(',').map(s => s.trim());
      return { name: nameC, phone: phoneC };
    }).filter(c => c.name && c.phone);
    if (customers.length === 0) return toast.error('Adicione clientes (nome,telefone)');
    setLoading(true);
    const res = await fetch('/api/campaigns', { method: 'POST', body: JSON.stringify({ business_id: business.id, name, message_template: template, customers }) });
    setLoading(false);
    if (res.ok) { toast.success('Campanha criada'); onCreated(); }
    else toast.error('Erro');
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <h2 className="font-display text-xl font-bold mb-4">Nova campanha</h2>
        <label className="block mb-3">
          <span className="text-sm font-medium">Nome da campanha</span>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200" />
        </label>
        <label className="block mb-3">
          <span className="text-sm font-medium">Mensagem (use {'{nome}'} para personalizar)</span>
          <textarea value={template} onChange={e => setTemplate(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 min-h-24" />
        </label>
        <label className="block mb-3">
          <span className="text-sm font-medium flex items-center gap-1"><Upload className="w-3 h-3" /> Clientes (uma linha por cliente: <code>Nome,Telefone</code>)</span>
          <textarea value={csv} onChange={e => setCsv(e.target.value)} placeholder="João Silva,5511999998888&#10;Maria Santos,5511988887777" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 min-h-32 font-mono text-xs" />
        </label>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200">Cancelar</button>
          <button onClick={save} disabled={loading || !name} className="flex-1 py-2.5 rounded-xl gradient-revy text-white font-medium disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Criar campanha'}
          </button>
        </div>
      </div>
    </div>
  );
}

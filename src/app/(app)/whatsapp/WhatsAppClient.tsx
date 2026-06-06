'use client';
import { useState } from 'react';
import { MessageCircle, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function WhatsAppClient({ business }: { business: any }) {
  const [instanceId, setInstanceId] = useState(business.whatsapp_instance_id || '');
  const [phone, setPhone] = useState(business.whatsapp_phone || '');
  const [saving, setSaving] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testMsg, setTestMsg] = useState('Olá! Esta é uma mensagem de teste do Revy 🚀');
  const [sending, setSending] = useState(false);
  const connected = business.whatsapp_connected;

  async function saveConfig() {
    setSaving(true);
    const res = await fetch('/api/whatsapp/config', { method: 'POST', body: JSON.stringify({ business_id: business.id, instance_id: instanceId, phone }) });
    setSaving(false);
    if (res.ok) { toast.success('Configuração salva'); location.reload(); }
    else toast.error('Erro ao salvar');
  }

  async function sendTest() {
    if (!testPhone) return toast.error('Informe um telefone');
    setSending(true);
    const res = await fetch('/api/whatsapp/send', { method: 'POST', body: JSON.stringify({ business_id: business.id, phone: testPhone, message: testMsg }) });
    setSending(false);
    if (res.ok) toast.success('Mensagem enviada!');
    else { const j = await res.json(); toast.error(j.error || 'Erro ao enviar'); }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><MessageCircle className="w-6 h-6 text-revy" /> WhatsApp</h1>
        <p className="text-sm text-slate-500 mt-1">Configure o Z-API para enviar mensagens automáticas aos seus clientes.</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          {connected ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-slate-400" />}
          <strong>{connected ? 'Conectado' : 'Não conectado'}</strong>
        </div>
        <p className="text-sm text-slate-600 mb-4">Crie uma conta gratuita em <a className="text-revy underline" target="_blank" href="https://z-api.io">z-api.io</a>, gere uma instância e cole o ID abaixo. As credenciais de token/clientToken devem ser definidas nas variáveis de ambiente da Vercel (<code className="text-xs bg-slate-100 px-1 rounded">ZAPI_TOKEN</code>, <code className="text-xs bg-slate-100 px-1 rounded">ZAPI_CLIENT_TOKEN</code>).</p>
        <Field label="ID da Instância Z-API" value={instanceId} onChange={setInstanceId} placeholder="3D1B2C..." />
        <Field label="Número do WhatsApp (com DDI/DDD)" value={phone} onChange={setPhone} placeholder="5511999999999" />
        <button onClick={saveConfig} disabled={saving} className="mt-4 px-4 py-2.5 rounded-xl gradient-revy text-white font-medium disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar configuração'}
        </button>
      </div>

      <div className="card p-6">
        <h3 className="font-display text-lg font-bold mb-3">Enviar mensagem de teste</h3>
        <Field label="Telefone destino" value={testPhone} onChange={setTestPhone} placeholder="5511988887777" />
        <label className="block mt-3">
          <span className="text-sm font-medium">Mensagem</span>
          <textarea value={testMsg} onChange={e => setTestMsg(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 min-h-24" />
        </label>
        <button onClick={sendTest} disabled={sending} className="mt-4 px-4 py-2.5 rounded-xl gradient-revy text-white font-medium flex items-center gap-2 disabled:opacity-50">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Enviar teste
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block mt-3">
      <span className="text-sm font-medium">{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200" />
    </label>
  );
}

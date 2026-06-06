'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', phone: '', address: '' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/business', { method: 'POST', body: JSON.stringify(form) });
    setLoading(false);
    if (res.ok) {
      toast.success('Negócio criado! Vamos ao dashboard.');
      router.push('/dashboard');
      router.refresh();
    } else {
      toast.error('Erro ao criar negócio');
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <span className="w-14 h-14 rounded-2xl gradient-revy grid place-items-center text-white mx-auto">
          <Sparkles className="w-7 h-7" />
        </span>
        <h1 className="font-display text-3xl font-bold mt-4">Vamos configurar seu negócio</h1>
        <p className="text-slate-500 mt-2">Em menos de 1 minuto você está vendendo mais.</p>
      </div>

      <form onSubmit={submit} className="card p-6 space-y-4">
        <Field label="Nome do negócio *" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Ex.: Pizzaria do João" required />
        <Field label="Categoria" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="Ex.: Restaurante, Clínica, Salão" />
        <Field label="Telefone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="(11) 99999-9999" />
        <Field label="Endereço" value={form.address} onChange={v => setForm({ ...form, address: v })} placeholder="Rua, número, cidade" />
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl gradient-revy text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Criar negócio e continuar
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-revy focus:ring-2 focus:ring-revy/20 outline-none" />
    </label>
  );
}

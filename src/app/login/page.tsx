'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Bem-vindo de volta!');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex gradient-revy text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-2 font-display text-2xl">
          <Sparkles className="w-7 h-7 text-revy-gold" /> Revy
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Transforme avaliações em <span className="text-revy-gold">crescimento</span>.
          </h1>
          <p className="mt-4 text-white/80 max-w-md">
            Gerencie reviews do Google, responda com IA e capture feedback via WhatsApp — tudo num só lugar.
          </p>
        </motion.div>
        <div className="text-white/60 text-sm">© 2026 Revy · Reavy Avaliações</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md card p-8 space-y-5"
        >
          <div>
            <h2 className="font-display text-2xl font-bold">Entrar na sua conta</h2>
            <p className="text-sm text-slate-500 mt-1">Bem-vindo de volta ao Revy.</p>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="input pl-10" placeholder="voce@empresa.com" />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Senha</span>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="input pl-10" placeholder="••••••••" />
            </div>
          </label>

          <button disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
          </button>

          <p className="text-sm text-slate-500 text-center">
            Não tem conta?{' '}
            <Link href="/register" className="text-revy font-medium hover:underline">Criar grátis</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

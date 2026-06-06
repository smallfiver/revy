import { createClient } from '@/lib/supabase-server';
import { Sparkles } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: businesses } = await supabase.from('businesses').select('id, name, google_connected').limit(1);
  const biz = businesses?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Bem-vindo de volta 👋</h1>
        <p className="text-sm text-slate-500 mt-1">
          {biz ? `Gerenciando: ${biz.name}` : 'Termine seu onboarding para começar.'}
        </p>
      </div>

      <div className="card p-10 grid place-items-center text-center">
        <span className="w-12 h-12 rounded-2xl gradient-revy grid place-items-center text-white">
          <Sparkles className="w-6 h-6" />
        </span>
        <h2 className="font-display text-xl font-bold mt-4">Etapa 1 concluída ✅</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Setup, auth, schema (RLS), middleware e layout base prontos. As métricas, gráficos
          e listas de avaliações serão entregues na Etapa 2.
        </p>
      </div>
    </div>
  );
}

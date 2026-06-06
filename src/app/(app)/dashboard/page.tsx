import { getCurrentBusiness } from '@/lib/getBusiness';
import { redirect } from 'next/navigation';
import { Star, MessageCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { business, supabase } = await getCurrentBusiness();
  if (!business) redirect('/onboarding');

  const { data: reviews } = await supabase!.from('reviews').select('rating, status, created_at').eq('business_id', business.id);
  const { count: feedbackCount } = await supabase!.from('feedback').select('id', { count: 'exact', head: true }).eq('business_id', business.id);
  const { count: campaignCount } = await supabase!.from('campaigns').select('id', { count: 'exact', head: true }).eq('business_id', business.id);

  const total = reviews?.length || 0;
  const avg = total ? (reviews!.reduce((s, r) => s + r.rating, 0) / total) : 0;
  const pending = reviews?.filter(r => r.status === 'pending').length || 0;
  const dist = [1, 2, 3, 4, 5].map(n => ({ n, c: reviews?.filter(r => r.rating === n).length || 0 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Bem-vindo de volta 👋</h1>
        <p className="text-sm text-slate-500 mt-1">Gerenciando: <strong>{business.name}</strong></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric icon={<Star className="w-5 h-5" />} label="Avaliação média" value={avg ? avg.toFixed(1).replace('.', ',') : '—'} sub={`${total} avaliações`} />
        <Metric icon={<MessageCircle className="w-5 h-5" />} label="Pendentes" value={String(pending)} sub="Aguardando resposta" />
        <Metric icon={<TrendingUp className="w-5 h-5" />} label="Campanhas" value={String(campaignCount || 0)} sub="Total criadas" />
        <Metric icon={<AlertTriangle className="w-5 h-5" />} label="Feedbacks" value={String(feedbackCount || 0)} sub="Recebidos" />
      </div>

      <div className="card p-6">
        <h3 className="font-display text-lg font-bold mb-4">Distribuição de notas</h3>
        <div className="space-y-2">
          {dist.reverse().map(({ n, c }) => (
            <div key={n} className="flex items-center gap-3">
              <div className="w-10 text-sm font-medium">{n} ★</div>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full gradient-revy" style={{ width: total ? `${(c / total) * 100}%` : '0%' }} />
              </div>
              <div className="w-10 text-right text-sm text-slate-500">{c}</div>
            </div>
          ))}
        </div>
      </div>

      {!business.google_connected && (
        <div className="card p-6 border-2 border-amber-200 bg-amber-50">
          <h3 className="font-display text-lg font-bold text-amber-900">Próximo passo: conecte seu Google Meu Negócio</h3>
          <p className="text-sm text-amber-800 mt-1">Acesse <a href="/settings" className="underline font-medium">Configurações</a> para vincular sua conta e começar a sincronizar avaliações.</p>
        </div>
      )}
    </div>
  );
}

function Metric({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <span className="w-8 h-8 rounded-lg bg-revy/10 text-revy grid place-items-center">{icon}</span>
        {label}
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

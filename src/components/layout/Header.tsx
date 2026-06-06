import { createClient } from '@/lib/supabase-server';

export async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('users').select('name, email').eq('id', user?.id ?? '').maybeSingle();
  const display = profile?.name || user?.email || '—';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="text-sm text-slate-500">Painel de controle</div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-slate-800">{display}</div>
          <div className="text-xs text-slate-500">{profile?.email}</div>
        </div>
        <div className="w-9 h-9 rounded-full gradient-revy grid place-items-center text-white font-semibold">
          {display.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

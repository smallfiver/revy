'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, LayoutDashboard, Star, MessageCircle, Megaphone,
  HeartHandshake, Settings, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/reviews', label: 'Avaliações', icon: Star },
  { href: '/whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { href: '/campaigns', label: 'Campanhas', icon: Megaphone },
  { href: '/feedback', label: 'Feedback', icon: HeartHandshake },
  { href: '/settings', label: 'Configurações', icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2 font-display text-xl font-bold">
        <span className="w-9 h-9 rounded-xl gradient-revy grid place-items-center text-white">
          <Sparkles className="w-5 h-5" />
        </span>
        Revy
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition',
                active ? 'bg-revy/10 text-revy' : 'text-slate-600 hover:bg-slate-50'
              )}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout}
        className="m-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
        <LogOut className="w-4 h-4" /> Sair
      </button>
    </aside>
  );
}

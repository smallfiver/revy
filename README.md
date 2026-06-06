# Revy — Reavy Avaliações

SaaS de gestão de avaliações Google + automação de feedback WhatsApp.

## Stack
- Next.js 14 (App Router) · TypeScript · Tailwind
- Supabase (Postgres + Auth + RLS) via `@supabase/ssr`
- Framer Motion · Recharts · Lucide · Sonner
- OpenAI (GPT-4o-mini) · Google Business Profile · Z-API

## Setup

```bash
cd "Reavy Avaliações/revy"
npm install
npm run dev
```

A pasta `.env.local` já vem com URL + anon key do Supabase real (projeto `kkvbmunqvjmbqoekyimn`).
Substitua os `REPLACE_*` por chaves reais antes de usar OpenAI / Google / Z-API.

## Status das etapas

- [x] **Etapa 1** — Setup, auth, schema (8 tabelas + RLS + triggers), middleware, login/register, layout base
- [ ] Etapa 2 — Dashboard (métricas + gráficos)
- [ ] Etapa 3 — /reviews (filtros + drawer + API)
- [ ] Etapa 4 — Google OAuth + sync
- [ ] Etapa 5 — IA replies (OpenAI)
- [ ] Etapa 6 — WhatsApp Z-API
- [ ] Etapa 7 — Campanhas + CSV
- [ ] Etapa 8 — Cron jobs
- [ ] Etapa 9 — Feedback interno
- [ ] Etapa 10 — Onboarding + Settings + Deploy

## Banco de dados

Tabelas: `users`, `businesses`, `customers`, `reviews`, `feedback`, `campaigns`,
`campaign_messages`, `settings`. RLS habilitada em todas; isolamento por `auth.uid()`.
Triggers: `handle_new_user` (cria perfil no signup), `handle_new_business` (cria `settings` default).

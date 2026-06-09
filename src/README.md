# TrendSpain 🌎

Negocios que triunfan en EE.UU. y aún no han llegado a España.

## Archivos del proyecto

```
trendspain/
├── index.html          ← Página principal
├── package.json        ← Configuración del proyecto
├── vite.config.js      ← Configuración de Vite
├── .env.example        ← Ejemplo de variables de entorno
└── src/
    ├── main.jsx        ← Punto de entrada
    ├── App.jsx         ← App principal con auth y freemium
    ├── data.js         ← Base de datos de oportunidades
    └── supabase.js     ← Conexión con Supabase
```

## Variables de entorno necesarias en Vercel

- `VITE_SUPABASE_URL` → URL de tu proyecto en Supabase
- `VITE_SUPABASE_ANON_KEY` → Clave pública de Supabase

## Tabla SQL necesaria en Supabase

Ejecuta esto en el SQL Editor de Supabase:

```sql
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  status text not null default 'active',
  created_at timestamp with time zone default now()
);

alter table subscriptions enable row level security;

create policy "Users can view own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);
```

# ComparaRemesas / CompareRemit

🚀 **Compara tasas y comisiones de remesas a LATAM en segundos**

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

- ✅ **Comparador de 8+ servicios** - Wise, Remitly, Xoom, Western Union, MoneyGram, DolarApp, Sendwave, Pangea
- ✅ **Calculadora normal e inversa** - "Quiero enviar $X" o "Necesitan recibir X MXN"
- ✅ **8 países LATAM** - México, Guatemala, Colombia, El Salvador, Rep. Dominicana, Perú, Honduras, Ecuador
- ✅ **Multiidioma** - Español e Inglés
- ✅ **4 temas visuales** - Oscuro, Claro, Medianoche, Naturaleza
- ✅ **Sistema de cashback** - Gana hasta 25% de las comisiones
- ✅ **Alertas de tipo de cambio** - Te avisamos cuando la tasa te conviene
- ✅ **Grupos familiares** - Coordina envíos con tu familia

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/compara-remesas.git
cd compara-remesas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api).

## 🗄️ Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/`
3. Enable Email Auth in Authentication settings
4. Add your URL to the allowed redirect URLs

### Database Schema

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  preferred_language text default 'es',
  preferred_theme text default 'dark',
  origin_country text default 'US',
  created_at timestamptz default now()
);

-- Transactions history
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  amount decimal not null,
  destination_country text not null,
  service_used text not null,
  fee decimal not null,
  exchange_rate decimal not null,
  amount_received decimal not null,
  created_at timestamptz default now()
);

-- Rate alerts
create table public.alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  currency text not null,
  target_rate decimal not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- Feedback
create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete set null,
  category text not null,
  rating int not null,
  message text,
  created_at timestamptz default now()
);
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

## 📱 Mobile App

For React Native mobile app, see `/mobile` directory (coming soon).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Exchange rate data from [ExchangeRate-API](https://exchangerate-api.com)
- Icons from [Lucide](https://lucide.dev)
- UI inspiration from modern fintech apps

---

Made with ❤️ for the LATAM remittance community

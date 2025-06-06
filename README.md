# Supabase + Next.js Authentication Flow

Un progetto completo che implementa un flusso di autenticazione usando **Supabase** e **Next.js 15** con **App Router**.

## 🚀 Caratteristiche

- ✅ **Next.js 15** con App Router e TypeScript
- ✅ **Supabase Authentication** con SSR support  
- ✅ **Shadcn/ui** per i componenti UI
- ✅ **Tailwind CSS** per lo styling
- ✅ Pagine di **Login** e **Registrazione**
- ✅ **Dashboard privata** protetta da autenticazione
- ✅ **Middleware** per la protezione delle route
- ✅ Gestione completa delle **sessioni**

## 📋 Prerequisiti

- Node.js 18+ 
- pnpm (raccomandato)
- Account Supabase

## 🛠️ Installazione

1. **Clona il progetto** (se non l'hai già fatto):
```bash
cd supabase-next
```

2. **Installa le dipendenze**:
```bash
pnpm install
```

3. **Configura Supabase**:
   - Vai su [supabase.com](https://supabase.com) e crea un nuovo progetto
   - Nella dashboard del progetto, vai su **Settings** > **API**
   - Copia l'URL del progetto e la chiave anonima

4. **Configura le variabili d'ambiente**:
   - Modifica il file `.env.local` inserendo i tuoi dati Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Avvia il server di sviluppo**:
```bash
pnpm dev
```

6. **Apri il browser** su [http://localhost:3000](http://localhost:3000)

## 📱 Utilizzo

### 1. Homepage (`/`)
- Pagina di benvenuto con link per login, registrazione e dashboard
- Design responsive e moderno

### 2. Registrazione (`/register`)  
- Form per creare un nuovo account
- Validazione email e password
- Conferma password richiesta
- Email di verifica automatica

### 3. Login (`/login`)
- Form per accedere con email e password
- Gestione errori di autenticazione
- Redirect automatico alla dashboard dopo il login

### 4. Dashboard (`/dashboard`)
- **Pagina privata** accessibile solo agli utenti autenticati
- Mostra informazioni dell'utente loggato
- Pulsante di logout
- Protezione automatica tramite middleware

## 🔧 Struttura del Progetto

```
src/
├── app/
│   ├── dashboard/          # Pagina privata
│   │   ├── page.tsx        # Dashboard principale
│   │   └── logout-button.tsx # Componente logout
│   ├── login/              # Pagina di login
│   │   └── page.tsx
│   ├── register/           # Pagina di registrazione  
│   │   └── page.tsx
│   ├── globals.css         # Stili globali
│   ├── layout.tsx          # Layout principale
│   └── page.tsx            # Homepage
├── components/
│   └── ui/                 # Componenti shadcn/ui
├── lib/
│   ├── supabase/           # Configurazione Supabase
│   │   ├── client.ts       # Client-side
│   │   └── server.ts       # Server-side
│   └── utils.ts            # Utility functions
└── middleware.ts           # Middleware per auth
```

## 🔐 Sicurezza

- **Middleware automatico**: Protegge le route private
- **SSR Authentication**: Verifica server-side delle sessioni  
- **Cookie sicuri**: Gestione automatica dei token
- **Validazione lato client e server**

## 🎨 Personalizzazione

### Aggiungere nuovi componenti Shadcn/ui:
```bash
pnpm dlx shadcn@latest add [component-name]
```

### Modificare i colori del tema:
Modifica le variabili CSS in `src/app/globals.css`

## 🚀 Deploy

Il progetto è pronto per il deploy su **Vercel**, **Netlify** o altre piattaforme che supportano Next.js.

Assicurati di:
1. Configurare le variabili d'ambiente sulla piattaforma di deploy
2. Aggiungere il dominio di produzione nelle impostazioni di Supabase

## 📚 Risorse

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)  
- [Shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Contributi

Sentiti libero di aprire issue o pull request per migliorare il progetto!

---

**Buon sviluppo! 🎉**

# Odoo Next.js Template

Un template moderno e completo per costruire applicazioni web con **Next.js 15**, **Autenticazione Odoo**, e **TypeScript**. Include autenticazione, dashboard, e una bella UI costruita con Tailwind CSS e shadcn/ui.

## ✨ Caratteristiche

- ⚡ **Next.js 15** con App Router e Server Components
- 🔐 **Autenticazione Odoo** tramite XML-RPC
- 📊 **Dashboard** con route protette e dati partner completi
- 🎨 **UI Moderna** con Tailwind CSS e shadcn/ui
- 🔧 **TypeScript** per type safety
- 📱 **Design Responsivo** 
- 🛡️ **Protezione Middleware** per route autenticate
- 🎯 **Registrazione & Login** automatico
- ⚙️ **Verifica Signup** dinamica background
- 🌐 **Sessioni JWT** sicure compatibili Edge Runtime

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+ 
- pnpm (consigliato) o npm
- Un'istanza Odoo accessibile
- **Modulo Custom** `create_user_api` installato su Odoo (per registrazione)

### 1. Clone e Installa

```bash
git clone https://github.com/crottolo/odoo-next-template.git
cd odoo-next-template
pnpm install
```

### 2. Setup Odoo

1. Assicurati che la tua istanza Odoo sia accessibile
2. Installa il modulo custom `create_user_api` per la registrazione
3. Configura whitelist IP nel modulo (opzionale)

### 3. Variabili Ambiente

Crea un file `.env.local` nella directory root:

```env
ODOO_URL=http://localhost:8069
ODOO_DATABASE=your_db_name
JWT_SECRET=your-super-secret-jwt-key-here
```

### 4. Avvia il Server di Sviluppo

```bash
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000) per vedere la tua applicazione.

## 📁 Struttura Progetto

```
src/
├── app/
│   ├── api/auth/           # API routes autenticazione
│   │   ├── login/         # Endpoint login Odoo
│   │   ├── logout/        # Endpoint logout
│   │   ├── me/            # Dati utente corrente
│   │   ├── register/      # Registrazione nuovo utente
│   │   ├── signup-check/  # Verifica disponibilità signup
│   │   └── check-user/    # Verifica utente esistente
│   ├── dashboard/         # Dashboard protetta con dati partner
│   ├── login/            # Pagina login
│   ├── register/         # Pagina registrazione
│   ├── setup/            # Flow setup account
│   ├── layout.tsx        # Layout root
│   └── page.tsx          # Home page
├── components/
│   └── ui/               # Componenti shadcn/ui
├── lib/
│   ├── odoo/            # Client e sessioni Odoo
│   │   ├── client.ts    # Connessione XML-RPC dinamica
│   │   └── session.ts   # Gestione JWT sessioni
│   └── hooks/           # Hook React personalizzati
│       └── useSignupAvailability.ts  # Verifica signup background
├── middleware.ts         # Protezione route con JWT
└── .env.example         # Template variabili ambiente
```

## 🔐 Flusso Autenticazione

1. **Login**: Credenziali Odoo → JWT → Dashboard
2. **Registrazione**: Form → Modulo custom Odoo → Auto-login
3. **Route Protette**: Middleware JWT verifica automatica
4. **Dati Partner**: res.users + res.partner combinati
5. **Verifica Signup**: Background check ogni 5 minuti
6. **Sessioni**: JWT sicuri HttpOnly cookies

## 🛠️ Architettura Tecnica

### Connessione Odoo
- **XML-RPC**: Autenticazione diretta tramite `odoo-xmlrpc-ts`
- **Dinamica**: URL/Database configurabili via ambiente
- **Sessioni**: JWT con `jose` (Edge Runtime compatible)

### Registrazione Custom
- **Modulo Odoo**: `/api/create_user` senza CSRF
- **Whitelist IP**: Sicurezza configurabile
- **Utenti Portal**: Solo registrazioni esterne
- **Auto-login**: Dopo registrazione diretta a dashboard

### UI Condizionale
- **Signup Check**: Verifica automatica `/web/login` per presenza link signup
- **Loading States**: Overlay durante processi
- **Error Handling**: Gestione robusta errori e timeout

## 📦 Tecnologie Utilizzate

- [Next.js 15](https://nextjs.org/) - Framework React
- [odoo-xmlrpc-ts](https://www.npmjs.com/package/odoo-xmlrpc-ts) - Client XML-RPC per Odoo
- [jose](https://github.com/panva/jose) - JWT Edge Runtime compatible
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Componenti UI
- [Lucide React](https://lucide.dev/) - Icons

## ⚙️ Configurazione Odoo Richiesta

### Modulo `create_user_api`

Il progetto richiede un modulo custom Odoo con endpoint:
```python
@http.route('/api/create_user', type='json', auth='none', methods=['POST'], csrf=False)
def create_user_api(self, **kwargs):
    # Logica creazione utente
    # Whitelist IP (opzionale)
    # Solo utenti PORTAL
    pass
```

### Permessi Minimi
- Lettura `res.users` e `res.partner`
- Scrittura `res.users` (per registrazione)
- Accesso XML-RPC abilitato

## 🚀 Deploy

### Variabili Produzione
```env
ODOO_URL=https://your-odoo-instance.com
ODOO_DATABASE=production_db
JWT_SECRET=your-production-secret-256-bit
NODE_ENV=production
```

### Build di Produzione
```bash
pnpm build  # Genera build ottimizzata
pnpm start  # Avvia server produzione
```

### Middleware Edge Runtime
Il middleware è compatibile con Edge Runtime per performance massime.

## 🔧 Sviluppo

### Aggiungere Componenti UI
```bash
pnpm dlx shadcn@latest add component-name
```

### Estendere API Odoo
Modifica `src/lib/odoo/client.ts` per aggiungere nuovi metodi XML-RPC.

### Testing
```bash
pnpm lint    # ESLint check
pnpm build   # Verifica build produzione
```

## 🐛 Troubleshooting

### Errori Comuni
- **CSRF Failed**: Assicurati che il modulo `create_user_api` abbia `csrf=False`
- **Cookie Too Big**: Rimosso campo `image_1920` per evitare JWT grandi
- **Edge Runtime**: Usa `jose` invece di `jsonwebtoken`

### Debug
API include logging per troubleshooting login/registrazione.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend platform
- [Vercel](https://vercel.com/) for Next.js and hosting
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components

---

**Ready to build something amazing?** 🚀

Start by cloning this template and customizing it for your needs!

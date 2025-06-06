# Supabase Next.js Template

A modern, full-stack template for building web applications with **Next.js 15**, **Supabase**, and **TypeScript**. Features authentication, dashboard, and a beautiful UI built with Tailwind CSS and shadcn/ui components.

## ✨ Features

- ⚡ **Next.js 15** with App Router and Server Components
- 🔐 **Supabase Authentication** (Email/Password, OAuth providers)
- 📊 **Dashboard** with protected routes
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui
- 🔧 **TypeScript** for type safety
- 📱 **Responsive Design** 
- 🛡️ **Middleware Protection** for authenticated routes
- 🎯 **User Registration & Login** flows
- ⚙️ **Account Setup** pages
- 🌙 **Dark Mode Support** (via shadcn/ui)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- A Supabase account

### 1. Clone and Install

```bash
git clone https://github.com/crottolo/supabase-next-template.git
cd supabase-next-template
pnpm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** 
3. Copy your **Project URL** and **anon public key**

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up Database (Optional)

If you need custom tables, go to your Supabase dashboard and create them via the SQL editor or Table editor.

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/          # Protected dashboard pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── setup/             # Account setup flow
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   └── supabase/          # Supabase client configuration
└── middleware.ts          # Route protection middleware
```

## 🔐 Authentication Flow

1. **Registration**: Users can sign up with email/password
2. **Login**: Existing users can log in
3. **Protected Routes**: Dashboard and setup pages require authentication
4. **Middleware**: Automatic redirection for unauthenticated users
5. **Session Management**: Persistent login state across page refreshes

## 🛠️ Customization

### Adding New UI Components

This template uses [shadcn/ui](https://ui.shadcn.com/). Add new components:

```bash
pnpm dlx shadcn@latest add button
```

### Supabase Configuration

The Supabase client is configured in `src/lib/supabase/`. You can extend it with:

- Custom queries
- Real-time subscriptions  
- File storage
- Edge functions

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Defined in `globals.css` for theme customization
- **Dark Mode**: Automatic support via shadcn/ui theme provider

## 📦 Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide React](https://lucide.dev/) - Icons

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This template works with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key | ✅ |

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

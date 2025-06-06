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
├── middleware.ts          # Route protection middleware
└── nixpacks.toml          # Coolify/Nixpacks configuration
```

## ⚙️ Environment Variables Template

The `.env.example` file provides a template with all necessary environment variables:

- **Clear Documentation**: Each variable has instructions on where to find the values
- **Supabase Integration**: Step-by-step guide to get Supabase credentials  
- **Production Ready**: All variables optimized for production deployment
- **Coolify Magic Variables**: Predefined variables that Coolify generates automatically

### 🔄 Using Shared Variables (Advanced)

For teams managing multiple projects, Coolify's Shared Variables feature allows you to:

1. **Team Level** - Set variables once, use across all projects:
   ```bash
   # In Coolify: Team Settings
   SUPABASE_URL = https://company-project.supabase.co
   
   # In applications, use:
   NEXT_PUBLIC_SUPABASE_URL = {{team.SUPABASE_URL}}
   ```

2. **Project Level** - Share variables within a project:
   ```bash
   # In Coolify: Project Settings  
   DATABASE_URL = {{team.SUPABASE_URL}}
   
   # In applications, use:
   NEXT_PUBLIC_SUPABASE_URL = {{project.DATABASE_URL}}
   ```

3. **Environment Level** - Different values per environment:
   ```bash
   # In Coolify: Environment Settings
   # Production: DOMAIN = https://myapp.com
   # Staging: DOMAIN = https://staging.myapp.com
   
   NEXTAUTH_URL = {{environment.DOMAIN}}
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

## 🚀 Deploy with Coolify

### Quick Deploy Guide

1. **Setup Coolify** (if you haven't already):
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```

2. **Create New Application** in Coolify Dashboard:
   - Click **"+ New Resource"** → **"Application"**
   - Choose **"Public Repository"** or **"GitHub App"** (for private repos)
   - Paste repository URL: `https://github.com/crottolo/supabase-next-template`

3. **Configure Build Settings**:
   - **Build Pack**: Nixpacks (auto-detected)
   - **Base Directory**: `/` (root)
   - **Port**: `3000`
   - **Branch**: `main`

4. **Environment Variables** (Copy-Paste Ready!):
   
   Open the **Environment Variables** tab and paste:
   
   ```bash
   # For projects with Shared Variables (recommended)
   NEXT_PUBLIC_SUPABASE_URL={{project.NEXT_PUBLIC_SUPABASE_URL}}
   NEXT_PUBLIC_SUPABASE_ANON_KEY={{project.NEXT_PUBLIC_SUPABASE_ANON_KEY}}
   NODE_ENV={{project.NODE_ENV}}
   PORT=3000
   NEXT_TELEMETRY_DISABLED=1
   ```
   
   **Alternative** (direct values):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NODE_ENV=production
   PORT=3000
   NEXT_TELEMETRY_DISABLED=1
   ```

5. **Deploy**: Click **"Deploy"** and your app will be live in minutes! 🎉

### 🔄 Using Shared Variables (Pro Tip)

For teams or multiple projects, set up **Shared Variables** once:

1. **Project Level**: Go to Project Settings → Variables
2. **Add these variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
   - `NODE_ENV`
3. **Reference with**: `{{project.VARIABLE_NAME}}`

Now every new app in this project uses the same configuration automatically!

### 🌐 Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy **Project URL** and **anon public key**

### ✨ Why Coolify?

- **Self-hosted**: Full control of your infrastructure
- **Cost-effective**: No vendor lock-in, use your own VPS
- **Easy scaling**: Add more servers as you grow
- **Privacy**: Your data stays on your servers
- **Open source**: Transparent and community-driven

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

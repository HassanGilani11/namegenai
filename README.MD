# AI Product Name Generator & Brand Toolkit

A high-performance AI SaaS for rapid brand creation. Generate catchy product names, brand scores, and marketing copy powered by OpenAI GPT-4 and Google Gemini.

---

## 🚀 Key Features

- **Product Name Generator**: Instant creative naming suggestions based on your keywords.
- **Brand Score Engine**: AI-driven analysis of your brand's potential.
- **Content Suitcase**: Automated generation of product descriptions and ad copy.
- **Domain Suggestions**: Integrated check for domain availability.
- **Subscription Model**: Tier-based pricing (Free vs. PRO) with credit top-ups.
- **Admin Command Center**: Complete platform overview, usage tracking, and user management.
- **Stripe Integration**: Secure payments with automated credit fulfillment.
- **Responsive Dashboard**: Beautifully designed UI for history, billing, and settings.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Prisma 7](https://www.prisma.io/) (with Driver Adapters)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payments**: [Stripe](https://stripe.com/)
- **AI Models**: [OpenAI Models](https://openai.com/) & [Google Gemini Models](https://deepmind.google/technologies/gemini/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
# Database
DATABASE_URL="your-neon-pooled-url"
DIRECT_URL="your-neon-direct-url"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"

# Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AI Services
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="AIzaSy..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📦 Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Initialization**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Stripe Webhook Listener (Local Development)**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Launch Dev Server**
   ```bash
   npm run dev
   ```

---

## 🔧 Recent Improvements

- **Prisma 7 Compliance**: Upgraded to the latest Prisma architecture for better database stability.
- **Fulfillment Engine**: Fixed Stripe webhook logic for real-time credit provisioning and plan upgrades.
- **Dynamic Dashboard**: Responsive "Recent Generations" section that stays in sync with history.
- **Admin Panel**: Brand new command center for managing users and revenue.

---

## 📂 Project Structure

- `/src/app`: Next.js pages and API routes.
- `/src/components`: Reusable UI components.
- `/src/lib`: Singletons for Prisma, Stripe, and AI services.
- `/prisma`: Schema definition and configuration.
- `/scripts`: Diagnostic tools and maintenance scripts.

---

## 🚀 Deployment

Recommended deployment on [Vercel](https://vercel.com/) with [Neon](https://neon.tech/) for the database. Ensure Stripe webhooks are set up in the production dashboard.

<div align="center">
  <br />
  <!-- Ganti URL logo dengan logo proyekmu -->
  <img src="https://via.placeholder.com/150?text=Stack+Sinau" alt="Stack Sinau Logo" width="150" />
  <h1>📚 Stack Sinau E-Learning</h1>
  <p>
    A Modern, Gamified E-Learning Platform built with Next.js 16, Supabase, and AI Integration.
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  </p>
</div>

---

## 🌟 Overview

**Stack Sinau** is a comprehensive, interactive e-learning platform designed to enhance the learning experience through gamification, role-based access, and intelligent features. Built with a modern Neo-Brutalism design aesthetic, it ensures a highly responsive and engaging user interface across all devices.

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Dedicated dashboards and workflows for **Super Admins**, **Lecturers (Dosen)**, and **Students**.
- **Secure Authentication:** Powered by Supabase Auth with support for OAuth and credentials.
- **Gamification & Leaderboard:** Engage students with points, achievements, and real-time leaderboards.
- **AI-Powered Insights:** Integrated with Google Gemini AI for smart assistance and content generation.
- **Rich Analytics:** Interactive data visualization using Recharts.
- **Modern UI/UX:** Built with Tailwind CSS v4 and `shadcn/ui` for a premium, accessible, and responsive experience.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Supabase SSR](https://supabase.com/)
- **AI Integration:** Google Gemini AI (`@google/genai`)
- **Charts:** [Recharts](https://recharts.org/)

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/e-learning.git
   cd e-learning
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database (Prisma / Supabase PostgreSQL)
   DATABASE_URL="your-postgresql-connection-string"
   DIRECT_URL="your-postgresql-direct-connection-string"

   # Supabase Keys
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

   # Gemini AI API Key
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Database Setup:**
   Generate the Prisma Client and push the schema to your database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Folder Structure

```text
├── src/
│   ├── app/           # Next.js App Router (Pages, Layouts, API routes)
│   ├── components/    # Reusable UI components (shadcn, custom)
│   ├── lib/           # Utility functions, Prisma client, Supabase config
│   └── ...
├── prisma/            # Database schema and migrations
├── public/            # Static assets
└── package.json       # Project dependencies
```

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the platform, feel free to fork the repository, create a new branch, and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <i>Developed with ❤️ for a better learning ecosystem.</i>
</div>

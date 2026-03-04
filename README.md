# 📺 Next.js Full Stack YouTube Clone

A dark-mode, fully-responsive YouTube clone built with Next.js App Router, Clerk Authentication, and PostgreSQL. It fetches live, real-time videos directly from the Google YouTube Data API v3 and supports an infinite-scroll, dynamic video feed.

## 🚀 Key Features

*   **Live YouTube Data API**: Fetches real videos, thumbnails, views, and duration globally, populated sequentially via Cursor-based Infinite Pagination.
*   **Search Engine**: Robust live query searching to look up specific video topics across YouTube.
*   **User Authentication**: Powered by [Clerk](https://clerk.com), offering a highly secure Google or Email login experience, with `<UserButton>` widgets to update avatars natively.
*   **Real-time Comments**: A PostgreSQL database attached to Prisma ORM allows logged-in users to type and persist live comments underneath video watch pages.
*   **Database Subscribing**: A completely optimized PostgreSQL `Subscription` table allowing users to permanently save and track their external Creator Subscriptions.
*   **Dynamic Channel Profiles**: Clicking on a creator's name on a video opens their dedicated Creator URL fetching their specific uploads.
*   **Modern UI Shell**: Emulates the true YouTube layout using a dynamic collapsible Context hook Sidebar, Category Chips, and fluid Grid systems natively styled with Tailwind CSS v4.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Auth**: Clerk Next.js
- **Database**: PostgreSQL (Docker)
- **ORM**: Prisma Client v5.22
- **External API**: Google YouTube Data API v3

---

## 💻 Local Setup Instructions

Follow these steps to run the exact codebase smoothly on your own machine.

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd youtube-clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize your Variables
Create a file strictly named `.env.local` inside the root folder, and add your Clerk credentials and YouTube API Key:
*(Do not upload this to GitHub!)*
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_google_cloud_api_key_here

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Create a standard `.env` file to securely string your Database network connection:
```env
# Point this to whatever Postgres Host you plan on running!
DATABASE_URL="postgresql://postgres:password@localhost:5432/youtube"
```

### 4. Provide the Database (Docker)
If you do not have a Postgres connection, you can spin one up instantly on your local PC using Docker:
```bash
docker run --name youtube-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=youtube -p 5432:5432 -d postgres
```

### 5. Push Schema & Generate ORM
Once your database is online, push the structural Prisma layout to it:
```bash
npx prisma generate
npx prisma db push
```

### 6. Start the Server
Launch the Next.js Development compiler:
```bash
npm run dev
```

Browse the platform live at **[http://localhost:3000](http://localhost:3000)**! When deploying to Vercel, swap out your `.env` variables for production endpoints!

---

## 📁 Repository Architecture & Workflows

*   `src/app/page.tsx` - The main homepage serving the initial video payloads and triggering intersection observers.
*   `src/app/api/...` - Next.js REST API implementations handling YouTube URL parameters, Postgres Prisma lookups, and security checking.
*   `src/components/...` - Client-side UI islands managing navigation (`Sidebar.tsx`), layouts (`ClientLayout.tsx`), and the large embedded engine (`VideoPlayer.tsx`).
*   `prisma/schema.prisma` - The strict Schema structure indicating how the `User`, `Comment`, and `Subscription` keys mathematically interlock in SQL.



# Full Stack  AI-Powered Social Media Platform

[🌐 Live Demo](https://nexa-nine-phi.vercel.app/) | [💻 GitHub Repo](https://github.com/tsujit74/Nexa)

---
## 🖼️ Screenshot

![Dashboard Screenshot](/frontend/public/dashboard.png)

---

## 🎯 Objective

Build a **full stack platform** that helps users:

* Generate content using an AI chatbot.
* Schedule posts via a calendar interface.
* Automatically publish posts to social media (currently **Twitter & LinkedIn**, text-only).

This platform makes it easier for businesses or individuals to **plan, create, and post content consistently**.

---

## 🛠️ Features Implemented

### 1. **Social Media Integration**

* Securely connect **Twitter & LinkedIn** accounts using OAuth.
* Automate posting **text content**.
* **Instagram** integration is planned (API limitations, posting images/videos not implemented yet).

### 2. **AI Chatbot for Content Creation**

* Chatbot collects **business info** from the user.
* Generates **personalized text posts** dynamically for scheduling.
* Supports both **dynamic** (interactive) and **static** (simple) post types.

### 3. **Content Calendar & Scheduling**

* **Calendar view** to display all scheduled posts.
* Posts can be **scheduled** for the future or posted **immediately**.
* Users can **edit or delete** posts before publishing.

### 4. **Posting Automation**

* Scheduled posts are automatically sent to **Twitter & LinkedIn**.
* Immediate posts are created in DB first, then published.
* Post status updated as `pending → posted → failed`.

### 5. **Tech Stack**

* **Backend:** Node.js + Express, MongoDB (Mongoose)
* **Frontend:** Next.js + React + Tailwind CSS
* **Scheduling:** `node-cron` (runs every minute to check posts)
* **AI Content:** Local chatbot simulation (OpenAI can be integrated)
* **Hosting:** Vercel (frontend), MongoDB Atlas (database)

---

## 📂 Folder Structure

### Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── [...catchAll]/
│   │   │   └── page.tsx
│   │   ├── auth/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── auth/page.tsx
│   │   ├── dashboard/
│   │   │   ├── AllPostList.tsx
│   │   │   ├── Chatbot.tsx
│   │   │   ├── CreatePostForm.tsx
│   │   │   ├── DashboardNotFound.tsx
│   │   │   ├── FloatingChatbot.tsx
│   │   │   ├── PostSchedulerDashboard.tsx
│   │   │   ├── SocialAccount.tsx
│   │   │   ├── AuthGuard.tsx
│   │   │   └── PostStatusNav.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── PostContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── usePosts.ts
│   │   └── useSocialAccount.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   ├── posts.ts
│   │   └── social.ts
```

### Backend

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── postController.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   └── Post.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── postRoutes.ts
│   │
│   ├── middleware/
│   │   └── authMiddleware.ts
│   │
│   ├── utils/
│   │   ├── platformTwitter.ts
│   │   ├── platformLinkedIn.ts
│   │
│   ├── config/
│   │   └── db.ts
│   │
│   ├── server.ts
│   └── types.d.ts
```

---

## ⚙️ Environment Variables

Create a `.env.local` (frontend) and `.env` (backend):

```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Backend
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

SESSION_SECRET=mysecretkey

BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000

# Twitter OAuth
TWITTER_API_KEY=<key>
TWITTER_API_SECRET=<secret>
TWITTER_ACCESS_TOKEN=<token>
TWITTER_ACCESS_SECRET=<secret>
TWITTER_CALLBACK_URL=<callback_uri>

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=<client_id>
LINKEDIN_CLIENT_SECRET=<client_secret>
LINKEDIN_REDIRECT_URI=<redirect_uri>
LINKEDIN_CALLBACK_URL=<callback_uri>
```

👉 Instagram env vars not required (not integrated yet).

---

## 🚀 Setup & Running Locally

Good point 🚀 — every professional README should include a **Git Clone & Setup section** at the top so anyone can run it locally.

Here’s how you can add it to your README (just before **Setup & Running Locally**):

````md
## 📥 Clone the Repository

First, clone the repo and navigate into it:

```bash
git clone https://github.com/tsujit74/Nexa
````

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

* Backend: `http://localhost:4000`
* Frontend: `http://localhost:3000`

---

## ⚡ Quick Start Guide

1. **Signup/Login** → create a new account.
2. **Connect Accounts** → link Twitter & LinkedIn via OAuth.
3. **Chatbot** → enter details → generate suggested post text.
4. **Create Post** → choose platform & schedule date/time.
5. **Dashboard** → view/edit posts on calendar.
6. **Posting**:

   * Immediate → posts instantly.
   * Scheduled → posted automatically at correct time by `node-cron`.

---

## ⚠️ Notes

* Posts are **text-only** for now.
* Instagram support pending (API restrictions).
* Scheduler runs **every minute** (optimized for demo; can use queues for scale).
* Post lifecycle: `pending` → `posted` → `failed`.

---

## 📌 Next Steps / TODO

* [ ] Add **Instagram posting** (images & videos).
* [ ] Support **AI-generated images/videos**.
* [ ] Add **post analytics** (likes, impressions).
* [ ] Use **job queues** for large-scale scheduling.

---

## ✅ Deliverables

* [x] Full stack working application
* [x] Twitter & LinkedIn integration
* [x] AI chatbot (text-only)
* [x] Content calendar & scheduling
* [x] Immediate post support
* [x] Documentation & README

---

## 👨‍💻 Developer Info

**Sujit Thakur**
📌 Full Stack Developer | Fresher
🌐 Portfolio: [sujit-porttfolio.vercel.app](https://sujit-porttfolio.vercel.app/)
💻 GitHub: [github.com/tsujit74](https://github.com/tsujit74)
✉️ Email: [tsujeet440@gmail.com](mailto:tsujeet440@gmail.com)
📞 Phone: +91 7479713290

---


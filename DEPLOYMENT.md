# Free-Tier Deployment Guide: Explore India Web App

This guide explains how to deploy **Explore India** to free cloud hosting platforms (**Vercel**, **Render**, **Railway**, **Glitch**) to obtain a live public `https://...` URL.

---

## Option 1: Deploy on Vercel (Fastest Serverless Deployment)

[Vercel](https://vercel.com) provides instant serverless deployment directly from GitHub.

### Steps to Deploy on Vercel:

1. **Push repository to GitHub**:
   Make sure `vercel.json` is committed and pushed to your GitHub repository ([YashikaChandra06/UpStartInterns](https://github.com/YashikaChandra06/UpStartInterns.git)).

2. **Import Project into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and log in with GitHub.
   - Select **Import** next to your repository: `YashikaChandra06/UpStartInterns`.

3. **Configure Environment Variables**:
   Add the following environment variable under **Environment Variables**:
   - `JWT_SECRET`: `super_secret_jwt_key_vercel_2026`

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically build the serverless functions and generate a public live URL like:
     `https://upstart-interns.vercel.app`

> [!NOTE]
> Vercel executes Node.js code inside ephemeral serverless functions. Data modified in local SQLite files (`destinations.db`) during a serverless execution will reset across cold starts. For persistent database files across server restarts, use **Render.com** (Option 2 below) or pair Vercel with a cloud database like **Turso SQLite** or **Vercel Postgres**.

---

## Option 2: Deploy on Render.com (Recommended for Persistent SQLite DB — 100% Free Tier)

[Render.com](https://render.com) runs Node.js as a continuous long-running server process, making it ideal for Node.js Express + SQLite database storage.

### Steps:

1. **Sign Up / Log In**:
   Log in at [render.com](https://render.com) using your GitHub account.

2. **Create New Web Service**:
   - Click **New +** $\rightarrow$ **Web Service**.
   - Select repository `YashikaChandra06/UpStartInterns`.

3. **Configure Settings**:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

4. **Set Environment Variables**:
   - `JWT_SECRET`: `super_secret_jwt_key_render_2026`
   - `PORT`: `3000`

5. **Deploy**:
   Click **Create Web Service**. Your app will be live at:
   `https://explore-india-app.onrender.com`

---

## Option 3: Deploy on Railway.app or Glitch.com

- **Railway.app**: Connect GitHub repo $\rightarrow$ Select Node.js $\rightarrow$ Railway auto-detects `package.json` and deploys instantly.
- **Glitch.com**: Import Git repository URL `https://github.com/YashikaChandra06/UpStartInterns.git` $\rightarrow$ Live URL provided instantly.

---

## Local Verification & Demo Account

To run and test locally before deploying:

```bash
npm start
```
Open `http://localhost:3000` and use the built-in demo account:
- **Email**: `demo@example.com`
- **Password**: `password123`

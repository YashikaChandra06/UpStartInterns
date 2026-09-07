# Cloud Deployment Guide: Explore India Web App

This guide explains how to deploy **Explore India** to free cloud hosting platforms to obtain a live public `https://...` URL.

---

## ⚡ Option 1: Vercel Deployment (Recommended)

The codebase is pre-configured with `vercel.json`, `api/index.js`, and `/tmp` SQLite fallback for instant zero-configuration deployment on **Vercel**.

### Deployment via Vercel Dashboard (GitHub)

1. **Push your code to GitHub**:
   Make sure all latest files (`vercel.json`, `api/index.js`, `db.js`, `server.js`) are committed and pushed to your GitHub repository ([YashikaChandra06/UpStartInterns](https://github.com/YashikaChandra06/UpStartInterns.git)).

2. **Import Project to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **Add New...** $\rightarrow$ **Project**.
   - Select your repository: `YashikaChandra06/UpStartInterns`.

3. **Configure Project Settings**:
   - **Framework Preset**: Other (or Node.js)
   - **Node.js Version**: Select **22.x** (Required for native `node:sqlite` support).
   - **Environment Variables**:
     - Key: `JWT_SECRET`
     - Value: `your_custom_secret_key_here` (or leave empty to use default fallback).

4. **Deploy**:
   - Click **Deploy**.
   - Vercel will build and deploy the app in under 60 seconds and provide a production URL (e.g. `https://up-start-interns.vercel.app`).

---

### Deployment via Vercel CLI

If you prefer deploying from your terminal using Vercel CLI:

1. Run the Vercel CLI command:
   ```bash
   npx vercel
   ```
2. Follow the prompts:
   - **Set up and deploy?**: `y`
   - **Which scope?**: Select your account
   - **Link to existing project?**: `n`
   - **Project name**: `explore-india`
   - **In which directory is your code located?**: `./`
3. Deploy to production:
   ```bash
   npx vercel --prod
   ```

---

## Option 2: Railway.app

1. **Push repository to GitHub**:
   Ensure your code is pushed to your GitHub repository ([YashikaChandra06/UpStartInterns](https://github.com/YashikaChandra06/UpStartInterns.git)).

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app) and log in with GitHub.
   - Click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
   - Select `YashikaChandra06/UpStartInterns`.
   - Railway will auto-detect `Dockerfile` / `package.json` and deploy.
   - Add environment variable `JWT_SECRET`.

---

## Option 3: Docker Container Deployment (Fly.io / Google Cloud Run)

The repository includes a production-ready `Dockerfile`:

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

---

## Local Development & Testing

To run and test locally:

```bash
npm start
```
Open `http://localhost:3000` and use the built-in demo account:
- **Email**: `demo@example.com`
- **Password**: `password123`

# Cloud Deployment Guide: Explore India Web App

This guide explains how to deploy **Explore India** to free cloud hosting platforms to obtain a live public `https://...` URL.

---

## Containerized / Free-Tier Deployment Options

### Option 1: Railway.app

1. **Push repository to GitHub**:
   Ensure your code is pushed to your GitHub repository ([YashikaChandra06/UpStartInterns](https://github.com/YashikaChandra06/UpStartInterns.git)).

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app) and log in with GitHub.
   - Click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
   - Select `YashikaChandra06/UpStartInterns`.
   - Railway will auto-detect `Dockerfile` / `package.json` and deploy.
   - Add environment variable `JWT_SECRET`.

---

### Option 2: Docker Container Deployment (Fly.io / Google Cloud Run)

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

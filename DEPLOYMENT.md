# Vercel Deployment Guide: Explore India Web App

This guide explains how to deploy **Explore India** to **Vercel** to obtain a live public `https://...` URL.

---

## Deploying on Vercel

[Vercel](https://vercel.com) provides instant serverless deployment directly from GitHub.

### Steps to Deploy:

1. **Push repository to GitHub**:
   Ensure `vercel.json` is committed and pushed to your GitHub repository ([YashikaChandra06/UpStartInterns](https://github.com/YashikaChandra06/UpStartInterns.git)).

2. **Import Project into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and log in with GitHub.
   - Select **Import** next to your repository: `YashikaChandra06/UpStartInterns`.

3. **Configure Environment Variables**:
   Under **Environment Variables**, add:
   - `JWT_SECRET`: `super_secret_jwt_key_vercel_2026`

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically build the serverless functions and generate a public live URL like:
     `https://upstart-interns.vercel.app`

---

## Local Development & Testing

To run and test locally:

```bash
npm start
```
Open `http://localhost:3000` and use the built-in demo account:
- **Email**: `demo@example.com`
- **Password**: `password123`

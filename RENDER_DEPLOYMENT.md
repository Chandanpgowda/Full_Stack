# 🚀 Deploying to Render — Step-by-Step Guide

This project is fully configured for deployment on [Render](https://render.com).

You have two options:
- **Option 1: Blueprint Deployment (Recommended, Automatic)**
- **Option 2: Manual Web Service + Static Site Deployment**

---

## 📦 Prerequisites: MongoDB Atlas Database (Free)

Before deploying to Render, your backend needs a live MongoDB connection string:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in / sign up (free).
2. Create a free shared cluster (**M0 Free**).
3. Under **Security → Database Access**, create a user (e.g., `ems_user`) with a password.
4. Under **Security → Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** → **Drivers** → Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/employee_management?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your actual credentials).*

---

## ⚡ Option 1: Blueprint Deployment (Fastest & Easiest)

We've already added `render.yaml` to your repository. Render will automatically detect and configure both services.

1. Log in to [Render](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Select your GitHub repository: `Chandanpgowda/Full_Stack`.
4. Render will parse `render.yaml` and show:
   - **`ems-backend`** (Web Service)
   - **`ems-frontend`** (Static Site)
5. Fill in the required environment variable for `ems-backend`:
   - `MONGODB_URI`: Paste your MongoDB Atlas connection string.
6. Click **Apply**.
7. Once `ems-backend` finishes deploying, note its URL (e.g. `https://ems-backend.onrender.com`).
8. Go to `ems-frontend` → **Environment** → Set:
   - `VITE_API_BASE_URL`: `https://ems-backend.onrender.com/api`
9. Trigger a manual deploy on `ems-frontend` (**Manual Deploy** → **Clear build cache & deploy**).
10. Open your `ems-frontend` URL — your app is live!

---

## 🛠️ Option 2: Manual Deployment Step-by-Step

If you prefer to configure each service manually in the Render dashboard:

### Step 1: Deploy Backend (Web Service)

1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your GitHub repository: `Chandanpgowda/Full_Stack`.
3. Configure the service:
   - **Name**: `ems-backend`
   - **Region**: Oregon (US West) or closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://...` (your Atlas URI) |
   | `CLIENT_ORIGIN` | `*` |
5. Click **Create Web Service**.
6. Wait for the build to finish. Once live, test it by opening `https://ems-backend.onrender.com/api/health` in your browser. It should return:
   ```json
   { "success": true, "message": "Server is running" }
   ```
   **Copy your backend URL** (e.g., `https://ems-backend.onrender.com`).

---

### Step 2: Deploy Frontend (Static Site)

Render Static Sites are **100% free with unlimited bandwidth and fast global CDN**.

1. In Render Dashboard, click **New +** → **Static Site**.
2. Connect the same repository: `Chandanpgowda/Full_Stack`.
3. Configure the static site:
   - **Name**: `ems-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://ems-backend.onrender.com/api` |
   *(Use your actual backend URL from Step 1 followed by `/api`)*
5. Under **Redirects / Rewrites**, add an SPA rewrite rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **Create Static Site**.
7. Wait 1-2 minutes for the Vite build to complete.
8. Click the generated URL (e.g., `https://ems-frontend.onrender.com`).

---

## 🔄 Optional: Update Backend CORS to Frontend URL

Once you know your frontend URL (e.g. `https://ems-frontend.onrender.com`), you can optionally tighten CORS:
1. Go to `ems-backend` → **Environment**.
2. Change `CLIENT_ORIGIN` to `https://ems-frontend.onrender.com`.
3. Save changes (Render will automatically redeploy).

---

## 💡 Render Free Tier Notes
- **Spin down on idle**: Render free web services spin down after 15 minutes of inactivity. The first request after idle can take ~30-50 seconds to wake up. This is normal on the free tier.
- **Frontend CDN**: The frontend Static Site stays instantaneous at all times via Render's global CDN.

# 🌐 How to Fully Configure Official Google Sign-In

This guide walks you through setting up an official **Google OAuth 2.0 Client ID** in Google Cloud Console so your users can click **"Google"** and sign in using real Google accounts.

---

## 📋 Step 1: Open Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. Click the **Project Dropdown** (top-left) → Click **New Project**.
4. Name your project (e.g., `EMS-Portal-Auth`) → Click **Create**.
5. Make sure your newly created project is selected in the top bar.

---

## 🛡️ Step 2: Configure OAuth Consent Screen

Before Google gives you a Client ID, you must define the consent screen:

1. In the left navigation menu, go to **APIs & Services** → **OAuth consent screen**.
2. Select User Type: **External** → Click **Create**.
3. Fill in the required App Information:
   - **App name**: `EMS Portal`
   - **User support email**: Choose your email address.
   - **Developer contact information**: Enter your email address.
4. Click **Save and Continue**.
5. **Scopes**: Click **Save and Continue** (default email and profile scopes are automatically included).
6. **Test users**:
   - Click **+ Add Users**.
   - Add your own Google email address (e.g. `chandan.gowda@gmail.com`).
   - Click **Save and Continue**.
7. Click **Back to Dashboard**.

---

## 🔑 Step 3: Create OAuth 2.0 Client ID

1. In the left navigation menu, click **Credentials**.
2. At the top, click **+ Create Credentials** → Choose **OAuth client ID**.
3. Select Application type: **Web application**.
4. **Name**: `EMS Web Client`.
5. Under **Authorized JavaScript origins**, click **+ Add URI** and add:
   - For local development:
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   - For production (your Render frontend URL):
     ```
     https://ems-frontend.onrender.com
     ```
6. Under **Authorized redirect URIs**, click **+ Add URI** and add:
   - For local development:
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   - For production:
     ```
     https://ems-frontend.onrender.com
     ```
7. Click **Create**.
8. A popup will show:
   - **Your Client ID** (looks like: `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`)
   - Copy this **Client ID**.

---

## ⚙️ Step 4: Add the Client ID to Your Application

### A. For Local Development:
1. Open or create `frontend/.env`:
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com
   ```
2. Restart your frontend server (`npm.cmd run dev` in `frontend`).

### B. For Render Production:
1. Open your [Render Dashboard](https://dashboard.render.com/).
2. Select your frontend static site: **`ems-frontend`**.
3. Go to the **Environment** tab.
4. Add a new variable:
   - **Key**: `VITE_GOOGLE_CLIENT_ID`
   - **Value**: `YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com`
5. Click **Save Changes** and trigger **Manual Deploy** → **Clear build cache & deploy**.

---

## 🚀 How it Works in Your Application

1. **Automatic Detection**: When `VITE_GOOGLE_CLIENT_ID` is present, the app automatically loads the Google Identity Services SDK (`https://accounts.google.com/gsi/client`).
2. **One-Tap Prompt**: When users open the page, Google's official one-tap prompt pops up in the top right.
3. **Google Button Click**: Clicking the **Google** button opens the Google account picker with official OAuth credential decoding.
4. **Instant Database Registration**: The Google account is verified, stored in your MongoDB database with `provider: google`, and a signed JWT session is created!

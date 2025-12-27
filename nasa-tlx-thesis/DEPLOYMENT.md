# NASA TLX - Deployment Guide

## Deployment Options

### Option 1: Firebase Hosting (Recommended - Free)

Since you're already using Firebase Realtime Database, Firebase Hosting is the easiest option.

#### Steps:

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase Hosting** (in your project directory):
```bash
cd "e:\Level 4 Term 2\CSE 400 Thesis\nasa-tlx-web\nasa-tlx-thesis"
firebase init hosting
```

When prompted:
- Select your existing Firebase project (nasa-tlx-thesis)
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No`
- Overwrite index.html: `No`

4. **Build your project**:
```bash
npm run build
```

5. **Deploy**:
```bash
firebase deploy --only hosting
```

Your app will be live at: `https://nasa-tlx-thesis.web.app` (or similar)

---

### Option 2: Vercel (Free, Very Fast)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Build and Deploy**:
```bash
cd "e:\Level 4 Term 2\CSE 400 Thesis\nasa-tlx-web\nasa-tlx-thesis"
npm run build
vercel
```

3. Follow prompts and your app will be deployed instantly.

---

### Option 3: Netlify (Free)

#### Via Netlify CLI:

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build project**:
```bash
npm run build
```

3. **Deploy**:
```bash
netlify deploy --prod
```

#### Via Drag & Drop (Easiest):

1. Build your project: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder to the upload area
4. Done! You'll get a live URL instantly

---

### Option 4: GitHub Pages (Free)

1. **Install gh-pages package**:
```bash
npm install --save-dev gh-pages
```

2. **Update package.json** - Add these scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/nasa-tlx"
}
```

3. **Update vite.config.js** - Add base path:
```javascript
export default defineConfig({
  base: '/nasa-tlx/',
  // ... rest of config
})
```

4. **Deploy**:
```bash
npm run deploy
```

---

## Pre-Deployment Checklist

### 1. Verify Firebase Configuration

Make sure `src/services/firebaseConfig.js` has correct production credentials:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "nasa-tlx-thesis.firebaseapp.com",
  databaseURL: "https://nasa-tlx-thesis-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nasa-tlx-thesis",
  storageBucket: "nasa-tlx-thesis.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Update Firebase Database Rules

Set appropriate security rules (currently open for testing):
```json
{
  "rules": {
    "participants": {
      ".read": true,
      ".write": true
    }
  }
}
```

**For production, consider:**
```json
{
  "rules": {
    "participants": {
      ".read": "auth != null || request.query.orderByChild == 'completed'",
      ".write": true,
      "$participantId": {
        ".validate": "newData.hasChildren(['id', 'info', 'completed'])"
      }
    }
  }
}
```

### 3. Test Build Locally

Before deploying, test the production build:
```bash
npm run build
npm run preview
```

Visit http://localhost:4173 to test the production build.

### 4. Environment Variables (Optional)

If you want to keep Firebase config secret:

1. Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_db_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `firebaseConfig.js`:
```javascript
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

3. Add `.env` to `.gitignore`

---

## Post-Deployment

1. **Test the live site**:
   - Complete a full participant flow
   - Test admin dashboard
   - Verify CSV/JSON export
   - Test on different devices

2. **Monitor Firebase Usage**:
   - Check Firebase Console for read/write operations
   - Monitor database size
   - Set up billing alerts if needed

3. **Share the URL**:
   - Admin Dashboard: `https://your-domain.com/dashboard`
   - Participant Entry: `https://your-domain.com/`

---

## Recommended: Firebase Hosting

For this project, **Firebase Hosting** is recommended because:
- Already using Firebase Database
- Free tier is generous (10 GB/month transfer)
- Fast global CDN
- HTTPS included
- Easy custom domain setup
- One-command deployment

### Quick Deploy Command:
```bash
npm run build && firebase deploy --only hosting
```

---

## Custom Domain (Optional)

All platforms support custom domains:

- **Firebase**: Firebase Console → Hosting → Add custom domain
- **Vercel/Netlify**: Dashboard → Domain settings
- **GitHub Pages**: Repository Settings → Pages → Custom domain

---

## Troubleshooting

### Build fails with "X is not defined"
- Check that all imports are correct
- Verify environment variables are set

### 404 on page refresh
- Make sure hosting is configured as SPA (single-page app)
- Check `firebase.json` or `netlify.toml` redirects

### Firebase connection errors
- Verify Firebase credentials are correct
- Check Firebase Database rules allow read/write
- Ensure Database URL is correct for your region

---

## Support

For deployment issues:
- Firebase: https://firebase.google.com/docs/hosting
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- GitHub Pages: https://pages.github.com

---

**Ready to deploy? Start with Firebase Hosting!**

```bash
cd "e:\Level 4 Term 2\CSE 400 Thesis\nasa-tlx-web\nasa-tlx-thesis"
npm run build
firebase init hosting
firebase deploy --only hosting
```

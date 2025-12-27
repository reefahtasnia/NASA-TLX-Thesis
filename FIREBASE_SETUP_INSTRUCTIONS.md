# Firebase Setup Instructions for NASA TLX Web App

This guide will walk you through setting up your own Firebase project and connecting it to the NASA TLX application.

---

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click **"Add project"** or **"Create a project"**
   - Enter a project name (e.g., "nasa-tlx-thesis")
   - Click **"Continue"**

3. **Configure Google Analytics (Optional)**
   - You can enable or disable Google Analytics for your project
   - Click **"Continue"** and then **"Create project"**
   - Wait for Firebase to create your project (takes ~30 seconds)

---

## Step 2: Enable Realtime Database

1. **Navigate to Realtime Database**
   - In the left sidebar, click on **"Realtime Database"**
   - Click **"Create Database"**

2. **Choose Database Location**
   - Select a location closest to your users (e.g., `us-central1`, `europe-west1`)
   - Click **"Next"**

3. **Set Security Rules**
   - For development/testing, choose **"Start in test mode"**
   - ⚠️ **Important**: We'll update these rules in Step 5 for production
   - Click **"Enable"**

---

## Step 3: Get Your Firebase Configuration

1. **Go to Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview" in the left sidebar
   - Select **"Project settings"**

2. **Find Your Web App Configuration**
   - Scroll down to the **"Your apps"** section
   - Click the web icon `</>` to add a web app (if you haven't already)
   - Enter an app nickname (e.g., "NASA TLX Web App")
   - Click **"Register app"**

3. **Copy Your Firebase Configuration**
   - You'll see a code snippet that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "https://your-project-default-rtdb.firebaseio.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456789"
   };
   ```
   - **Copy this entire configuration object**

---

## Step 4: Connect Firebase to Your Application

1. **Create the Firebase Config File**
   - Navigate to your project folder: `nasa-tlx-web/src/assets/`
   - Create a new file named: `firebaseConfig.js`

2. **Add Your Configuration**
   - Open `firebaseConfig.js` in a text editor
   - Paste the following code and replace with YOUR values:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY_HERE",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     databaseURL: "YOUR_DATABASE_URL_HERE",
     projectId: "YOUR_PROJECT_ID_HERE",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
     appId: "YOUR_APP_ID_HERE"
   };

   export default firebaseConfig;
   ```

   **Example:**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD3X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1",
     authDomain: "nasa-tlx-thesis.firebaseapp.com",
     databaseURL: "https://nasa-tlx-thesis-default-rtdb.firebaseio.com",
     projectId: "nasa-tlx-thesis",
     storageBucket: "nasa-tlx-thesis.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456789"
   };

   export default firebaseConfig;
   ```

3. **Save the File**
   - Save `firebaseConfig.js` in the `src/assets/` folder
   - ⚠️ **Important**: This file is gitignored (as it should be), so it won't be committed to version control

---

## Step 5: Update Firebase Security Rules

1. **Navigate to Realtime Database Rules**
   - In Firebase Console, go to **"Realtime Database"** in the left sidebar
   - Click on the **"Rules"** tab

2. **Update Rules for Your Application**
   - Since we removed authentication, update the rules to allow read/write access
   - **For Development/Testing**, use these rules:
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

   - **For Production** (more secure), you might want to restrict access:
   ```json
   {
     "rules": {
       "participants": {
         ".read": true,
         ".write": true,
         "$participantId": {
           ".validate": "newData.hasChildren(['completed', 'date', 'scale', 'workload'])"
         }
       }
     }
   }
   ```

3. **Publish the Rules**
   - Click **"Publish"** button

---

## Step 6: Verify Database Connection

1. **Start Your Application**
   - Open terminal in your project folder
   - Run: `yarn start` or `npm start`
   - The app should open in your browser (usually `http://localhost:8080`)

2. **Test the Connection**
   - Navigate to the app
   - Fill in an Experiment ID and Participant ID
   - Start a test TLX assessment
   - Complete at least one step (Rating Sheet)

3. **Check Firebase Console**
   - Go back to Firebase Console
   - Click on **"Realtime Database"** → **"Data"** tab
   - You should see data appearing under the `participants` path:
   ```
   participants/
     {expID}/
       {partID}/
         completed: false
         scale: { ... }
   ```

---

## Step 7: Database Structure Reference

Your data will be stored in the following structure:

```
participants/
  {experimentID}/
    {participantID}/
      completed: boolean
      date: string (when completed)
      scale:
        Mental Demand: number (0-100)
        Physical Demand: number (0-100)
        Temporal Demand: number (0-100)
        Performance: number (0-100)
        Effort: number (0-100)
        Frustration Level: number (0-100)
      workload:
        Mental Demand: number (0-5)
        Physical Demand: number (0-5)
        Temporal Demand: number (0-5)
        Performance: number (0-5)
        Effort: number (0-5)
        Frustration Level: number (0-5)
      adjustedRating: { ... } (calculated)
      weightedRating: number (calculated)
```

---

## Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"
- **Solution**: Double-check that you copied the correct `apiKey` in `firebaseConfig.js`

### Issue: "Permission denied" when writing to database
- **Solution**: Check your Firebase Realtime Database rules in Step 5

### Issue: Database URL not working
- **Solution**: Make sure your `databaseURL` in `firebaseConfig.js` matches the URL shown in Firebase Console (Realtime Database → Data tab)

### Issue: App not connecting to Firebase
- **Solution**: 
  1. Check browser console for errors (F12 → Console tab)
  2. Verify `firebaseConfig.js` exists in `src/assets/`
  3. Verify all configuration values are correct
  4. Make sure you've run `yarn install` or `npm install` after cloning

### Issue: Cannot find module '../assets/firebaseConfig'
- **Solution**: Create the `firebaseConfig.js` file in `src/assets/` folder (see Step 4)

---

## Next Steps

Once your Firebase is connected and working:

1. ✅ Test creating a participant and completing the TLX assessment
2. ✅ Check that data appears in Firebase Console
3. ✅ Test the Dashboard to view your data
4. ✅ Test CSV export functionality

After Phase 1 is working, we'll proceed with:
- Phase 2: Add Participant Information Form
- Phase 3: Update data structure
- Phase 4: Create Admin Dashboard with time tracking

---

## Additional Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Realtime Database Guide**: https://firebase.google.com/docs/database/web/start
- **Firebase Console**: https://console.firebase.google.com/

---

## Quick Reference: File Locations

- **Firebase Config File**: `src/assets/firebaseConfig.js` (you need to create this)
- **Firebase Setup Code**: `src/components/firebase.js` (already modified)
- **Database Rules**: `database.rules.json` (in project root)

---

**Need Help?** Check the browser console (F12) for any error messages when testing your connection.


# NASA TLX Web Application

A modern web-based implementation of the NASA Task Load Index (NASA-TLX) assessment tool for measuring perceived workload. This version removes authentication requirements and focuses on participant data collection and analysis.

## Features

- **No Authentication Required** - Simple participant ID-based system
- **Participant Information Collection** - Email, age, major, gaming experience
- **Complete NASA-TLX Assessment** - All 6 dimensions with exact calculation logic
- **15 Pairwise Comparisons** - Standard NASA-TLX weighted rating methodology
- **Results Visualization** - Bar charts and data tables for adjusted ratings
- **Admin Dashboard** - View all participants, edit time taken, export data
- **CSV/JSON Export** - Download complete participant data
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Firebase Realtime Database** - Data storage
- **React Router v6** - Client-side routing
- **Bootstrap 5 + Reactstrap** - Responsive UI components
- **Recharts** - Data visualization
- **Moment.js** - Date formatting
- **UUID** - Participant ID generation

## Project Structure

```
src/
├── pages/               # Main application pages
│   ├── Home.jsx         # Landing page with participant ID entry
│   ├── ParticipantInfo.jsx  # Collect participant demographics
│   ├── AboutTLX.jsx     # NASA-TLX introduction
│   ├── Definitions.jsx  # Define the 6 workload dimensions
│   ├── RatingSheet.jsx  # Rate each dimension (0-100 scale)
│   ├── CompareCards.jsx # 15 pairwise comparisons
│   ├── End.jsx          # Assessment completion message
│   ├── Results.jsx      # Individual participant results with charts
│   └── Dashboard.jsx    # Admin view of all participants
├── components/          # Reusable UI components
│   ├── Menubar.jsx
│   ├── Loading.jsx
│   ├── Chart.jsx
│   └── DataCard.jsx
├── services/            # External service integrations
│   └── firebase.js      # Firebase CRUD operations
├── lib/                 # Core calculation logic
│   └── tlxCalculator.js # NASA-TLX weighted rating calculation
└── App.jsx              # Router configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

Create a `src/services/firebaseConfig.js` file with your Firebase credentials:

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Firebase Database Rules

Set your Firebase Realtime Database rules to allow read/write:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173/` (or next available port).

### 5. Build for Production

```bash
npm run build
```

## Usage

### For Participants

1. Navigate to the home page
2. Enter or generate a participant ID
3. Fill out demographic information
4. Read NASA-TLX instructions
5. Review dimension definitions
6. Rate each dimension on 0-100 scale (two batches)
7. Complete 15 pairwise comparisons
8. View your results

### For Admins

1. Navigate to `/dashboard` route
2. View all completed assessments
3. Click pencil icon to edit time taken for each participant
4. Click "View Details" to see individual results
5. Export all data as CSV or JSON

## NASA-TLX Calculation

The weighted TLX score is calculated as:

1. **Raw Ratings**: Each dimension rated 0-100 (Performance inverted: 100 - value)
2. **Pairwise Comparisons**: 15 comparisons determine workload weights
3. **Adjusted Ratings**: Raw rating × Workload tally for each dimension
4. **Weighted Rating**: Sum of adjusted ratings ÷ 15

## Data Structure

```javascript
{
  participantId: {
    id: "abc123",
    info: {
      email: "user@example.com",
      age: 25,
      major: "Computer Science",
      gamingExperience: "Intermediate"
    },
    scale: [MD, PD, TD, P, E, F],  // Raw ratings
    workload: [MD, PD, TD, P, E, F],  // Tally counts
    adjustedRating: [...],  // scale × workload
    weightedRating: 45.67,  // Final score
    timeTakenSeconds: 240,
    date: "2025-12-28",
    completed: true
  }
}
```

## Key Features Details

### Progress Persistence
- RatingSheet and CompareCards save progress to localStorage
- Prevents data loss on accidental navigation/refresh

### Responsive Design
- Fluid containers with Bootstrap breakpoints
- Mobile-friendly slider controls
- Adaptive card layouts

### Admin Dashboard
- Real-time data sync from Firebase
- Inline time editing with validation
- One-click CSV/JSON export
- Visual score comparison chart

## License

MIT License - See LICENSE file for details

## Credits

Based on the NASA Task Load Index developed by NASA Ames Research Center. This is a modernized implementation for research and educational purposes.

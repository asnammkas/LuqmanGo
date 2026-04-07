# LuqmanGo - Premium Curated Shopping

LuqmanGo is a modern, high-performance e-commerce platform curated for premium shopping experiences. Built with React, Vite, and Firebase, the storefront features a glassmorphic design, robust global state management, and real-time backend synchronization.

![LuqmanGo Project Architecture](https://via.placeholder.com/1200x600.png?text=LuqmanGo+Architecture)

## 🏗️ Architecture

- **Frontend Framework**: React 19 + Vite 7 for rapid hot-module reloading and bundle splitting.
- **Styling**: Vanilla CSS utilizing CSS Variables (`index.css`), tailored media queries for responsiveness, and dynamic glassmorphism utilities.
- **Backend & Database**: Firebase Firestore (NoSQL, real-time sync for Catalog and Orders).
- **Authentication**: Firebase Auth (Email/Password).
- **Serverless Compute**: Firebase Gen 2 Cloud Functions (`functions/index.js`) handle critical business logic like Order Validation and Payment intent verification.
- **State Management**: Distributed React Context API (`ProductContext`, `AuthContext`, `CartContext`, etc.) to prevent prop drilling.

## 🚀 Quick Start / Local Setup

### 1. Prerequisites
- **Node.js** (v22+ recommended)
- **NPM** or **Yarn**
- **Firebase CLI** installed globally (`npm install -g firebase-tools`)

### 2. Environment Variables
Copy `.env.example` to `.env` in the root of the project.
```bash
cp .env.example .env
```
Ensure you fill in your Firebase configuration keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies
Install packages for both the storefront and the cloud functions.
```bash
# Install frontend
npm install

# Install backend functions
cd functions
npm install
cd ..
```

### 4. Running the Development Servers
You will need two terminal windows to run both the Vite frontend and the Firebase emulators simultaneously.

**Terminal 1 (Vite Storefront):**
```bash
npm run dev
```

**Terminal 2 (Firebase Local Emulator):**
```bash
npm run serve --prefix functions
# OR
firebase emulators:start --only functions
```

Your storefront will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
├── .github/workflows/       # CI/CD Github Actions Configurations
├── functions/               # Firebase Cloud Functions (Node.js)
│   └── index.js             # API Endpoints & Order Handlers
├── src/
│   ├── components/          # Reusable UI elements (Navbar, Modals, Cards)
│   ├── context/             # Global State Providers (Auth, Cart, Theme)
│   ├── pages/               # Route-level views (Home, Profile, Admin)
│   ├── App.jsx              # Core React Router logic
│   └── index.css            # Global design tokens and utilities
├── firebase.json            # Emulator & Firebase Deployment Config
├── firestore.rules          # Database security bindings
└── vitest.config.js         # Testing framework configuration
```

## 🛠️ Development Workflow
- **Features**: Develop new features on isolated branches.
- **Testing**: Pre-commit hooks via Husky will ensure your code conforms to standard ESLint configurations. 
- **Icons**: We use [Lucide React](https://lucide.dev/) for all abstract SVGs.
- **Accessibility (a11y)**: All custom modals and overlays utilize `aria-modal` and semantic `<button>` architectures.

## 🚀 Deployment

The project is configured to easily deploy directly from Github.

### Storefront (Vercel)
1. Link your Github repository to a new Vercel Project.
2. In the Vercel Dashboard, map your `.env` variables.
3. Vercel will automatically build (`npm run build`) and deploy the `dist/` directory on pushes to the `Production` branch.

### Backend (Firebase Functions & Rules)
Deploy your security rules and active Cloud Functions via the CLI:
```bash
firebase deploy --only functions,firestore:rules,storage
```

---
*© 2026 Luqman Express. Maintained by Asnam.*

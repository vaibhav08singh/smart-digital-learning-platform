# CodeZen — Setup & Local Development Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Git**: Installed and configured

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/codezen.git
cd codezen
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration credentials:
```env
EXECUTE_API_URL=https://emkc.org/api/v2/piston
EXECUTE_API_KEY=your_optional_api_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

AI_API_KEY=your_ai_provider_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### 4. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` (or `http://localhost:3002` if port 3000 is occupied) in your browser.

---

## 🛠️ Verification Commands

```bash
# Run ESLint check
npm run lint

# Run TypeScript type check
npx tsc --noEmit

# Build production bundle
npm run build
```

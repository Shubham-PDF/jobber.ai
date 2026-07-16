# jobber.ai — Minimal Modern Job Matching Platform

jobber.ai is a premium, minimal web platform designed for students and job seekers to match resumes with active job listings across major boards (Indeed, SimplyHired, and DailyRemote) using AI scoring.

---

## Tech Stack

- **Frontend**: React (v19) + Vite + TypeScript + Tailwind CSS (v4) + Framer Motion
- **Authentication**: Clerk React SDK
- **Backend**: Django (v5) + Django REST Framework + PostgreSQL / SQLite
- **AI Processing**: OpenAI API (for resume parsing and job compatibility scoring)

---

## Features

1. **Resume Date Extraction**: Automatically extracts technical skills and calculates precise work experience years using date utility mathematics.
2. **Dynamic Search Crawler**: Queries platforms sequentially based on selected targets, capped at the top 3 best matching keywords to maximize credit efficiency.
3. **Compatibility Match Score**: Scores and reasons every scanned job (1-10 rating scale) without filtering out lower scores.
4. **Export to Sheets**: Downloader utility supporting authenticated Excel (`.xlsx`) and CSV exports.
5. **Credits Ledger System**: Flexible credit pricing structures (Indeed: 3 Cr, SimplyHired: 2 Cr, DailyRemote: 1 Cr) with UPI payment verification claims.

---

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables inside `.env`:
   ```env
   OPENAI_API_KEY=your-api-key
   FIRECRAWL_API_KEY=your-firecrawl-key
   CLERK_JWKS_URL=your-clerk-jwks-url
   ```
5. Apply migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables inside `.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

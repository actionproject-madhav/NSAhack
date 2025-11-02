# FinLit - Financial Literacy Platform

A comprehensive financial literacy and stock trading education platform for international students.

## Features

- Google OAuth Authentication
- Receipt Scanner with OCR
- Stock Market Education
- Portfolio Management
- Real-time Stock Data
- AI-Powered Investment Recommendations

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB (optional, for receipt storage)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Google OAuth credentials to `.env`:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

5. Start the backend server:
```bash
./start.sh
```

Or manually:
```bash
python3 scanner.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (if needed):
```bash
# Optional - the app has fallback values
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set **Authorized JavaScript origins**:
   - `http://localhost:5000`
   - `http://localhost:5173`
   - `http://localhost:5174`
   - `https://finlit-uyv5.onrender.com`

6. Set **Authorized redirect URIs**:
   - `http://localhost:5000/auth/google/callback`
   - `http://localhost:5173`
   - `http://localhost:5174`
   - `https://finlit-uyv5.onrender.com`
   - `https://finlit-uyv5.onrender.com/auth/google/callback`

7. Copy the Client ID and Client Secret
8. Add them to both:
   - Backend `.env` file
   - Frontend `.env` file (optional, has fallback)

## Configure Your Google Client ID

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Add your Client ID to the `.env` files
3. Make sure to configure the correct redirect URIs in Google Console

## Troubleshooting

### Google Auth Not Working

**Problem**: Clicking "Sign in with Google" doesn't do anything or stays on the same page.

**Solution**: Make sure the backend server is running!

```bash
# Check if backend is running
lsof -i :5000

# If not running, start it
cd backend
./start.sh
```

### CORS Errors

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174`
- `http://localhost:3000`
- Production domain

If you're running on a different port, update the CORS configuration in `backend/scanner.py`.

### Database Connection Issues

The app works without MongoDB, but some features (receipt storage, user data) require it.

To connect MongoDB:
1. Add `MONGO_URI` to your `.env` file
2. Restart the backend server

## Architecture

```
NSAhack/
├── backend/           # Flask API server
│   ├── auth.py       # Google OAuth handlers
│   ├── scanner.py    # Main API + Receipt OCR
│   ├── database.py   # MongoDB connection
│   └── start.sh      # Startup script
│
├── frontend/         # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/    # Route pages
│   │   ├── components/ # Reusable components
│   │   ├── services/ # API clients
│   │   └── context/  # State management
│   └── public/       # Static assets
│
└── README.md
```

## Tech Stack

### Backend
- Flask
- Google OAuth 2.0
- OpenCV (OCR)
- PyTesseract
- MongoDB

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Lucide Icons

## License

MIT

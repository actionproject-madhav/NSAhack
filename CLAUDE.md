# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack financial literacy application with receipt scanning capabilities. The app helps users track spending and learn about investing through receipt analysis and portfolio management.

**Architecture:**
- Frontend: React + TypeScript + Vite + TailwindCSS
- Backend: Flask (Python) with MongoDB
- Key Features: Receipt OCR scanning, investment recommendations, educational content

## Development Commands

### Frontend (React/Vite)
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend (Flask)
```bash
cd backend
pip install -r requirements.txt  # Install dependencies
python scanner.py                # Start Flask server (port 5000)
python debug.py                  # Debug/test script
```

## Code Architecture

### Frontend Structure
- **Pages**: Main application routes in `src/pages/`
  - `LandingPage.tsx`: Marketing page
  - `AuthPage.tsx`: Authentication
  - `OnboardingFlow.tsx`: User setup wizard
  - `Dashboard.tsx`: Main app interface
  - `PortfolioPage.tsx`: Investment portfolio
  - `TradePage.tsx`: Trading interface
  - `WalletPage.tsx`: Wallet management
  - `EducationHub.tsx`: Financial education content

- **Components**: Reusable UI components in `src/components/`
  - `ReceiptScanner.tsx`: OCR receipt processing
  - `StockChart.tsx`, `PerformanceChart.tsx`: Data visualization
  - `ChatWidget.tsx`, `AIChatSidebar.tsx`: AI chat features
  - Various portfolio and trading components

- **Context**: Global state management
  - `UserContext.tsx`: User authentication and portfolio state

- **Services**: External API integrations
  - `alphaVantageApi.ts`: Stock market data
  - `geminiService.ts`: AI-powered features

### Backend Structure
- **scanner.py**: Main Flask application with receipt OCR processing
- **database.py**: MongoDB operations and data models
- **Popular Companies**: Hardcoded company database with stock tickers for receipt recognition

### Key Technologies
- **OCR**: OpenCV + Tesseract for receipt text extraction
- **UI**: Radix UI components + Framer Motion animations
- **Charts**: Recharts for data visualization
- **Styling**: TailwindCSS with custom utilities
- **State**: React Context for user management

## Database Schema (MongoDB)

**Receipt Collection:**
- `user_id`: User identifier
- `company_name`: Detected company name
- `total_amount`: Parsed receipt total
- `confidence`: OCR confidence level (high/medium/low)
- `extracted_text`: Raw OCR text
- `scan_date`: Timestamp
- `metadata`: Processing metadata including ticker symbols

## Receipt Processing Flow

1. Image uploaded via `ReceiptScanner.tsx`
2. Backend processes with OpenCV + Tesseract OCR
3. Company detection against popular companies database
4. Amount extraction using regex patterns
5. Results stored in MongoDB with confidence scoring
6. Frontend displays results with investment recommendations

## API Endpoints

**Authentication:**
- `GET /auth/google`: Initiate Google OAuth flow
- `GET /auth/google/callback`: Handle Google OAuth callback
- `POST /auth/verify-token`: Verify Google ID token from frontend
- `POST /auth/logout`: User logout
- `GET /auth/me`: Get current authenticated user
- `GET /api/config`: Get public configuration (Google Client ID)

**Receipt Processing:**
- `POST /api/scan-receipt`: Process receipt image
- `GET /api/dashboard/receipts/<user_id>`: Get user's receipts
- `GET /api/dashboard/stats/<user_id>`: Get spending statistics  
- `GET /api/dashboard/companies/<user_id>`: Company spending breakdown
- `GET /api/dashboard/monthly/<user_id>`: Monthly spending trends
- `DELETE /api/receipts/<receipt_id>`: Delete receipt
- `PUT /api/receipts/<receipt_id>`: Update receipt

## Development Notes

- Frontend runs on Vite dev server (typically port 5173)
- Backend Flask server runs on port 5000
- MongoDB connection configured via environment variables
- Google OAuth integration with secure token verification
- Popular companies list includes stock tickers for investment correlation
- OCR processing includes multiple pass strategies for better accuracy
- OCR functionality is optional - server runs without opencv/pillow packages

## Authentication Flow

1. User clicks Google Sign-In on `/auth` page
2. Google Sign-In JavaScript library handles authentication
3. Google ID token is sent to backend `/auth/verify-token`
4. Backend verifies token with Google and saves/updates user in MongoDB
5. User session is created and frontend redirects to `/onboarding`
6. User context is updated with Google profile information

## Google OAuth Setup

To fix the "origin_mismatch" error, add these origins in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: `speedy-solstice-469903-p7`
3. Go to APIs & Services → Credentials
4. Click on your OAuth 2.0 Client ID
5. Add these to **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - `http://localhost:5174`
   - `http://localhost:3000`
6. Add these to **Authorized redirect URIs**:
   - `http://localhost:5000/auth/google/callback`
   - `http://localhost:5173`
   - `http://localhost:5174`
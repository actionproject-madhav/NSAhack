# FinLit - Financial Literacy for International Students

A full-stack financial literacy application that helps international students understand the US financial system through receipt scanning and investment education.

##  Project Overview

FinLit bridges the gap between everyday spending and investment understanding by transforming receipt scanning into financial education. International students can scan receipts from familiar companies (Starbucks, Target, Apple) and learn about these companies as investment opportunities. It provides tailored financial investment advice to immigrants keeping in mind their country of origin, immigration status and personal situations.

## What makes our app Unique?
-**Tailored for immigrants and international students**
-**Alerts and warnings for immigrants based on their status and restrictions, like day-trading**
-**LLM integration with the context window wrapped on each page**
-**Smart computer vision model for receipt detection**
-**Smart live NLP analysis on market trends**

### Key Features
- **Smart Receipt OCR**: Advanced image processing to extract company names and amounts
- **Investment Discovery**: Links everyday purchases to stock market opportunities
- **Portfolio Simulation**: Risk-free investment tracking and learning
- **Educational Hub**: Curated financial literacy content for international students
- **Spending Analytics**: Visual dashboards showing spending patterns and trends

### Target Audience
International students in the US who need practical financial literacy education that connects to their daily experiences.

##  Setup and Run Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MongoDB (local installation or Atlas cloud)
- Google Cloud Console project for OAuth

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NSAhack
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**
   
   Create `backend/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/
   DATABASE_NAME=finlit_app
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
   FLASK_SECRET_KEY=your_secret_key
   ```

5. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized origins: `http://localhost:5173`, `http://localhost:5000`
   - Add redirect URIs: `http://localhost:5000/auth/google/callback`

### Running the Application

**Development Mode (Recommended):**
```bash
# Terminal 1 - Start Backend
cd backend
python scanner.py

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
python scanner.py  # Production mode via environment variables
```

##  Dependencies and Tools Used

### Frontend Stack
- **React 18** - Component framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling framework
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Radix UI** - Accessible component primitives

### Backend Stack
- **Flask** - Web framework
- **Python 3.8+** - Runtime
- **MongoDB** - Database (local or Atlas)
- **Google OAuth 2.0** - Authentication
- **OpenCV + Tesseract** - OCR processing (optional)
- **Flask-CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Frontend code linting
- **TypeScript compiler** - Type checking
- **MongoDB Compass** - Database management
- **Postman/Thunder Client** - API testing

### External APIs
- **Alpha Vantage** - Stock market data
- **Google Gemini** - AI-powered features
- **Google Sign-In** - Authentication

##  Team Members


- **Arman Amatya**
- **Madhav Khanal**
- **Koshish Shrestha**


##  Architecture Overview

### Data Flow
1. User authenticates via Google OAuth
2. Receipt images uploaded through React frontend
3. Flask backend processes with OCR (OpenCV + Tesseract)
4. Company matching against popular companies database
5. Results stored in MongoDB with investment correlations
6. Dashboard displays spending analytics and investment opportunities

### Key Components
- **Receipt Scanner**: Multi-pass OCR with image enhancement
- **Company Detection**: Fuzzy matching against 18+ popular companies
- **Investment Bridge**: Connects spending to stock market education
- **Portfolio Simulation**: Risk-free learning environment

##  Development Notes

### OCR Dependencies
OCR functionality requires additional packages but is optional:
```bash
pip install opencv-python Pillow pytesseract numpy
```

### Database Setup
The app works with both local MongoDB and MongoDB Atlas. Use `backend/test_atlas.py` to verify Atlas connections.

### Authentication
Google OAuth integration requires proper domain configuration in Google Cloud Console for both development and production environments.

---

*Built for NSA Hackathon - Financial Literacy for International Students*

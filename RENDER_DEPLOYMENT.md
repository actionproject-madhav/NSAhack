# Render Deployment Configuration Guide

This document lists all required environment variables for deploying the frontend and backend separately on Render.

## Backend Environment Variables (finlit-backend)

Set these in Render Dashboard → Your Backend Service → Environment:

### Required Variables:

1. **MONGO_URI**
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Used in: `backend/database.py`

2. **DATABASE_NAME**
   - Value: Your MongoDB database name
   - Example: `receipt_scanner` or `finlit_db`
   - Used in: `backend/database.py`

3. **FRONTEND_URL**
   - Value: Your frontend Render URL
   - Example: `https://finlit-nsa.onrender.com`
   - Used in: `backend/app.py` (CORS), `backend/auth.py` (redirects)
   - **IMPORTANT**: Must match your actual frontend URL

4. **GOOGLE_CLIENT_ID**
   - Value: Your Google OAuth Client ID
   - Get from: [Google Cloud Console](https://console.cloud.google.com/)
   - Used in: `backend/auth.py`

5. **GOOGLE_CLIENT_SECRET**
   - Value: Your Google OAuth Client Secret
   - Get from: [Google Cloud Console](https://console.cloud.google.com/)
   - Used in: `backend/auth.py`

6. **GOOGLE_REDIRECT_URI**
   - Value: Your backend URL + `/auth/google/callback`
   - Example: `https://finlit-backend.onrender.com/auth/google/callback`
   - **IMPORTANT**: Must be added to Google OAuth authorized redirect URIs
   - Used in: `backend/auth.py`

7. **FLASK_SECRET_KEY**
   - Value: A random secret key for Flask sessions
   - Generate: `python -c "import secrets; print(secrets.token_hex(32))"`
   - Used in: `backend/app.py`

8. **GEMINI_API_KEY**
   - Value: Your Google Gemini API key
   - Get from: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Used in: `backend/ai_hub.py`

9. **FINNHUB_API_KEY**
   - Value: Your Finnhub API key
   - Get from: [Finnhub.io](https://finnhub.io/)
   - Used in: `backend/finhub_service.py`

### Optional Variables:

10. **FLASK_ENV**
    - Value: `production` (for production) or `development`
    - Default: `development`

11. **FLASK_DEBUG**
    - Value: `False` (for production) or `True`
    - Default: `False`

---

## Frontend Environment Variables (finlit-nsa)

Set these in Render Dashboard → Your Frontend Service → Environment:

### Required Variables:

1. **VITE_API_BASE_URL**
   - Value: Your backend Render URL
   - Example: `https://finlit-backend.onrender.com`
   - **IMPORTANT**: No trailing slash!
   - Used in: All frontend service files (`authService.ts`, `tradingService.ts`, etc.)

2. **VITE_GOOGLE_CLIENT_ID**
   - Value: Your Google OAuth Client ID (same as backend)
   - Get from: [Google Cloud Console](https://console.cloud.google.com/)
   - Used in: `frontend/src/services/authService.ts`

3. **VITE_GEMINI_API_KEY**
   - Value: Your Google Gemini API key (same as backend)
   - Get from: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Used in: `frontend/src/services/geminiService.ts`

4. **VITE_FINNHUB_API_KEY**
   - Value: Your Finnhub API key (same as backend)
   - Get from: [Finnhub.io](https://finnhub.io/)
   - Used in: `frontend/src/services/finnhubApi.ts`

### Optional Variables:

5. **VITE_ALPHA_VANTAGE_API_KEY**
   - Value: Your Alpha Vantage API key (if using)
   - Get from: [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

---

## Google OAuth Setup

### 1. Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add authorized JavaScript origins:
   - `https://finlit-nsa.onrender.com`
   - `http://localhost:5173` (for local development)
7. Add authorized redirect URIs:
   - `https://finlit-backend.onrender.com/auth/google/callback`
   - `http://localhost:5000/auth/google/callback` (for local development)

### 2. Copy Credentials

- Copy the **Client ID** → Set as `GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend)
- Copy the **Client Secret** → Set as `GOOGLE_CLIENT_SECRET` (backend)

---

## Verification Checklist

### Backend:
- [ ] All 9 required environment variables are set
- [ ] `FRONTEND_URL` matches your frontend Render URL exactly
- [ ] `GOOGLE_REDIRECT_URI` matches your backend URL + `/auth/google/callback`
- [ ] MongoDB connection string is correct
- [ ] Backend health check: `https://finlit-backend.onrender.com/health` returns `{"status": "healthy"}`

### Frontend:
- [ ] All 4 required environment variables are set
- [ ] `VITE_API_BASE_URL` matches your backend Render URL (no trailing slash)
- [ ] `VITE_GOOGLE_CLIENT_ID` matches the backend `GOOGLE_CLIENT_ID`
- [ ] Frontend builds successfully (check Render build logs)

### Google OAuth:
- [ ] Client ID and Secret are set in both frontend and backend
- [ ] Authorized redirect URI is set in Google Cloud Console
- [ ] Authorized JavaScript origin includes your frontend URL

---

## Common Issues

### 1. "User not found" errors
- **Cause**: User not in database
- **Fix**: Auto-creation is implemented, but ensure `MONGO_URI` and `DATABASE_NAME` are correct

### 2. CORS errors
- **Cause**: `FRONTEND_URL` doesn't match actual frontend URL
- **Fix**: Update `FRONTEND_URL` in backend environment variables

### 3. Authentication stuck on same page
- **Cause**: `VITE_GOOGLE_CLIENT_ID` not set or incorrect
- **Fix**: Set `VITE_GOOGLE_CLIENT_ID` in frontend environment variables

### 4. Database connection failed
- **Cause**: `MONGO_URI` incorrect or network issues
- **Fix**: Verify MongoDB Atlas connection string and network access

### 5. API calls failing
- **Cause**: `VITE_API_BASE_URL` incorrect or backend not running
- **Fix**: Verify `VITE_API_BASE_URL` matches backend URL (no trailing slash)

---

## Testing Deployment

1. **Backend Health Check:**
   ```bash
   curl https://finlit-backend.onrender.com/health
   ```
   Should return: `{"status": "healthy", "database": "connected"}`

2. **Frontend API Connection:**
   - Open browser console on frontend
   - Check for API errors
   - Verify `VITE_API_BASE_URL` is being used (not localhost)

3. **Authentication Flow:**
   - Click "Sign in with Google"
   - Should redirect to Google OAuth
   - After authentication, should redirect to dashboard or onboarding

---

## Notes

- All environment variables are read from `os.getenv()` or `import.meta.env`
- No hardcoded URLs remain in the codebase
- Frontend uses `VITE_` prefix for environment variables (Vite requirement)
- Backend uses standard environment variable names
- Both services are deployed separately and communicate via HTTP


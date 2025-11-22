# Database Connection Troubleshooting Guide

## Problem: "Database not connected" Error on Render

If you're seeing "Database not connected" errors when trying to buy stocks or access trading features, follow these steps:

### Step 1: Check Environment Variables

In Render Dashboard → Your Backend Service → Environment, verify these are set:

1. **MONGO_URI**
   - Should be your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **IMPORTANT**: Make sure there are no extra spaces or quotes

2. **DATABASE_NAME**
   - Should be your database name (e.g., `receipt_scanner` or `finlit_db`)
   - **IMPORTANT**: This must match the database name in MongoDB Atlas

### Step 2: Check MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster → **Network Access**
3. Click **Add IP Address**
4. Add `0.0.0.0/0` to allow access from anywhere (or add Render's IP ranges)
5. Click **Confirm**

### Step 3: Check MongoDB Atlas Database User

1. Go to **Database Access** in MongoDB Atlas
2. Verify your database user exists and has the correct password
3. Make sure the user has **Read and write** permissions
4. If needed, create a new user:
   - Username: `finlit_user` (or your choice)
   - Password: Generate a strong password
   - Database User Privileges: **Read and write to any database**

### Step 4: Verify Connection String Format

Your `MONGO_URI` should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Common mistakes:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Wrong username or password
- ❌ Missing `?retryWrites=true&w=majority` at the end
- ❌ Extra spaces or quotes around the URI

### Step 5: Check Render Logs

1. Go to Render Dashboard → Your Backend Service → **Logs**
2. Look for these messages:
   - `✅ MongoDB Atlas connection successful!` - Connection working
   - `❌ MONGODB CONNECTION FAILED` - Connection failed
   - `MONGO_URI set: Yes/No` - Shows if environment variable is set
   - `DATABASE_NAME: ...` - Shows database name

### Step 6: Test Connection Locally

If you want to test the connection string locally:

```bash
# Install MongoDB shell (if not installed)
brew install mongodb-community

# Test connection
mongosh "your-mongodb-uri-here"
```

### Step 7: Common Issues and Solutions

#### Issue: "Authentication failed"
- **Solution**: Check username and password in `MONGO_URI`
- Make sure special characters in password are URL-encoded (e.g., `@` becomes `%40`)

#### Issue: "Connection timeout"
- **Solution**: 
  - Check Network Access settings in MongoDB Atlas
  - Make sure `0.0.0.0/0` is added to allowed IPs
  - Check if MongoDB Atlas cluster is running (not paused)

#### Issue: "Database name not found"
- **Solution**: 
  - MongoDB Atlas creates databases automatically on first write
  - Make sure `DATABASE_NAME` matches what you want to use
  - The database will be created automatically when you first write data

#### Issue: "SSL/TLS handshake failed"
- **Solution**: 
  - The code automatically handles SSL/TLS
  - Make sure you're using `mongodb+srv://` (not `mongodb://`)
  - Check that `certifi` package is installed (it's in requirements.txt)

### Step 8: Restart Backend Service

After making changes to environment variables:

1. Go to Render Dashboard → Your Backend Service
2. Click **Manual Deploy** → **Clear build cache & deploy**
3. Wait for deployment to complete
4. Check logs to verify connection

### Step 9: Verify Connection

Once deployed, check the health endpoint:

```bash
curl https://finlit-backend.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

If it says `"database": "disconnected"`, the connection is still failing.

### Quick Checklist

- [ ] `MONGO_URI` is set in Render environment variables
- [ ] `DATABASE_NAME` is set in Render environment variables
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] Database user exists and has correct password
- [ ] Connection string format is correct (starts with `mongodb+srv://`)
- [ ] Backend service has been restarted after setting environment variables
- [ ] Render logs show `✅ MongoDB Atlas connection successful!`

### Still Having Issues?

1. **Check Render Logs** for detailed error messages
2. **Test connection string** using MongoDB Compass or `mongosh`
3. **Verify environment variables** are set correctly (no quotes, no extra spaces)
4. **Check MongoDB Atlas** cluster status (make sure it's not paused)

The improved error messages in the code will now show:
- Whether `MONGO_URI` is set
- Whether `DATABASE_NAME` is set
- Preview of the connection string (first 50 characters)
- Detailed error message from MongoDB


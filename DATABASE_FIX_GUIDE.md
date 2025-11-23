# Database Connection Fix Guide for Render

## Quick Diagnosis

The error "Database not connected" means MongoDB isn't connecting on Render. Follow these steps:

## Step 1: Check Render Environment Variables

Go to **Render Dashboard → Your Backend Service → Environment**

You MUST have these two variables set:

### Required Variables:

1. **`MONGO_URI`**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Example: `mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/finlit?retryWrites=true&w=majority`
   - ⚠️ **Important**: Password must be URL-encoded if it contains special characters (@, #, %, etc.)
   - ⚠️ **Important**: Replace `<password>` in Atlas connection string with your actual password

2. **`DATABASE_NAME`**
   - Value: `finlit` (or whatever you named your database)
   - This should match the database name in your MONGO_URI

## Step 2: Get Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual database user password
6. Replace `<dbname>` with your database name (e.g., `finlit`)

**Example:**
```
mongodb+srv://myuser:MyP@ssw0rd123@cluster0.xxxxx.mongodb.net/finlit?retryWrites=true&w=majority
```

## Step 3: Check MongoDB Atlas Network Access

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add Render's IP ranges (less secure but more restrictive)
4. Click **"Confirm"**

⚠️ **This is CRITICAL** - Render's IP addresses change, so you need to allow all IPs (0.0.0.0/0) for it to work reliably.

## Step 4: Verify Database User Credentials

1. Go to MongoDB Atlas → **Database Access**
2. Make sure your database user:
   - Has a password set
   - Has **"Read and write to any database"** permissions (or at least access to your database)
3. If you need to reset the password:
   - Click **"Edit"** on the user
   - Set a new password
   - Update `MONGO_URI` in Render with the new password

## Step 5: Test the Connection

After setting environment variables, check Render logs:

1. Go to **Render Dashboard → Your Backend Service → Logs**
2. Look for these messages:
   - ✅ `"✅ MongoDB Atlas connection successful!"` = Working!
   - ❌ `"❌ MONGODB CONNECTION FAILED"` = Still broken

3. Check the error message in logs for specific issues:
   - **"Authentication failed"** → Wrong username/password
   - **"Connection timeout"** → Network access not configured
   - **"Name resolution failed"** → Wrong cluster name in URI

## Step 6: Common Issues & Fixes

### Issue: "Authentication failed"
**Fix:**
- Check username and password in MONGO_URI
- Make sure password is URL-encoded (replace `@` with `%40`, `#` with `%23`, etc.)
- Verify user exists in MongoDB Atlas → Database Access

### Issue: "Connection timeout"
**Fix:**
- Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` (allow all IPs)
- Wait 2-3 minutes for changes to propagate

### Issue: "MONGO_URI not set"
**Fix:**
- Go to Render Dashboard → Environment Variables
- Add `MONGO_URI` with your full connection string
- Make sure there are no extra spaces or quotes
- Click **"Save Changes"** and redeploy

### Issue: "Wrong database name"
**Fix:**
- Check `DATABASE_NAME` matches the database name in your MONGO_URI
- Or create the database in MongoDB Atlas if it doesn't exist

## Step 7: Verify It's Working

After fixing, test by:

1. **Check Render logs** - should see "✅ MongoDB Atlas connection successful!"
2. **Try the app** - login and complete onboarding
3. **Check database** - data should persist after refresh

## Still Not Working?

Run the diagnostic script on Render:

1. SSH into your Render service (if available)
2. Or add this to your startup script temporarily:

```python
# Add to app.py at the top
from test_db_connection import test_connection
test_connection()
```

This will print detailed diagnostics in the logs.

## Quick Checklist

- [ ] `MONGO_URI` is set in Render (full connection string)
- [ ] `DATABASE_NAME` is set in Render
- [ ] Password in MONGO_URI is URL-encoded if needed
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] Database user has read/write permissions
- [ ] Connection string format is correct (`mongodb+srv://...`)
- [ ] No extra spaces or quotes in environment variables

## Example Correct Setup

**Render Environment Variables:**
```
MONGO_URI=mongodb+srv://myuser:MyP%40ssw0rd@cluster0.xxxxx.mongodb.net/finlit?retryWrites=true&w=majority
DATABASE_NAME=finlit
```

**MongoDB Atlas Network Access:**
- IP Address: `0.0.0.0/0`
- Status: Active

**MongoDB Atlas Database Access:**
- Username: `myuser`
- Password: `MyP@ssw0rd` (note: @ is encoded as %40 in URI)
- Database User Privileges: Read and write to any database


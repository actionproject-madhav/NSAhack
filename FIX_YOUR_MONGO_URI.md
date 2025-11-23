# Fix Your MONGO_URI

## The Problem

Your password contains `@` which breaks the MongoDB connection string format.

## Your Current URI (BROKEN):
```
mongodb+srv://finlit:Madhav@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority&tlsInsecure=true
```

## The Issue:
- Password `Madhav@` contains `@` which MongoDB interprets as a separator
- `tlsInsecure=true` is not a valid MongoDB parameter

## Fixed URI (CORRECT):
```
mongodb+srv://finlit:Madhav%40@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority
```

## What Changed:
1. `Madhav@` → `Madhav%40` (URL-encoded the @ symbol)
2. Removed `&tlsInsecure=true` (not needed, MongoDB Atlas handles TLS automatically)

## Steps to Fix:

1. Go to **Render Dashboard → Your Backend Service → Environment Variables**

2. Update `MONGO_URI` to:
   ```
   mongodb+srv://finlit:Madhav%40@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority
   ```

3. Keep `DATABASE_NAME` as:
   ```
   receipt_scanner
   ```

4. Click **"Save Changes"**

5. Wait for Render to redeploy (or manually trigger a deploy)

6. Check Render logs - you should see:
   ```
   ✅ MongoDB Atlas connection successful!
   ```

## URL Encoding Reference:

If your password has other special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

## Verify It Works:

After updating, test:
1. Check Render logs for connection success
2. Visit: `https://your-backend.onrender.com/api/health`
3. Should show: `"connected": true`


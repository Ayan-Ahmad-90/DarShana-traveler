# 🔐 Secure MongoDB Connection Setup

Your connection string has a password placeholder that needs to be replaced.

## Your Connection Details

**Connection String Template:**
```
mongodb+srv://chaudharyayan100_db_user:<db_password>@cluster0.ufhvfhe.mongodb.net/?appName=Cluster0
```

**Username:** `chaudharyayan100_db_user`  
**Cluster:** `cluster0.ufhvfhe.mongodb.net`

---

## ✅ Replace the Password

You need to replace `<db_password>` with your actual password.

### Step 1: Find Your Password

In MongoDB Atlas:
1. Go to https://cloud.mongodb.com/v2/692619c463b728357b685a12#/overview
2. Click "Database Access" (left sidebar)
3. Find user `chaudharyayan100_db_user`
4. Click the three dots menu
5. Click "Edit Password" or "Show Password"
6. Copy the actual password

### Step 2: Create Connection String

Replace `<db_password>` with your actual password:

**Example (NOT your real password):**
```
mongodb+srv://chaudharyayan100_db_user:MyActualPassword123@cluster0.ufhvfhe.mongodb.net/?appName=Cluster0
```

### Step 3: Handle Special Characters

If your password contains special characters (`@`, `#`, `%`, etc.), URL encode them:

**Character Encodings:**
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `/` → `%2F`
- `?` → `%3F`

**Encoder Tool:** https://www.urlencoder.org/

**Example:**
- Raw password: `Pass@word#123`
- Encoded: `Pass%40word%23123`
- Final string: `mongodb+srv://chaudharyayan100_db_user:Pass%40word%23123@cluster0.ufhvfhe.mongodb.net/?appName=Cluster0`

---

## 🚀 Start Backend with Real Password

Once you have the correct password, run in PowerShell:

```powershell
cd "c:\Users\Dell\OneDrive\Desktop\DarShana-travel\backend"
$env:MONGODB_URI='mongodb+srv://chaudharyayan100_db_user:YOUR_ACTUAL_PASSWORD@cluster0.ufhvfhe.mongodb.net/?appName=Cluster0'
$env:PORT='5000'
npm start
```

**Should output:**
```
✅ Connected to MongoDB
✅ Server running on port 5000
```

---

## ✅ Troubleshooting

**"Authentication failed"**
- Password is wrong or has special characters that need encoding
- Use URL encoder if password has `@`, `#`, etc.

**"Connection timeout"**
- MongoDB Atlas cluster still starting (wait 5-10 minutes)
- IP not whitelisted - go to Network Access and add your IP

**"Cluster not found"**
- Check cluster name in connection string
- Should be: `cluster0.ufhvfhe.mongodb.net`

---

## 💾 Option: Save Connection String (Secure)

For development only, create `.env.local` in backend folder:

```bash
MONGODB_URI=mongodb+srv://chaudharyayan100_db_user:YOUR_PASSWORD@cluster0.ufhvfhe.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
```

Then run:
```powershell
cd backend
npm start
```

**Important:** Never commit `.env.local` to Git - add to `.gitignore`

---

## 📋 Quick Checklist

- [ ] Found actual password in MongoDB Atlas
- [ ] Replaced `<db_password>` with real password
- [ ] Handled special characters (URL encode if needed)
- [ ] Verified connection string format
- [ ] Ready to run `npm start`

---

**Once working:**
- Frontend: http://localhost:5173 ✅
- Backend: http://localhost:5000 ✅
- API: http://localhost:5000/api/routes ✅
- Test Green Routes: New Delhi → Jaipur 🌍

**Need help finding your password?** Let me know!

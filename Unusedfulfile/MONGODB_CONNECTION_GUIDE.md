# 🔧 MongoDB Atlas - Alternative Connection Methods

If the web UI isn't working properly, here are alternative ways to get your connection string:

---

## ✅ Option 1: Use Browser Developer Tools

1. **Open MongoDB Atlas in browser** (even if UI looks broken)
2. **Press F12** to open Developer Tools
3. Go to **Network** tab
4. Look for API calls to `clusters` or `connectionStrings`
5. Check the **Response** to find your connection string
6. Format: `mongodb+srv://username:password@cluster-name.mongodb.net/database`

---

## ✅ Option 2: Use MongoDB Atlas CLI

**Install MongoDB CLI:**
```powershell
# Using Homebrew (if installed)
brew install mongodb-atlas-cli

# OR download from:
# https://www.mongodb.com/docs/atlas/cli/stable/install/
```

**Login and get connection string:**
```powershell
atlas auth login

# List your clusters
atlas clusters list

# Get connection string for specific cluster
atlas clusters connectionStrings describe <CLUSTER_NAME>
```

---

## ✅ Option 3: Check Your Email

MongoDB Atlas usually sends connection details via email when you:
- Create an account
- Create a cluster
- Add a database user

**Check your email for:**
- Connection string
- Username
- Temporary password

---

## ✅ Option 4: Default MongoDB Atlas Connection String Format

If you know your cluster details, manually construct it:

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER_NAME.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://admin:mypassword@cluster0.abc123.mongodb.net/darshana?retryWrites=true&w=majority
```

Find your:
- **Cluster name:** In MongoDB Atlas dashboard (usually `Cluster0`)
- **Username:** In Database Access section
- **Password:** What you set during user creation

---

## ✅ Option 5: Quick MongoDB Connection Test

Once you have a connection string, test it:

```powershell
# Save your connection string
$env:MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/darshana?retryWrites=true'

# Test connection with Node
cd "c:\Users\Dell\OneDrive\Desktop\DarShana-travel\backend"
npm start

# Should show: "Connected to MongoDB" if working
```

---

## 🔑 Critical Settings in MongoDB Atlas

When setting up, make sure:

1. **Network Access**
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - OR add your IP (find at https://whatismyip.com)

2. **Database User**
   - Username: Something you choose (e.g., `admin`)
   - Password: Strong password (auto-generated is fine)
   - Built-in Role: `readWriteAnyDatabase`

3. **Database Name**
   - Any name works (e.g., `darshana`, `darshana-travel`)

---

## 🆘 Still Having Issues?

**Connection string format wrong:**
- Should start with `mongodb+srv://` (not `mongodb://`)
- Format: `mongodb+srv://user:password@cluster.mongodb.net/dbname`

**"Unauthorized" or "Failed to authenticate":**
- Username/password typo
- Special characters in password need URL encoding
- If password has `@`, `#`, etc., use URL encoder: https://www.urlencoder.org/

**"No suitable servers found":**
- IP address not whitelisted in MongoDB Atlas
- Go to Network Access and add your IP

**"Connection timeout":**
- Wait 5-10 minutes for MongoDB Atlas to fully provision
- Try again

---

## 📋 Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (free tier)
- [ ] Database user created with username/password
- [ ] Network Access configured (added your IP or 0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/db`
- [ ] Ready to run backend

---

## 🚀 Once You Have Connection String

Run this in PowerShell:

```powershell
cd "c:\Users\Dell\OneDrive\Desktop\DarShana-travel\backend"
$env:MONGODB_URI='your-connection-string-here'
$env:PORT='5000'
npm start
```

Should output:
```
✅ Connected to MongoDB
✅ Server running on port 5000
```

Then test at: http://localhost:5000/api/routes

---

## 🎯 Next Step

Once you have the connection string working, test the full app:

1. **Frontend:** http://localhost:5173 ✅ (already running)
2. **Backend:** `npm start` in backend folder
3. **Test Green Routes:** New Delhi → Jaipur
4. **See:** 8 transport options with CO₂ calculations

---

**Need more help?** See `LOCAL_DEVELOPMENT_SETUP.md` for full options.

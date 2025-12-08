# Uncommitted Changes Detection

This project includes automated checks for uncommitted Git changes before builds and deployments.

## Overview

The uncommitted changes detection helps prevent deploying code with uncommitted changes by warning developers when:
- There are unstaged changes
- There are staged but uncommitted changes
- There are untracked files

**Important:** This check is non-blocking - it will warn you about uncommitted changes but will allow the build to proceed.

## Usage

### Automatic Check (During Build)

The check runs automatically before every build:

```bash
npm run build
```

The `prebuild` script will run automatically and check for uncommitted changes before the build starts.

### Manual Check

You can manually check for uncommitted changes at any time:

```bash
# Using npm script (cross-platform)
npm run check-changes

# Using Node.js directly
node check-uncommitted-changes.cjs

# Using shell script (Unix/Linux/macOS)
./check-uncommitted-changes.sh

# Using batch file (Windows)
check-uncommitted-changes.bat
```

## Available Scripts

- **check-uncommitted-changes.cjs** - Node.js script (works on all platforms with Node.js)
- **check-uncommitted-changes.sh** - Bash script for Unix/Linux/macOS
- **check-uncommitted-changes.bat** - Batch script for Windows

## What It Checks

The script checks for:
1. **Unstaged changes** - Modified files that haven't been staged with `git add`
2. **Staged changes** - Files staged with `git add` but not yet committed
3. **Untracked files** - New files that haven't been added to Git

## Example Output

### When Changes Are Detected

```
Checking for uncommitted changes...

⚠️  Uncommitted changes detected

Unstaged changes:
  - src/App.tsx
  - package.json

Untracked files:
  - new-feature.js

Proceeding with build, but consider committing your changes.
```

### When No Changes Are Detected

```
Checking for uncommitted changes...

✓ No uncommitted changes detected
```

## Integration with CI/CD

This check can be integrated into CI/CD pipelines to warn about uncommitted changes during automated builds. Since it's non-blocking, it won't fail the build but will provide visibility.

## Disabling the Check

If you need to disable the automatic check during build:

1. **Temporarily** - Set the environment variable:
   ```bash
   SKIP_PREFLIGHT_CHECK=true npm run build
   ```

2. **Permanently** - Remove the `prebuild` script from `package.json`:
   ```json
   "scripts": {
     "build": "tsc -b && vite build",
     // Remove this line:
     // "prebuild": "node check-uncommitted-changes.cjs",
   }
   ```

## Why This Check Exists

This check helps:
- Prevent accidentally deploying uncommitted code
- Ensure all changes are properly tracked in version control
- Maintain clean deployment history
- Catch forgotten changes before production deployments

## Troubleshooting

### Not in a Git Repository

If you see "Not a git repository. Skipping check." - this is normal if the code is not in a Git repository. The check will be skipped.

### Permission Denied (Unix/macOS)

If you get permission denied when running the shell script:
```bash
chmod +x check-uncommitted-changes.sh
```

### Script Not Found

Make sure you're running the commands from the project root directory.

#!/usr/bin/env node

/**
 * Pre-build/Pre-deploy script to check for uncommitted changes
 * This script warns developers if there are uncommitted changes in the working directory
 * but allows the build to proceed.
 */

const { execSync } = require('child_process');
const process = require('process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

/**
 * Check if we're in a git repository
 */
function isGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check for uncommitted changes in the repository
 */
function hasUncommittedChanges() {
  try {
    // Check for unstaged changes
    const unstagedChanges = execSync('git diff --name-only', { encoding: 'utf-8' }).trim();
    
    // Check for staged but uncommitted changes
    const stagedChanges = execSync('git diff --cached --name-only', { encoding: 'utf-8' }).trim();
    
    // Check for untracked files
    const untrackedFiles = execSync('git ls-files --others --exclude-standard', { encoding: 'utf-8' }).trim();
    
    return {
      hasChanges: !!(unstagedChanges || stagedChanges || untrackedFiles),
      unstaged: unstagedChanges ? unstagedChanges.split('\n') : [],
      staged: stagedChanges ? stagedChanges.split('\n') : [],
      untracked: untrackedFiles ? untrackedFiles.split('\n') : []
    };
  } catch (error) {
    console.error(`${colors.red}Error checking git status:${colors.reset}`, error.message);
    return { hasChanges: false, unstaged: [], staged: [], untracked: [] };
  }
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}Checking for uncommitted changes...${colors.reset}\n`);
  
  // Check if we're in a git repository
  if (!isGitRepository()) {
    console.log(`${colors.yellow}Not a git repository. Skipping check.${colors.reset}`);
    process.exit(0);
  }
  
  // Check for uncommitted changes
  const changeStatus = hasUncommittedChanges();
  
  if (changeStatus.hasChanges) {
    console.log(`${colors.yellow}⚠️  Uncommitted changes detected${colors.reset}\n`);
    
    if (changeStatus.unstaged.length > 0) {
      console.log(`${colors.yellow}Unstaged changes:${colors.reset}`);
      changeStatus.unstaged.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }
    
    if (changeStatus.staged.length > 0) {
      console.log(`${colors.yellow}Staged changes:${colors.reset}`);
      changeStatus.staged.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }
    
    if (changeStatus.untracked.length > 0) {
      console.log(`${colors.yellow}Untracked files:${colors.reset}`);
      changeStatus.untracked.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }
    
    console.log(`${colors.yellow}Proceeding with build, but consider committing your changes.${colors.reset}\n`);
    // Exit with success to allow the build to continue
    process.exit(0);
  } else {
    console.log(`${colors.green}✓ No uncommitted changes detected${colors.reset}\n`);
    process.exit(0);
  }
}

// Run the check
main();

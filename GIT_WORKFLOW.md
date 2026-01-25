# 🚀 Git Workflow Cheat Sheet - QuotesHub

Quick reference guide for managing your Git workflow as a solo developer.

---

## 📊 Branch Overview

| Branch | Purpose | Deploy To | Merge From |
|--------|---------|-----------|------------|
| `main` | Production (LIVE) | Production Server | `test` or `hotfix/*` |
| `test` | Staging/QA | Staging Server | `dev` |
| `dev` | Development | Local/Dev Server | `feature/*`, `bugfix/*` |
| `feature/*` | New features | Local only | - |
| `bugfix/*` | Bug fixes | Local only | - |
| `hotfix/*` | Emergency fixes | Production | `main` |

---

## 🎯 Common Workflows

### 1️⃣ Starting a New Feature

```bash
# Switch to dev and update
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature...
# (edit files, test locally)

# Stage and commit changes
git add .
git commit -m "feat: Add your feature description"

# Push to GitHub
git push origin feature/your-feature-name

# Merge back to dev when done
git checkout dev
git merge feature/your-feature-name
git push origin dev

# Delete feature branch (cleanup)
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

**Example:**
```bash
git checkout -b feature/quote-of-the-day
# ... work on feature ...
git commit -m "feat: Add quote of the day widget"
git checkout dev
git merge feature/quote-of-the-day
```

---

### 2️⃣ Fixing a Bug

```bash
# Start from dev
git checkout dev
git pull origin dev

# Create bugfix branch
git checkout -b bugfix/describe-the-bug

# Fix the bug...
git add .
git commit -m "fix: Describe what you fixed"

# Merge back to dev
git checkout dev
git merge bugfix/describe-the-bug
git push origin dev

# Cleanup
git branch -d bugfix/describe-the-bug
```

**Example:**
```bash
git checkout -b bugfix/save-button-not-working
# ... fix the code ...
git commit -m "fix: Resolve save button API endpoint issue"
```

---

### 3️⃣ Testing & Releasing to Production

```bash
# Step 1: Merge dev to test
git checkout test
git pull origin test
git merge dev
git push origin test

# Step 2: Deploy to staging and test thoroughly
# (Manual testing, check all features)

# Step 3: If everything works, merge to main
git checkout main
git pull origin main
git merge test
git push origin main

# Step 4: Deploy to production 🚀
```

---

### 4️⃣ Emergency Hotfix (Production is Broken!)

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-name

# Fix the issue FAST
git add .
git commit -m "hotfix: Fix critical issue description"

# Merge to main immediately
git checkout main
git merge hotfix/critical-issue-name
git push origin main

# IMPORTANT: Sync the fix to other branches
git checkout dev
git merge hotfix/critical-issue-name
git push origin dev

git checkout test
git merge hotfix/critical-issue-name
git push origin test

# Cleanup
git branch -d hotfix/critical-issue-name
```

---

## 📅 Weekly Workflow Example

### **Monday - Wednesday: Development**
```bash
# Create and work on features
git checkout -b feature/user-profile
# ... code ...
git commit -m "feat: Add user profile page"

git checkout -b feature/dark-mode
# ... code ...
git commit -m "feat: Implement dark mode toggle"

# Merge to dev
git checkout dev
git merge feature/user-profile
git merge feature/dark-mode
git push origin dev
```

### **Thursday: Testing**
```bash
# Merge to test branch
git checkout test
git merge dev
git push origin test

# Deploy to staging server
# Test everything thoroughly
```

### **Friday: Production Release**
```bash
# If tests pass, release to production
git checkout main
git merge test
git push origin main

# Deploy to production server 🎉
```

---

## 🔧 Useful Git Commands

### Check Current Status
```bash
git status                    # See what's changed
git branch                    # List local branches
git branch -a                 # List all branches (including remote)
git log --oneline -10         # See last 10 commits
```

### Undo Changes
```bash
git checkout -- filename      # Discard changes in a file
git reset HEAD filename       # Unstage a file
git reset --soft HEAD~1       # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (discard changes)
```

### Sync with Remote
```bash
git fetch origin              # Download changes (don't merge)
git pull origin branch-name   # Download and merge changes
git push origin branch-name   # Upload your changes
```

### Branch Management
```bash
git branch new-branch         # Create new branch
git checkout branch-name      # Switch to branch
git checkout -b new-branch    # Create and switch to new branch
git branch -d branch-name     # Delete local branch
git push origin --delete branch-name  # Delete remote branch
```

### View Differences
```bash
git diff                      # See unstaged changes
git diff --staged             # See staged changes
git diff branch1..branch2     # Compare two branches
```

---

## 📝 Commit Message Conventions

Follow these prefixes for clear commit history:

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feat:` | New feature | `feat: Add user authentication` |
| `fix:` | Bug fix | `fix: Resolve login redirect issue` |
| `docs:` | Documentation | `docs: Update API documentation` |
| `style:` | Code formatting | `style: Format code with Prettier` |
| `refactor:` | Code restructuring | `refactor: Simplify quote validation logic` |
| `test:` | Adding tests | `test: Add unit tests for QuoteController` |
| `chore:` | Maintenance | `chore: Update dependencies` |
| `perf:` | Performance | `perf: Optimize database queries` |
| `hotfix:` | Critical fix | `hotfix: Fix production login crash` |

**Examples:**
```bash
git commit -m "feat: Add quote search functionality"
git commit -m "fix: Resolve save button not responding"
git commit -m "docs: Add API endpoint documentation"
git commit -m "refactor: Improve feed loading performance"
```

---

## 🎨 Visual Workflow

```
┌──────────────────────────────────────────────────────────┐
│                   FEATURE DEVELOPMENT                     │
└──────────────────────────────────────────────────────────┘

dev ──→ feature/new-thing ──→ (work) ──→ merge to dev


┌──────────────────────────────────────────────────────────┐
│                   RELEASE WORKFLOW                        │
└──────────────────────────────────────────────────────────┘

dev ──→ test ──→ (QA testing) ──→ main ──→ 🚀 PRODUCTION


┌──────────────────────────────────────────────────────────┐
│                   EMERGENCY HOTFIX                        │
└──────────────────────────────────────────────────────────┘

main ──→ hotfix/urgent ──→ main (LIVE)
                           │
                           ├──→ dev
                           └──→ test
```

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
```bash
# Don't work directly on main
git checkout main
# ... make changes ... ❌

# Don't commit without a message
git commit -m "" ❌

# Don't push without pulling first
git push origin main ❌ (might cause conflicts)
```

### ✅ DO:
```bash
# Always work on feature branches
git checkout -b feature/my-feature ✅

# Write descriptive commit messages
git commit -m "feat: Add user profile page with avatar upload" ✅

# Pull before push
git pull origin main
git push origin main ✅
```

---

## 🎯 Quick Decision Tree

**Starting new work?**
- New feature → `feature/feature-name` from `dev`
- Bug fix → `bugfix/bug-name` from `dev`
- Production broken → `hotfix/issue-name` from `main`

**Finished working?**
- Feature/bugfix → merge to `dev`
- Ready to test → merge `dev` to `test`
- Tested and ready → merge `test` to `main`
- Emergency fix → merge `hotfix` to `main`, then to `dev` and `test`

---

## 💡 Pro Tips

1. **Commit Often**: Small, frequent commits are better than large ones
2. **Pull Before Push**: Always pull latest changes before pushing
3. **Test Locally**: Test your changes before committing
4. **Clean Branches**: Delete merged feature branches to keep repo clean
5. **Descriptive Names**: Use clear branch names like `feature/user-authentication`
6. **Backup Work**: Push to GitHub regularly (it's your backup!)

---

## 🆘 Emergency Commands

### "I committed to the wrong branch!"
```bash
# Undo the commit (keep changes)
git reset --soft HEAD~1

# Switch to correct branch
git checkout correct-branch

# Commit again
git add .
git commit -m "your message"
```

### "I need to discard all my changes!"
```bash
# Discard all uncommitted changes
git reset --hard HEAD

# Discard all changes and pull fresh
git fetch origin
git reset --hard origin/branch-name
```

### "I accidentally deleted a file!"
```bash
# Restore deleted file
git checkout HEAD -- filename
```

### "I need to see what changed in a commit"
```bash
git show commit-hash
```

---

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Cheat Sheet (PDF)](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Remember:** Git is your safety net. Commit often, push regularly, and don't be afraid to experiment on feature branches! 🚀

---

*Last Updated: January 2026*

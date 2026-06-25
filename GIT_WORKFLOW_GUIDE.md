# Git Workflow Guide for Bobathon Repository

## 🎯 Overview
This guide explains how to automatically push code changes to the Bobathon GitHub repository using SSH authentication.

## ✅ Setup Complete
Your system is now configured with:
- **Git User**: rsrivatsan06
- **Git Email**: Rishi.Srivatsa@ibm.com
- **SSH Authentication**: Enabled (no password required for push/pull)
- **Repository Location**: `/Users/rishisrivatsan/Desktop/Bobathon`
- **Remote Origin**: `git@github.com:IBMAyush/Bobathon.git`

## 🚀 Daily Workflow for Pushing Code Changes

### 1. Navigate to Repository
```bash
cd /Users/rishisrivatsan/Desktop/Bobathon
```

### 2. Check Current Status
```bash
git status
```
This shows which files have been modified, added, or deleted.

### 3. Stage Your Changes
**Stage specific files:**
```bash
git add src/index.js
git add src/agents/newAgent.js
```

**Stage all changes:**
```bash
git add .
```

**Stage by pattern:**
```bash
git add src/*.js
git add docs/*.md
```

### 4. Commit Your Changes
```bash
git commit -m "Add feature: description of what you changed"
```

**Good commit message examples:**
- `git commit -m "Add client intelligence agent"`
- `git commit -m "Fix bug in opportunity scorer"`
- `git commit -m "Update documentation for Slack setup"`
- `git commit -m "Refactor workflow automation service"`

### 5. Push to GitHub (Automatic - No Password!)
```bash
git push origin main
```

**That's it!** Your changes are now on GitHub. SSH handles authentication automatically.

## 🔄 Complete Workflow Example

```bash
# 1. Navigate to repository
cd /Users/rishisrivatsan/Desktop/Bobathon

# 2. Check what changed
git status

# 3. Stage all changes
git add .

# 4. Commit with descriptive message
git commit -m "Implement deal radar agent functionality"

# 5. Push to GitHub (automatic authentication)
git push origin main
```

## 📥 Pulling Latest Changes

Before starting work, always pull the latest changes:

```bash
cd /Users/rishisrivatsan/Desktop/Bobathon
git pull origin main
```

## 🌿 Working with Branches

### Create a New Branch
```bash
git checkout -b feature/my-new-feature
```

### Push New Branch to GitHub
```bash
git push -u origin feature/my-new-feature
```

### Switch Between Branches
```bash
git checkout main
git checkout feature/my-new-feature
```

### Merge Branch into Main
```bash
git checkout main
git merge feature/my-new-feature
git push origin main
```

## 🛠️ Useful Commands

### View Commit History
```bash
git log --oneline
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Discard Local Changes
```bash
git checkout -- filename.js
```

### View Remote Information
```bash
git remote -v
```

### Check Current Branch
```bash
git branch
```

## 🔐 SSH Authentication Benefits

✅ **No Password Prompts**: Push/pull without entering credentials  
✅ **Secure**: Uses cryptographic keys instead of passwords  
✅ **Automatic**: Works seamlessly with all Git operations  
✅ **Fast**: No authentication delays  

## 📋 Quick Reference Card

| Action | Command |
|--------|---------|
| Check status | `git status` |
| Stage all files | `git add .` |
| Commit changes | `git commit -m "message"` |
| Push to GitHub | `git push origin main` |
| Pull latest | `git pull origin main` |
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| View history | `git log --oneline` |

## 🎓 Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Describe what and why, not how
3. **Pull Before Push**: Always pull latest changes before pushing
4. **Test Before Commit**: Ensure code works before committing
5. **Use Branches**: Create feature branches for new work
6. **Review Changes**: Use `git status` and `git diff` before committing

## 🆘 Troubleshooting

### If Push Fails
```bash
# Pull latest changes first
git pull origin main

# Resolve any conflicts, then push
git push origin main
```

### If You Need to Force Push (Use Carefully!)
```bash
git push origin main --force
```
⚠️ **Warning**: Force push overwrites remote history. Only use if you're sure!

### Check SSH Connection
```bash
ssh -T git@github.com
```
Should output: `Hi rsrivatsan06! You've successfully authenticated...`

## 📞 Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **SSH Key Issues**: Check `~/.ssh/id_ed25519.pub` exists

---

**Repository**: https://github.com/IBMAyush/Bobathon  
**Your Username**: rsrivatsan06  
**Setup Date**: June 25, 2026
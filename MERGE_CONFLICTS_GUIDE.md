# Merge Conflicts - Simple Guide

This guide explains what to do when your teammate pushes changes and you need to pull them.

## 🔄 **The Simple Workflow**

### **When Your Teammate Pushes Changes:**

#### **Step 1: Pull the Changes**
```bash
git pull origin main
```

#### **Step 2A: If No Conflicts (Easy Case)**
```bash
# Git automatically merges - you're done!
# You can now continue working
```

#### **Step 2B: If You Get Merge Conflicts (Common Case)**
```bash
# You'll see this message:
# "You have divergent branches and need to specify how to reconcile them"
```

**Solution:**
```bash
# Choose merge strategy
git config pull.rebase false

# Pull again
git pull
```

#### **Step 3: If Files Have Conflicts**
You'll see files marked as "both modified" in `git status`

**Example of conflict in a file:**
```bash
<<<<<<< HEAD
Your changes here
=======
Teammate's changes here
>>>>>>> origin/main
```

**How to fix:**
1. **Open the file** (in VS Code, nano, etc.)
2. **Look for the conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`)
3. **Choose what to keep:**
   - Keep your version: Delete everything except your code
   - Keep teammate's version: Delete everything except teammate's code
   - Keep both: Combine them and remove the markers
4. **Remove the conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`)
5. **Save the file**

#### **Step 4: Complete the Merge**
```bash
# Add the resolved files
git add .

# Commit the merge
git commit -m "Merge teammate's changes"

# Push your changes
git push origin main
```

## 🎯 **Real Example**

### **Scenario: Your teammate updated SETUP.md**

#### **What you do:**
```bash
# 1. Pull changes
git pull origin main

# 2. If you get the divergent branches message:
git config pull.rebase false
git pull

# 3. If SETUP.md has conflicts, open it and fix:
# Remove the conflict markers and choose which version to keep

# 4. Complete the merge
git add .
git commit -m "Merge SETUP.md changes from teammate"
git push origin main
```

## ⚡ **Quick Commands Summary**

```bash
# The complete workflow:
git pull origin main
# If conflicts: git config pull.rebase false && git pull
# Fix conflicts in files manually
git add .
git commit -m "Merge changes"
git push origin main
```

## 🚨 **Common Scenarios**

### **Scenario 1: "Your branch is behind"**
```bash
git pull origin main
```

### **Scenario 2: "Divergent branches"**
```bash
git config pull.rebase false
git pull
```

### **Scenario 3: "Please commit your changes"**
```bash
# Option 1: Commit your work first
git add .
git commit -m "Work in progress"
git pull

# Option 2: Stash your work
git stash
git pull
git stash pop
```

## 💡 **Pro Tips**

### **Before Starting Work:**
```bash
# Always pull first to avoid conflicts
git pull origin main
```

### **If You're Not Sure:**
```bash
# Check what's different
git status
git log --oneline -5
```

### **Emergency - Start Over:**
```bash
# If you mess up badly, go back to GitHub version
git reset --hard origin/main
```

---

## 🎯 **The One-Page Solution**

**When teammate pushes changes:**

1. `git pull origin main`
2. If error: `git config pull.rebase false` then `git pull`
3. If conflicts: Open files, remove `<<<<<<<` markers, save
4. `git add .`
5. `git commit -m "Merge changes"`
6. `git push origin main`

**That's it!** 🚀

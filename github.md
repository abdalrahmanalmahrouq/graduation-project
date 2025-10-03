# GitHub Git Reset Instructions


This guide explains how to reset or undo the last committed command in Git/GitHub.

## 1. Undo the last commit but keep changes staged

```bash
git reset --soft HEAD~1
```

- **What it does**: Removes the last commit but keeps all changes staged
- **Use when**: You want to modify the commit message or add more changes to the same commit

## 2. Undo the last commit and unstage changes

```bash
git reset HEAD~1
```

or

```bash
git reset --mixed HEAD~1
```

- **What it does**: Removes the last commit and unstages all changes, but keeps files modified
- **Use when**: You want to review changes before committing again

## 3. Completely remove the last commit and all changes

```bash
git reset --hard HEAD~1
```

⚠️ **Warning**: This permanently deletes the commit and all changes. Use with caution!

- **What it does**: Completely removes the last commit and all changes
- **Use when**: You want to completely discard the last commit and start over

## 4. If you've already pushed to GitHub

If the commit is already on GitHub, you'll need to force push after resetting:

```bash
git reset --soft HEAD~1  # or --mixed, --hard
git push --force-with-lease origin main
```

⚠️ **Warning**: Force pushing rewrites history and can affect collaborators. Use carefully!

## 5. Safer alternative: Create a new commit that undoes changes

```bash
git revert HEAD
```

- **What it does**: Creates a new commit that undoes the last commit's changes
- **Use when**: Working with shared repositories where you don't want to rewrite history
- **Advantage**: Safer for collaborative projects

## Common Scenarios

### Scenario 1: You want to keep your current changes but undo the last commit
```bash
git reset --soft HEAD~1
```

### Scenario 2: You want to undo the commit and also unstage your current changes
```bash
git reset HEAD~1
```

### Scenario 3: You want to completely start over
```bash
git reset --hard HEAD~1
```

### Scenario 4: You've pushed to GitHub and need to undo
```bash
git reset --soft HEAD~1
git push --force-with-lease origin main
```

## Best Practices

1. **Before using `--hard`**: Always make sure you don't need the changes
2. **For shared repositories**: Prefer `git revert` over `git reset`
3. **Use `--force-with-lease`**: Safer than `--force` when force pushing
4. **Check status first**: Run `git status` to see current state
5. **Backup important work**: Consider creating a backup branch before major resets

## Checking Your Current State

Before resetting, check your current git status:

```bash
git status
git log --oneline -5  # See last 5 commits
```

## Recovery

If you accidentally reset too far, you can recover using:

```bash
git reflog  # Shows all recent actions
git reset --hard HEAD@{n}  # Reset to a specific reflog entry
```

## Notes

- `HEAD~1` refers to the commit before the current HEAD
- `HEAD~2` would refer to two commits before HEAD
- Always be careful with force pushing on shared repositories
- Consider using `git stash` to temporarily save changes before resetting

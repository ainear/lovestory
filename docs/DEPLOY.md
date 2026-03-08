# Deploy & Rollback Guide

## Branch Strategy
```
main (production) ← deploys to Vercel automatically
  └── develop (staging/development)
       └── feature/* (individual features)
```

## Standard Workflow
```bash
# 1. Start feature on develop
git checkout develop
git pull origin develop

# 2. Work on feature
# ... make changes ...
git add -A && git commit -m "feat: description"
git push origin develop

# 3. When ready for production
git checkout main
git merge develop
git push origin main
# Vercel auto-deploys main
```

## Rollback (if production breaks)

### Quick: Revert last merge
```bash
git checkout main
git revert -m 1 HEAD
git push origin main
```

### Hard: Reset to stable tag
```bash
git checkout main
git reset --hard v1.0-stable
git push --force origin main
```

### DB Rollback
All SQL migrations use `IF NOT EXISTS` — safe to re-run.
For destructive changes, always create a backup first:
```sql
-- Before risky migration
CREATE TABLE projects_backup AS SELECT * FROM projects;
```

## Pre-Deploy Checklist
- [ ] `npm run build` passes
- [ ] Test on develop branch locally
- [ ] Browser test critical paths (login, editor, publish)
- [ ] Check Supabase schema matches code

# Theme Deployment & Operations Guide

## Overview

This guide covers how to:

- Deploy theme updates to production
- Monitor theme health
- Handle rollbacks
- Troubleshoot sync issues

---

## Deployment Process

### Development → Production Flow

```
1. Developer updates theme in thmc2 (src/theme/, tailwind.config.js)
   ↓
2. Push to develop branch
   ↓
3. GitHub Actions validates (lint, tests, bundle size)
   ↓
4. If valid, syncs to all MFEs automatically
   ↓
5. Each MFE receives pull request
   ↓
6. Merge PR in each MFE
   ↓
7. Theme changes live in production
```

### Manual Deployment (Emergency)

If automatic sync fails:

**From main theme repo:**

```bash
# On Windows
npm run sync:mfes

# On Linux/Mac
bash scripts/sync-theme-to-mfes.sh
```

This manually syncs to all connected MFEs.

---

## GitHub Actions Workflow

### Workflow File

Location: `.github/workflows/theme-sync.yml`

### Triggers

The workflow runs automatically when:

- **Branch:** Push to `develop`
- **Files changed:**
  - `src/theme/**`
  - `tailwind.config.js`
  - `package.json`

### Workflow Steps

1. **Build Theme** (3-5 min)
   - Installs dependencies
   - Validates themes
   - Builds bundle
   - Checks bundle size

2. **Sync to Each MFE** (5-10 min each)
   - Clones MFE repo
   - Updates `src/theme-shared/`
   - Commits changes
   - Pushes to origin

3. **Notify** (1 min)
   - Posts workflow summary
   - Sends webhook notification (if configured)

### Monitoring Workflow

**Check status:**

```
https://github.com/Mohitsagar236/thmc2/actions
```

Look for `Sync Theme to Micro Frontends` workflow.

**Common statuses:**

- ✅ **Success** - All syncs completed
- ⚠️ **Partial** - Some MFEs synced, some failed (usually due to branch protection)
- ❌ **Failed** - Build or sync failed

### If Workflow Fails

1. Click the failed workflow run
2. Check the step that failed
3. Read error message
4. Common issues:
   - **Build failed:** Run `npm run lint` locally
   - **Sync failed:** Check git credentials/token
   - **Permission denied:** Verify GitHub token permissions

---

## MFE Pull Request Management

### What You'll See

When workflow completes, each MFE gets a commit with:

```
Commit: chore(theme): sync theme updates from @ctms/theme@2.2.0

Files changed:
- src/theme-shared/** (all theme files)
- version.ts (sync metadata)
```

**If branch protection is enabled:** You'll get a PR instead

### PR Review Checklist

Before merging theme update PR:

- ✅ Verify files in `src/theme-shared/` look correct
- ✅ Check version.ts has correct sync timestamp
- ✅ Run local tests to ensure no conflicts
- ✅ Check Tailwind classes still work in your MFE
- ✅ Test theme switching still works

### Merging the PR

```bash
# In your MFE repo
git checkout develop
git pull origin develop  # Get the PR

# Deploy
npm run build
npm run deploy  # or your deployment command
```

---

## Configuration Management

### .mfe-config.json

Controls sync behavior:

```json
{
  "theme_package": "@ctms/theme",
  "theme_version": "2.2.0",
  "mfes": [
    {
      "name": "mfe-dashboard",
      "url": "https://github.com/Mohitsagar236/mfe-dashboard.git",
      "branch": "develop",
      "enabled": true
    }
  ],
  "sync": {
    "enabled": true,
    "method": "git-submodule",
    "auto_update": false
  }
}
```

### Disabling/Enabling Sync for a Specific MFE

```json
{
  "name": "mfe-admin",
  "enabled": false // Disable syncing
}
```

Then commit:

```bash
git add .mfe-config.json
git commit -m "chore: disable sync for mfe-admin"
git push origin develop
```

### Adding a New MFE

```bash
npm run sync:add-mfe https://github.com/owner/new-mfe.git new-mfe-name
```

Or manually edit `.mfe-config.json`:

```json
{
  "name": "mfe-reports",
  "url": "https://github.com/owner/mfe-reports.git",
  "branch": "develop",
  "enabled": true
}
```

---

## Rollback Procedures

### Scenario 1: Theme Has Bug in Production

**Problem:** A theme change broke colors in all MFEs

**Solution:**

1. **Fix the theme locally**

   ```bash
   # In thmc2
   # Fix src/theme/themes/dark.ts or other theme files
   # Test locally: npm run dev
   ```

2. **Commit and push**

   ```bash
   git add src/theme/
   git commit -m "fix: correct color values in dark theme"
   git push origin develop
   ```

3. **Workflow automatically syncs to all MFEs**
   - Wait for GitHub Actions to complete
   - Review and merge PRs in each MFE
   - New version deployed

### Scenario 2: Need to Rollback to Previous Theme

**Problem:** New theme broke user experience, need to go back

**Solution:**

1. **Revert the commit**

   ```bash
   # In thmc2
   git log --oneline  # Find the bad commit
   git revert <commit-hash>
   git push origin develop
   ```

2. **Workflow syncs reverted theme to all MFEs**
   - All MFEs automatically get reverted theme
   - No action needed in MFEs

3. **Fix the issue, commit properly**
   ```bash
   # Don't use revert again, fix the actual files
   git add src/theme/
   git commit -m "chore: fix theme issue properly"
   git push origin develop
   ```

### Scenario 3: MFE Merge Conflict

**Problem:** Theme PR can't merge due to conflicts in MFE

**Solution:**

1. **Checkout PR branch in MFE**

   ```bash
   cd your-mfe
   git fetch origin
   git checkout theme-sync-branch  # or PR branch name
   ```

2. **Resolve conflicts**
   - Open conflicted files
   - Keep theme-shared changes (usually safe)
   - Remove MFE-specific customizations if conflicting
3. **Commit and push**

   ```bash
   git add .
   git commit -m "chore: resolve merge conflict with theme sync"
   git push origin branch-name
   ```

4. **Merge PR**
   - GitHub will allow merge once conflicts resolved

---

## Monitoring & Health Checks

### Manual Health Check

Run this in the main theme repo:

```bash
# Check if all MFEs are reachable
node scripts/check-mfe-health.js
```

### What to Monitor

1. **Workflow execution**
   - Time to complete (should be <30 minutes)
   - Success rate (should be 100%)

2. **MFE PRs**
   - Time to merge (should be <24 hours)
   - Conflicts (should be rare)

3. **Bundle size**
   - Monitor with `npm run theme:check-size`
   - Alert if increases >10%

### Setting Up Alerts

#### Option 1: GitHub Actions Notifications

GitHub automatically emails when workflows fail.

To disable:

- Settings → Actions → Notifications → Off

#### Option 2: Slack Integration

Add to `.github/workflows/theme-sync.yml`:

```yaml
- name: Notify Slack on Failure
  if: failure()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d '{
        "text": "❌ Theme sync failed",
        "attachments": [{
          "color": "danger",
          "text": "Check: https://github.com/Mohitsagar236/thmc2/actions"
        }]
      }'
```

Then add `SLACK_WEBHOOK` to GitHub secrets.

---

## Troubleshooting

### Issue: Workflow Stuck or Timeout

**Symptom:** Workflow running for >1 hour, not completing

**Solution:**

1. Cancel the workflow in GitHub Actions
2. Check for stuck git processes: `git status`
3. Manually sync: `npm run sync:mfes`

### Issue: All MFEs Getting Duplicate Commits

**Symptom:** Same theme sync commit appearing multiple times

**Solution:**

1. Check workflow triggers in `.github/workflows/theme-sync.yml`
2. Verify no duplicate cron jobs
3. Check if theme files are changing on every commit

### Issue: MFE Won't Accept Theme Updates

**Symptom:** PR can't merge, says "merge conflict" or "no fast forward"

**Solution:**

```bash
# In the MFE repo
git fetch origin
git checkout theme-update-branch
git rebase origin/develop
git push --force-with-lease origin theme-update-branch
```

### Issue: Sync Stopped Working

**Symptom:** No syncs happening after previous successful runs

**Check:**

1. Are files in `src/theme/**` actually changing?
2. Check `.mfe-config.json` - are MFEs still enabled?
3. Check GitHub Actions logs for error messages
4. Verify `.github/workflows/theme-sync.yml` still exists

**Fix:**

```bash
# Verify workflow is valid
npm run sync:setup  # This recreates workflow file if missing
git add .
git commit -m "chore: restore workflow"
git push origin develop
```

---

## Deployment Checklist

### Before Deploying Theme Update

- [ ] Tested theme locally: `npm run dev`
- [ ] All themes validated: `npm run theme:validate`
- [ ] Bundle size acceptable: `npm run theme:check-size`
- [ ] No lint errors: `npm run lint`
- [ ] No format issues: `npm run format:check`
- [ ] Git history is clean: `git log --oneline`

### Before Merging MFE PR

- [ ] Reviewed theme changes in `src/theme-shared/`
- [ ] Tested theme switching locally
- [ ] Checked Tailwind classes still work
- [ ] No other conflicts with MFE code
- [ ] All tests pass: `npm run test` (if applicable)

### After Deploying

- [ ] Verify theme loads in production
- [ ] Check all CSS variables applied correctly
- [ ] Test theme switching in production
- [ ] Monitor for 24 hours for any issues
- [ ] Update CHANGELOG.md with version info

---

## Performance Optimization

### Reduce Sync Time

1. **Disable unused MFEs** in `.mfe-config.json`
2. **Use shallow clone** in workflow (already done)
3. **Run syncs in parallel** (workflow already does this)

Current parallel MFEs: 3 (dashboard, admin, user-profile)
Time: ~10-15 minutes total

### Reduce Bundle Size

```bash
npm run theme:check-size

# If too large:
# - Remove unused themes from catalogue.json
# - Optimize images/assets
# - Use CSS modules instead of inline styles
```

---

## Production Runbook

### Daily Checks

```bash
# Check workflow status
open https://github.com/Mohitsagar236/thmc2/actions

# Check MFE merge status
open https://github.com/Mohitsagar236/mfe-dashboard/pulls
open https://github.com/Mohitsagar236/mfe_admin/pulls
open https://github.com/Mohitsagar236/mfe_user_profile/pulls
```

### Weekly Tasks

1. Review failed workflows (if any)
2. Monitor bundle size trend
3. Check for pending theme updates in any MFE

### Monthly Tasks

1. Archive old workflow runs
2. Update documentation if processes changed
3. Review and optimize sync performance

---

## Rollout Timeline

| Phase                | Duration  | Owner      | Notes                   |
| -------------------- | --------- | ---------- | ----------------------- |
| Commit to main repo  | Immediate | Developer  | Just `git push`         |
| GitHub Actions build | 3-5 min   | Automation | Validates theme         |
| Sync to MFEs         | 5-10 min  | Automation | Updates each repo       |
| Review PR in MFEs    | 1-24 hrs  | MFE Team   | Merge at your pace      |
| Deploy to production | 5-30 min  | MFE Team   | Your deployment process |
| Monitor              | Ongoing   | DevOps     | Watch for issues        |

**Total time to production: 1-2 days**

---

## Support & Escalation

**For theme issues:**

1. Check this guide
2. Check `.github/workflows/theme-sync.yml` for logs
3. Create issue in main repo: https://github.com/Mohitsagar236/thmc2/issues

**For MFE issues:**

1. Check MFE_INTEGRATION_GUIDE.md
2. Create issue in MFE repo
3. Ask theme team for support

**Urgent issues:**

- Slack: #theme-team (if available)
- Email: theme-team@company.com (if available)

---

**Last Updated:** April 2026
**Maintainer:** Theme Platform Team

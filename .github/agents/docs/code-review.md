# 👀 Code Review Agent

## Overview

The Code Review Agent acts as a senior developer performing thorough code reviews on every pull request. It leverages the Librarian's knowledge to ensure new code follows established patterns and conventions.

## What It Does

The Code Review Agent:

- **Reviews Pull Requests**: Examines every PR for code quality, logic errors, and security issues
- **Checks Pattern Compliance**: Ensures new code follows established conventions
- **Identifies Issues**: Categorizes problems by severity (Blockers, Warnings, Suggestions)
- **Provides Constructive Feedback**: Offers specific, actionable suggestions
- **Acknowledges Good Work**: Highlights well-implemented code that follows conventions
- **Context-Aware Analysis**: Uses Codebase Librarian knowledge for informed reviews

## How It Works

### Trigger Events

The Code Review Agent runs when:
- **PR Opened** - Initial review of new pull requests
- **PR Synchronized** - Reviews new commits pushed to existing PRs

**Note**: Does not run on PRs with the `agent-generated` label to avoid reviewing its own work.

### Workflow Process

1. **Checkout Code**: Gets the PR branch with full diff context
2. **Generate Diff**: Creates unified diff between base and head branches
3. **Load Knowledge**: Retrieves `codebase-map.json` from the Librarian
4. **Gather Context**: Collects related files from modified directories
5. **AI Analysis**: Uses Claude to perform deep code review
6. **Post Comment**: Adds review findings as a PR comment
7. **Track Reviews**: Logs reviewed PRs for analytics

### Review Categories

The agent classifies issues into three severity levels:

**🔴 Blockers** (Must Fix):
- Logic errors that will cause bugs
- Security vulnerabilities
- Breaking changes without migration path
- Data corruption risks

**🟠 Warnings** (Should Fix):
- Deviations from established patterns
- Missing error handling
- Performance concerns
- Missing tests for complex logic
- Architectural violations

**🟡 Suggestions** (Nice to Have):
- Cleaner alternatives
- Better naming
- Documentation improvements
- Code organization enhancements

## Configuration Options

### In `.github/agents/config.yml`

```yaml
agents:
  code-review:
    enabled: true
    
    # Review settings
    auto_approve: false           # Never auto-approve PRs
    comment_threshold: "medium"   # Only comment on medium+ severity
    
    # Skip these file patterns
    skip_patterns:
      - "*.min.js"
      - "*.generated.*"
      - "*.lock"
      - "package-lock.json"
      - "yarn.lock"
      - "dist/**"
      - "build/**"
    
    # Prioritize review of these areas
    focus_areas:
      - "src/api/**"
      - "src/lib/**"
      - "src/auth/**"
      - "src/services/**"
```

### Workflow Configuration

Located at `.github/workflows/agent-code-review.yml`

Key settings:
- Runs only on `opened` and `synchronize` PR events
- Requires `pull-requests: write` permission
- Uses conditional to skip agent-generated PRs
- Includes PR diff and changed files as context

## Review Output Format

The agent posts a comment with this structure:

```markdown
## 👀 Code Review Agent

### Summary
[One paragraph explaining what the PR does and readiness to merge]

### Review

#### 🔴 Blockers

**[BLOCKER]** `src/api/users.ts:42`

> ```typescript
> const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
> ```

**Issue**: SQL injection vulnerability - user input directly in query

**Suggestion**: Use parameterized query:
```typescript
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
```

**Context**: This violates the secure data access pattern established in codebase-map

---

#### 🟠 Warnings

[Similar format for warnings]

---

#### 🟡 Suggestions

[Similar format for suggestions]

---

### What's Done Well

- ✅ Follows component structure pattern from `src/components`
- ✅ Proper error handling matches project conventions

---

### Verdict

🔄 **Request Changes**: Has 2 blockers that must be addressed before merge
```

## How It Uses Librarian Knowledge

The Code Review Agent references `codebase-map.json` to:

1. **Check Pattern Compliance**
   - Compares new code against documented patterns
   - Validates naming conventions match project standards
   - Ensures error handling follows established approach

2. **Architectural Review**
   - Verifies code is in the correct layer
   - Checks import dependencies are appropriate
   - Identifies violations of architectural boundaries

3. **Hot Spot Awareness**
   - Extra scrutiny for changes in fragile areas
   - Considers historical bug patterns
   - Flags complexity in already complex files

4. **Context-Rich Feedback**
   - References established conventions when noting deviations
   - Provides examples from the codebase
   - Explains *why* something matters in this specific project

## Best Practices

### For Repository Maintainers

1. **Keep Librarian Updated**: Ensure codebase-map.json is current
2. **Refine Skip Patterns**: Add generated files to skip list
3. **Adjust Thresholds**: Tune comment_threshold based on noise level
4. **Review Agent Feedback**: Periodically check if reviews are accurate
5. **Update Focus Areas**: Add critical paths that need extra attention

### For Pull Request Authors

1. **Address Blockers First**: Fix 🔴 blockers before requesting re-review
2. **Consider Warnings**: 🟠 warnings usually indicate real issues
3. **Evaluate Suggestions**: 🟡 suggestions are optional but often valuable
4. **Respond to Context**: Agent references patterns for a reason
5. **Request Clarification**: Comment if agent feedback is unclear

## Customization

### Adjusting Review Strictness

Edit `.github/agents/prompts/code-review.md` to:
- Change severity criteria for different issue types
- Add project-specific checks
- Adjust tone of feedback
- Emphasize particular concerns (security, performance, etc.)

### Adding Custom Checks

Extend the workflow to run additional checks:

```yaml
- name: Run custom linter
  run: npm run lint:custom
  
- name: Check for common mistakes
  run: |
    # Custom validation script
    ./scripts/validate-pr.sh
```

Then include results in agent context.

### Integration with Status Checks

Configure the workflow to set PR status:

```yaml
- name: Set status check
  if: steps.review.outputs.has_blockers == 'true'
  run: |
    gh pr review ${{ github.event.pull_request.number }} \
      --request-changes \
      --body "Agent found blockers"
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Troubleshooting

### Agent Not Commenting

**Symptoms**: PR opened but no review comment appears

**Solutions**:
- Check Actions tab for workflow failures
- Verify `ANTHROPIC_API_KEY` is valid
- Ensure PR doesn't have `agent-generated` label
- Check `pull-requests: write` permission is granted
- Review workflow run logs for API errors

### Too Many False Positives

**Symptoms**: Agent reports non-issues as problems

**Solutions**:
- Add patterns to `skip_patterns` for generated files
- Adjust `comment_threshold` to reduce noise
- Update prompt to be less strict
- Ensure Librarian knowledge is accurate
- Add clarifying patterns to codebase-map

### Missing Real Issues

**Symptoms**: Agent doesn't catch known problems

**Solutions**:
- Lower `comment_threshold` setting
- Add specific checks to focus_areas
- Update prompt with examples of issues to catch
- Ensure diff includes enough context
- Check if files are being skipped unintentionally

### Inconsistent Reviews

**Symptoms**: Similar code gets different feedback

**Solutions**:
- Ensure Librarian runs regularly to maintain fresh knowledge
- Review and standardize conventions in codebase-map
- Update prompt with clear, consistent criteria
- Consider adding deterministic checks before AI review

## Advanced Features

### Review Metrics

Track review effectiveness:

```yaml
- name: Log review metrics
  run: |
    echo "PR: ${{ github.event.pull_request.number }}" >> metrics.log
    echo "Blockers: ${{ steps.review.outputs.blocker_count }}" >> metrics.log
    echo "Warnings: ${{ steps.review.outputs.warning_count }}" >> metrics.log
```

### Conditional Review Depth

Adjust review depth based on PR size:

```yaml
- name: Determine review level
  id: level
  run: |
    LINES=$(git diff --shortstat | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+')
    if [ "$LINES" -lt 50 ]; then
      echo "depth=detailed" >> $GITHUB_OUTPUT
    else
      echo "depth=focused" >> $GITHUB_OUTPUT
    fi

- name: Run review
  with:
    additional_context: "Review depth: ${{ steps.level.outputs.depth }}"
```

### Multi-Agent Review

Chain multiple review types:

```yaml
- name: Style review
  uses: ./style-checker
  
- name: Security review  
  uses: ./security-scanner
  
- name: AI review
  uses: anthropics/claude-code-action@v1
  with:
    prompt_file: .github/agents/prompts/code-review.md
    context_files: |
      style-report.json
      security-report.json
```

## Performance Considerations

- **Review Time**: Typically 30-90 seconds per PR
- **API Usage**: ~1000-5000 tokens per review (varies with PR size)
- **Rate Limits**: Agent respects GitHub API rate limits
- **Large PRs**: Reviews may be truncated for PRs >500 lines

## Security & Privacy

- Code is sent to Claude API for analysis
- Reviews are posted as public PR comments
- Agent has write access to pull requests
- No code is stored permanently by the agent
- Ensure sensitive code isn't exposed in public repos

## Related Documentation

- [Codebase Librarian](./librarian.md) - Knowledge source for reviews
- [Security Audit Agent](./security-audit.md) - Specialized security reviews
- [Architecture Guardian](./architecture-guardian.md) - Architectural reviews

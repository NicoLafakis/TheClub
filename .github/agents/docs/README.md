# 🤖 Agent Documentation Index

Welcome to the comprehensive documentation for the repository's autonomous agent team. Each agent is a specialized AI assistant designed to help maintain, improve, and monitor the codebase.

## Quick Start

New to the agent system? Start here:

1. **[Setup Guide](../../AGENT.md)** - Initial configuration and secrets
2. **[Agent Philosophy](../../powerhouse-agent-ecosystem.md)** - Understanding the agent ecosystem
3. **Pick an agent below** to learn about its specific capabilities

## The Agent Team

### 📚 [Codebase Librarian](./librarian.md)

**Role**: The Brain | **Schedule**: Nightly + on merge

The institutional memory of the repository. Maintains living documentation of architecture, patterns, and conventions.

**Use Cases**:
- Understanding codebase structure
- Documenting coding patterns
- Tracking file ownership
- Identifying complexity hot spots

**Quick Actions**:
- Run manually: `gh workflow run agent-librarian.yml`
- View knowledge: `.github/agents/knowledge/codebase-map.json`

---

### 👀 [Code Review Agent](./code-review.md)

**Role**: Senior Developer | **Triggers**: Every PR

Reviews pull requests for code quality, pattern compliance, and potential issues.

**Use Cases**:
- Automated code review
- Pattern enforcement
- Early bug detection
- Knowledge sharing

**Quick Actions**:
- Reviews appear automatically on PRs
- Configure thresholds in `config.yml`
- Severity levels: 🔴 Blocker, 🟠 Warning, 🟡 Suggestion

---

### 🧪 [Test Generation Agent](./test-generation.md)

**Role**: QA Engineer | **Triggers**: PRs + daily

Analyzes coverage gaps and generates test suggestions or complete test files.

**Use Cases**:
- Improving test coverage
- Suggesting test cases
- Generating test files
- Identifying untested code

**Quick Actions**:
- Suggests tests on PRs automatically
- Daily coverage analysis at 7am UTC
- Generate for specific file: `gh workflow run agent-test-generation.yml -f target_file="path/to/file.ts"`

---

### 🔒 [Security Audit Agent](./security-audit.md)

**Role**: Security Engineer | **Triggers**: PRs, daily, push to main

Continuous security monitoring with immediate alerts for vulnerabilities.

**Use Cases**:
- Finding security vulnerabilities
- Detecting hardcoded secrets
- Auditing dependencies
- Reviewing auth patterns

**Quick Actions**:
- Run security scan: `gh workflow run agent-security-audit.yml`
- Critical findings trigger email alerts
- View report on PRs or in Issues

---

### 📝 [PR Prep Agent](./pr-prep.md)

**Role**: Technical Writer | **Triggers**: PR opened

Automatically prepares pull requests with descriptions, labels, and reviewer suggestions.

**Use Cases**:
- Generating PR descriptions
- Auto-labeling PRs
- Suggesting reviewers
- Estimating review time

**Quick Actions**:
- Runs automatically on new PRs
- Only activates if PR has no description
- Customize labels in `config.yml`

---

### 🏗️ [Architecture Guardian](./architecture-guardian.md)

**Role**: Staff Engineer | **Triggers**: PRs + daily

Enforces architectural patterns and prevents drift from intended design.

**Use Cases**:
- Enforcing layer boundaries
- Detecting pattern violations
- Monitoring complexity
- Preventing architectural drift

**Quick Actions**:
- Reviews architecture on PRs
- Daily report at 2am UTC
- Configure rules in `config.yml` → `rules.layers`

---

### 🚀 [Release Captain](./release-captain.md)

**Role**: Release Manager | **Triggers**: Push to main, daily

Manages releases, changelogs, and version bumps based on conventional commits.

**Use Cases**:
- Generating changelogs
- Version bump suggestions
- Preparing release PRs
- Tracking unreleased changes

**Quick Actions**:
- Create release: `gh workflow run agent-release-captain.yml -f release_type=minor`
- Daily check at 8am UTC
- Follows semantic versioning

---

### 🚨 [Incident Responder](./incident-responder.md)

**Role**: On-Call Engineer | **Schedule**: 24/7 monitoring

Monitors production, diagnoses issues, attempts auto-fixes, and escalates critical problems.

**Use Cases**:
- Production monitoring
- Incident diagnosis
- Automatic remediation
- Alert escalation

**Quick Actions**:
- Health checks every 5 minutes
- Manual investigation: `gh workflow run agent-incident-responder.yml`
- Critical incidents trigger email alerts

---

## Common Workflows

### Daily Operations

```
00:00 UTC - Librarian updates codebase knowledge
01:00 UTC - Security performs deep scan
02:00 UTC - Architecture Guardian analyzes patterns
06:00 UTC - Daily digest email sent
07:00 UTC - Test Agent analyzes coverage
08:00 UTC - Release Captain checks for releases
```

### Pull Request Flow

```
1. PR Opened
   ↓
2. PR Prep adds description & labels
   ↓
3. Code Review analyzes code
   ↓
4. Security Audit scans for vulnerabilities
   ↓
5. Architecture Guardian checks patterns
   ↓
6. Test Agent suggests test coverage
   ↓
7. Developer addresses feedback
   ↓
8. PR Merged
```

### Incident Response Flow

```
1. Health check fails OR error webhook received
   ↓
2. Incident Responder diagnoses issue
   ↓
3. Determine severity (Critical, High, Medium, Low)
   ↓
4. Auto-fix attempt (if simple & safe)
   ├─ Success → Create PR with fix
   └─ Complex → Create issue + email alert
```

## Configuration

### Global Configuration

Main config file: `.github/agents/config.yml`

```yaml
global:
  timezone: "America/New_York"
  working_hours:
    start: 9
    end: 18
  notifications:
    email_enabled: true
    daily_digest: true

agents:
  # Enable/disable individual agents
  librarian:
    enabled: true
  code-review:
    enabled: true
  # ... etc
```

### Required Secrets

Set these in GitHub Settings → Secrets → Actions:

| Secret | Purpose | Required By |
|--------|---------|-------------|
| `ANTHROPIC_API_KEY` | Claude API access | All agents |
| `RESEND_API_KEY` | Email notifications | Incident Responder, Security |
| `ALERT_EMAIL` | Incident alerts | Incident Responder |
| `TEAM_EMAIL` | Daily digests | Orchestrator |
| `SECURITY_EMAIL` | Security alerts | Security Audit |
| `APP_HEALTH_URL` | Health checks | Incident Responder |
| `RAILWAY_TOKEN` | Railway monitoring | Incident Responder (optional) |
| `RAILWAY_PROJECT_ID` | Railway project | Incident Responder (optional) |

### Customizing Agents

Each agent can be customized by:

1. **Editing Configuration** - `.github/agents/config.yml`
2. **Modifying Prompts** - `.github/agents/prompts/{agent-name}.md`
3. **Adjusting Workflows** - `.github/workflows/agent-{agent-name}.yml`

See individual agent documentation for specific customization options.

## Knowledge Layer

All agents share a common knowledge store in `.github/agents/knowledge/`:

```
.github/agents/knowledge/
├── codebase-map.json       # Architecture and patterns (Librarian)
├── patterns.json           # Coding conventions
├── ownership.json          # File ownership data
├── history.json           # Change history
└── incident-history.csv   # Incident tracking
```

### Knowledge Flow

```
┌────────────────────────────────────────────────────┐
│              SHARED KNOWLEDGE STORE                 │
│                                                     │
│  Librarian (writes) → Knowledge Files → All agents │
│                                         (read)      │
└────────────────────────────────────────────────────┘
```

Agents use this shared knowledge to:
- Understand project context
- Follow established patterns
- Make informed decisions
- Provide relevant feedback

## Agent Communication

Agents don't directly communicate, but coordinate through:

1. **Shared Knowledge** - Common understanding from Librarian
2. **GitHub Events** - Triggered by PR/push/schedule events
3. **Labels** - Agent-generated labels on PRs/issues
4. **Dependencies** - Some agents reference others' outputs

## Monitoring Agent Activity

### View Agent Runs

**GitHub Actions Tab**:
- See all workflow runs
- View logs for each agent
- Check success/failure status

**GitHub CLI**:
```bash
# List recent runs
gh run list --workflow=agent-code-review.yml

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

### Agent-Generated Items

**Pull Requests**:
- Label: `agent-generated`
- Created by agents (Test Gen, Release Captain)

**Issues**:
- Label: `automated`
- Created by agents (Security, Architecture, Incident)

**Comments**:
- Header identifies which agent commented
- Example: "## 👀 Code Review Agent"

## Disabling Agents

### Temporarily

Via GitHub Actions UI:
1. Go to Actions tab
2. Select agent workflow
3. Click "..." menu
4. Select "Disable workflow"

### Permanently

Edit `.github/agents/config.yml`:
```yaml
agents:
  code-review:
    enabled: false  # Disables this agent
```

## Troubleshooting

### Common Issues

**Agent not running**:
- Check if workflow is enabled
- Verify secrets are set
- Check trigger conditions match event
- Review Actions tab for errors

**Poor agent performance**:
- Ensure Librarian runs regularly
- Update knowledge files
- Adjust prompts for clarity
- Check API rate limits

**Too many notifications**:
- Adjust severity thresholds
- Configure quiet hours
- Tune comment thresholds
- Disable non-critical alerts

### Getting Help

1. **Check agent documentation** - See individual agent pages above
2. **Review workflow logs** - Actions tab for detailed errors
3. **Check configuration** - Verify `config.yml` syntax
4. **Validate secrets** - Ensure all required secrets are set

## Best Practices

### For Teams

1. **Start Small** - Enable one or two agents first
2. **Review Output** - Check agent feedback quality initially
3. **Tune Configuration** - Adjust based on team needs
4. **Provide Feedback** - Update prompts if agents miss patterns
5. **Keep Knowledge Fresh** - Run Librarian after major changes

### For Developers

1. **Read Agent Feedback** - Agents provide valuable insights
2. **Address Blockers** - Fix critical issues before merge
3. **Use Conventional Commits** - Helps Release Captain
4. **Write Clear Code** - Makes agent analysis more accurate
5. **Add Context** - Comments help agents understand intent

## Performance & Cost

### Execution Time

| Agent | Typical Runtime | Frequency |
|-------|----------------|-----------|
| Librarian | 2-5 min | Nightly |
| Code Review | 30-90 sec | Per PR |
| Test Generation | 1-3 min | Per PR |
| Security Audit | 2-5 min | Per PR + Daily |
| PR Prep | 30-60 sec | Per PR |
| Architecture | 2-4 min | Per PR + Daily |
| Release Captain | 30-60 sec | Daily |
| Incident Responder | 30-90 sec | As needed |

### API Usage

**Anthropic Claude API**:
- ~10,000-50,000 tokens per day (varies by activity)
- Cost depends on model tier and usage
- Can configure rate limits if needed

**GitHub API**:
- Uses GitHub Actions quota
- Free for public repos
- Included in GitHub plan for private repos

## Security & Privacy

- All code analysis happens via Claude API (external)
- Knowledge files are stored in repository
- No persistent storage of code outside repo
- Secrets handled via GitHub Secrets (encrypted)
- Audit logs available in Actions tab

## Next Steps

1. **Read Setup Guide**: [AGENT.md](../../AGENT.md)
2. **Pick an Agent**: Choose one from above to deep-dive
3. **Configure**: Customize for your project
4. **Enable**: Turn on one agent to start
5. **Monitor**: Watch first few runs
6. **Tune**: Adjust based on results
7. **Expand**: Add more agents gradually

## Additional Resources

- **[Full Implementation Guide](../../powerhouse-agent-ecosystem.md)** - Complete technical details
- **[Incident Runbook](../../INCIDENT_RUNBOOK.md)** - Incident response procedures
- **[GitHub Actions Docs](https://docs.github.com/en/actions)** - Workflow reference
- **[Claude API Docs](https://docs.anthropic.com/)** - AI integration details

---

**Questions?** Check individual agent documentation or review workflow files in `.github/workflows/`

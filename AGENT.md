# AGENT.md - TheClub AI Agent Configuration

> 🤖 **This repository has an autonomous agent team that works alongside human developers.**

## Overview

This document defines the AI agents and their behaviors for TheClub repository. These agents are designed to work as autonomous team members, maintaining and improving the codebase.

## Quick Start

1. **Set up secrets** in GitHub repository settings (Settings → Secrets → Actions):
   - `ANTHROPIC_API_KEY` (required)
   - `RESEND_API_KEY` (for email notifications)
   - `ALERT_EMAIL` (for incident alerts)
   - `APP_HEALTH_URL` (for health monitoring)

2. **Enable workflows** in the Actions tab

3. **Trigger the Librarian** to initialize knowledge:
   ```bash
   gh workflow run agent-librarian.yml
   ```

## Agent Philosophy

Our agents aren't just automation scripts—they're designed to behave like dedicated team members:

- 🕐 **Working Hours** - Agents follow schedules appropriate to their roles
- 💬 **Communication** - Agents share context through a knowledge layer
- 🆘 **Escalation** - Agents know when to ask for human help
- 📚 **Learning** - Agents build institutional knowledge over time
- ⚡ **Proactive** - Agents improve things, not just react

---

## The Agent Team

| Agent | Role | Emoji | Description |
|-------|------|-------|-------------|
| Codebase Librarian | 🧠 The Brain | 📚 | Maintains living documentation and codebase knowledge |
| Code Review Agent | 👀 Senior Dev | 🔍 | Reviews PRs with full context awareness |
| Test Generation Agent | 🧪 QA Engineer | ✅ | Generates and maintains test coverage |
| Security Audit Agent | 🔒 Security | 🛡️ | Scans for vulnerabilities and security issues |
| PR Prep Agent | 📝 Tech Writer | 📋 | Prepares and formats pull requests |
| Architecture Guardian | 🏗️ Staff Engineer | 🎯 | Enforces patterns and architecture decisions |
| Release Captain | 🚀 Release Manager | 📦 | Manages releases and changelogs |
| Incident Responder | 🚨 On-Call | 🔥 | Monitors for and responds to incidents |

---

## Agent Behaviors

### Codebase Librarian 🧠

**Schedule:** Nightly at midnight UTC, plus on every merge to main

**Responsibilities:**
- Map the architecture and module structure
- Document coding patterns and conventions
- Track file ownership and activity
- Identify hot spots and areas of concern

**Outputs:**
- `codebase-map.json` - Living map of the codebase
- `patterns.json` - Documented patterns and conventions
- `ownership.json` - Who owns what

---

### Code Review Agent 👀

**Triggers:** PR opened, PR synchronized

**Responsibilities:**
- Review code against established patterns
- Check for logic errors and security issues
- Verify naming conventions and structure
- Provide constructive feedback

**Review Categories:**
- 🔴 **Blockers** - Must fix before merge
- 🟠 **Warnings** - Should be addressed
- 🟡 **Suggestions** - Nice to have improvements

---

### Test Generation Agent 🧪

**Triggers:** PR opened, scheduled weekly

**Responsibilities:**
- Analyze test coverage gaps
- Generate test suggestions for new code
- Identify edge cases and boundary conditions
- Maintain test quality standards

---

### Security Audit Agent 🔒

**Schedule:** Daily deep scan at 01:00 UTC, plus on every PR

**Responsibilities:**
- Scan for known vulnerabilities
- Check for secrets in code
- Review authentication/authorization patterns
- Flag potential security issues

**Severity Levels:**
- 🔴 **Critical** - Immediate attention required
- 🟠 **High** - Should be fixed soon
- 🟡 **Medium** - Fix when possible
- ⚪ **Low** - Informational

---

### PR Prep Agent 📝

**Triggers:** PR opened (before other agents)

**Responsibilities:**
- Format PR descriptions
- Add appropriate labels
- Link related issues
- Generate change summaries

---

### Architecture Guardian 🏗️

**Schedule:** Daily at 02:00 UTC, plus on large PRs

**Responsibilities:**
- Detect architectural drift
- Enforce layer boundaries
- Flag circular dependencies
- Monitor for anti-patterns

---

### Release Captain 🚀

**Schedule:** Daily at 08:00 UTC

**Responsibilities:**
- Track unreleased changes
- Generate changelog entries
- Suggest version bumps
- Prepare release notes

---

### Incident Responder 🚨

**Schedule:** 24/7 continuous monitoring

**Responsibilities:**
- Monitor for errors and anomalies
- Diagnose root causes
- Coordinate incident response
- Document incidents for postmortem

---

## Knowledge Layer

All agents share a common knowledge store:

```
.github/agents/knowledge/
├── codebase-map.json    # Architecture and structure
├── patterns.json        # Coding patterns
├── ownership.json       # File ownership
└── history.json         # Incident and change history
```

### Knowledge Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED KNOWLEDGE                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Codebase │  │Patterns │  │Ownership│  │ History │        │
│  │  Map    │  │         │  │         │  │         │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │Librarian│  │ Review  │  │Guardian │  │Incident │
   │ (write) │  │ (read)  │  │ (r/w)   │  │ (write) │
   └─────────┘  └─────────┘  └─────────┘  └─────────┘
```

---

## Daily Schedule (UTC)

| Time | Activity |
|------|----------|
| 00:00 | 🧠 Librarian: Nightly codebase scan |
| 01:00 | 🔒 Security: Deep vulnerability scan |
| 02:00 | 🏗️ Architecture: Pattern analysis |
| 06:00 | 📊 Daily digest email |
| 07:00 | 🧪 Test Agent: Coverage analysis |
| 08:00 | 🚀 Release Captain: Check unreleased changes |
| 09:00-17:00 | Active monitoring (event-driven) |
| 17:00 | 📊 End-of-day summary |
| 23:00 | 🧹 Cleanup: Archive old issues |

**🚨 Incident Responder runs 24/7**

---

## Event Response

| Event | Agents | Priority | Response Time |
|-------|--------|----------|---------------|
| PR Opened | PR Prep → Review → Security → Arch → Test | High | 5 min |
| Push to main | Release Captain, Security | High | 2 min |
| Push to feature | Review (light), Test Gen | Medium | 10 min |
| Error detected | Incident Responder | Critical | 30 sec |
| Issue opened | Librarian, Review | Medium | 15 min |

---

## Escalation Policy

Agents escalate to humans when:

1. **Uncertainty** - Confidence below threshold
2. **Conflict** - Multiple valid approaches exist
3. **Severity** - Critical security or breaking changes
4. **Scope** - Changes too large for automated review
5. **Error** - Agent encounters unexpected failure

### Escalation Channels

- GitHub Issues (tagged with `needs-human`)
- Email notifications (configurable)
- Slack/Discord webhooks (optional)

---

## Configuration

### Required Secrets

```yaml
ANTHROPIC_API_KEY: Your Anthropic API key for Claude
# Optional
NOTIFICATION_EMAIL: Email for alerts
SLACK_WEBHOOK_URL: Slack webhook for notifications
```

### Customization

Edit `.github/agents/config.yml` to customize:

```yaml
agents:
  code-review:
    enabled: true
    auto_approve: false  # Require human approval
    severity_threshold: warning
    
  security-audit:
    enabled: true
    block_on_critical: true
    
  test-generation:
    enabled: true
    coverage_threshold: 80
```

---

## Getting Started

1. **Copy the agent workflows** to `.github/workflows/`
2. **Set up secrets** in repository settings
3. **Create knowledge directory** at `.github/agents/knowledge/`
4. **Configure agents** in `.github/agents/config.yml`
5. **Run Librarian** manually to initialize knowledge base

## Required Secrets

| Secret | Description | Required |
|--------|-------------|----------|
| `ANTHROPIC_API_KEY` | Claude API key | ✅ Yes |
| `RESEND_API_KEY` | Resend email API key | For notifications |
| `ALERT_EMAIL` | Email for incident alerts | For notifications |
| `TEAM_EMAIL` | Email for daily digests | For notifications |
| `SECURITY_EMAIL` | Email for security alerts | For notifications |
| `RAILWAY_TOKEN` | Railway API token | For Railway integration |
| `RAILWAY_PROJECT_ID` | Railway project ID | For Railway integration |
| `APP_HEALTH_URL` | Your app's base URL | For health checks |

## File Structure

```
.github/
├── workflows/
│   ├── agent-librarian.yml
│   ├── agent-code-review.yml
│   ├── agent-test-generation.yml
│   ├── agent-security-audit.yml
│   ├── agent-pr-prep.yml
│   ├── agent-architecture-guardian.yml
│   ├── agent-release-captain.yml
│   ├── agent-incident-responder.yml
│   └── agent-orchestrator.yml
├── agents/
│   ├── config.yml
│   ├── knowledge/
│   │   ├── codebase-map.json
│   │   ├── patterns.json
│   │   ├── ownership.json
│   │   ├── history.json
│   │   └── incident-history.csv
│   ├── prompts/
│   │   ├── librarian.md
│   │   ├── code-review.md
│   │   ├── test-generation.md
│   │   ├── security-audit.md
│   │   ├── pr-prep.md
│   │   ├── architecture-guardian.md
│   │   ├── release-captain.md
│   │   └── incident-responder.md
│   ├── scripts/
│   │   ├── package.json
│   │   └── send-notification.js
│   └── templates/
│       ├── incident-email.html
│       ├── daily-digest.html
│       └── escalation-email.html
└── AGENT.md
```

---

## Contributing

When adding new agents:

1. Create workflow file in `.github/workflows/agent-{name}.yml`
2. Create prompt in `.github/agents/prompts/{name}.md`
3. Update this document with agent description
4. Add to daily schedule if applicable
5. Define escalation criteria

---

## Disabling Agents

**Temporarily**: Go to Actions → find workflow → "..." → "Disable workflow"

**Permanently**: Edit `.github/agents/config.yml` and set `enabled: false`

---

## References

- **📚 [Comprehensive Agent Documentation](.github/agents/docs/README.md)** - Detailed docs for each agent type
- Full implementation details: [powerhouse-agent-ecosystem.md](powerhouse-agent-ecosystem.md)
- Incident runbook: [INCIDENT_RUNBOOK.md](.github/INCIDENT_RUNBOOK.md)
- GitHub Actions documentation
- Claude API documentation

## Agent-Specific Documentation

For detailed information about each agent, including configuration options, examples, and troubleshooting:

- [📚 Codebase Librarian](.github/agents/docs/librarian.md) - Architecture mapping and knowledge maintenance
- [👀 Code Review Agent](.github/agents/docs/code-review.md) - Automated code review with pattern enforcement
- [🧪 Test Generation Agent](.github/agents/docs/test-generation.md) - Test coverage analysis and generation
- [🔒 Security Audit Agent](.github/agents/docs/security-audit.md) - Vulnerability scanning and security monitoring
- [📝 PR Prep Agent](.github/agents/docs/pr-prep.md) - Automated PR descriptions and labeling
- [🏗️ Architecture Guardian](.github/agents/docs/architecture-guardian.md) - Architectural pattern enforcement
- [🚀 Release Captain](.github/agents/docs/release-captain.md) - Release management and changelog generation
- [🚨 Incident Responder](.github/agents/docs/incident-responder.md) - 24/7 production monitoring and incident response

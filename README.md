# 🤖 TheClub - Autonomous Agent Team for GitHub

> Transform your GitHub repository into a workspace where AI agents work alongside humans as dedicated team members.

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/NicoLafakis/TheClub/agent-orchestrator.yml)](https://github.com/NicoLafakis/TheClub/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## What is TheClub?

TheClub is a complete implementation of an autonomous AI agent ecosystem for GitHub repositories. Instead of just automation scripts, these agents behave like real team members with:

- 🕐 **Working hours and schedules** - Agents operate on realistic timelines
- 💬 **Shared knowledge** - Agents communicate through a collaborative knowledge layer
- 🆘 **Smart escalation** - Agents know when to ask humans for help
- 📚 **Continuous learning** - Agents build institutional knowledge over time
- ⚡ **Proactive improvement** - Agents don't just react, they improve

## Meet the Team

| Agent | Role | What They Do |
|-------|------|-------------|
| 📚 **Codebase Librarian** | Knowledge Manager | Maps architecture, documents patterns, tracks ownership |
| 🔍 **Code Review Agent** | Senior Developer | Reviews PRs with full context awareness and established patterns |
| ✅ **Test Generation Agent** | QA Engineer | Analyzes coverage gaps, generates test suggestions, identifies edge cases |
| 🛡️ **Security Audit Agent** | Security Engineer | Scans for vulnerabilities, checks for secrets, reviews auth patterns |
| 📋 **PR Prep Agent** | Technical Writer | Formats PRs, adds labels, links issues, generates summaries |
| 🎯 **Architecture Guardian** | Staff Engineer | Enforces patterns, detects drift, flags anti-patterns |
| 📦 **Release Captain** | Release Manager | Tracks changes, generates changelogs, prepares release notes |
| 🔥 **Incident Responder** | On-Call Engineer | Monitors 24/7, diagnoses issues, coordinates responses |

## Quick Start

### Prerequisites

- GitHub repository with Actions enabled
- Anthropic API key (Claude)

### Setup (5 minutes)

1. **Clone this repository or copy the `.github` folder** to your project

2. **Set up required secrets** in your GitHub repository (Settings → Secrets → Actions):
   ```
   ANTHROPIC_API_KEY (required)
   ```

3. **Optional secrets** for enhanced functionality:
   ```
   RESEND_API_KEY          # For email notifications
   ALERT_EMAIL             # For incident alerts
   TEAM_EMAIL              # For daily digests
   SECURITY_EMAIL          # For security alerts
   APP_HEALTH_URL          # For health monitoring
   RAILWAY_TOKEN           # For Railway integration
   RAILWAY_PROJECT_ID      # For Railway project
   ```

4. **Enable GitHub Actions** in your repository

5. **Initialize the knowledge base** by triggering the Librarian:
   ```bash
   gh workflow run agent-librarian.yml
   ```

6. **Done!** Your agents are now active and will start working on their schedules.

## How It Works

### Daily Schedule (UTC)

| Time | Activity |
|------|----------|
| 00:00 | 📚 Librarian scans codebase |
| 01:00 | 🛡️ Security deep scan |
| 02:00 | 🎯 Architecture analysis |
| 06:00 | 📊 Daily digest email |
| 07:00 | ✅ Test coverage analysis |
| 08:00 | 📦 Release check |
| 09:00-17:00 | 🔍 Active monitoring |
| 17:00 | 📊 End-of-day summary |
| 23:00 | 🧹 Cleanup old issues |

**🔥 Incident Responder monitors 24/7**

### Event-Driven Actions

- **PR Opened** → PR Prep → Code Review → Security → Architecture → Tests
- **Push to main** → Release Captain + Security scan
- **Error Detected** → Incident Responder (30 sec response)
- **Issue Opened** → Librarian + Review assignment

### Knowledge Sharing

Agents collaborate through a shared knowledge base:

```
.github/agents/knowledge/
├── codebase-map.json      # Architecture and structure
├── patterns.json          # Coding patterns and conventions
├── ownership.json         # File ownership tracking
└── history.json           # Incident and change history
```

This allows agents to learn from each other and maintain context across activities.

## Features

### 🧠 Intelligent Code Review
- Context-aware feedback based on your codebase patterns
- Categorized comments: Blockers, Warnings, Suggestions
- Links to relevant documentation and examples

### 🔒 Continuous Security
- Daily vulnerability scans
- Secret detection in code
- Authentication/authorization review
- Automatic escalation for critical issues

### 🧪 Smart Test Generation
- Coverage gap analysis
- Edge case identification
- Test quality standards enforcement
- Weekly test health reports

### 🏗️ Architecture Governance
- Pattern enforcement
- Dependency cycle detection
- Anti-pattern flagging
- Architectural drift monitoring

### 📦 Release Management
- Automated changelog generation
- Version bump suggestions
- Release note preparation
- Change tracking

### 🚨 Incident Response
- 24/7 monitoring
- Automatic diagnostics
- Root cause analysis
- Incident documentation

## Configuration

Customize agent behavior in `.github/agents/config.yml`:

```yaml
agents:
  code-review:
    enabled: true
    auto_approve: false
    severity_threshold: warning
    
  security-audit:
    enabled: true
    block_on_critical: true
    
  test-generation:
    enabled: true
    coverage_threshold: 80
```

## Documentation

- **[AGENT.md](AGENT.md)** - Complete agent configuration and behavior guide
- **[powerhouse-agent-ecosystem.md](powerhouse-agent-ecosystem.md)** - Detailed implementation guide
- **[INCIDENT_RUNBOOK.md](.github/INCIDENT_RUNBOOK.md)** - Incident response procedures

## Agent Prompts

Each agent has a specialized prompt that defines its behavior:

- `.github/agents/prompts/librarian.md`
- `.github/agents/prompts/code-review.md`
- `.github/agents/prompts/test-generation.md`
- `.github/agents/prompts/security-audit.md`
- `.github/agents/prompts/pr-prep.md`
- `.github/agents/prompts/architecture-guardian.md`
- `.github/agents/prompts/release-captain.md`
- `.github/agents/prompts/incident-responder.md`

Customize these prompts to match your team's style and requirements.

## Escalation Policy

Agents escalate to humans when they encounter:

1. **Uncertainty** - Confidence below threshold
2. **Conflict** - Multiple valid approaches exist
3. **Severity** - Critical security or breaking changes
4. **Scope** - Changes too large for automated review
5. **Error** - Unexpected failures

Escalations appear as GitHub issues tagged with `needs-human`.

## Disabling Agents

**Temporarily**: Actions → Select workflow → "..." → "Disable workflow"

**Permanently**: Edit `.github/agents/config.yml` and set `enabled: false`

## Use Cases

### For Open Source Projects
- Maintain consistent code quality across contributors
- Provide instant feedback on PRs
- Keep documentation up-to-date
- Monitor security continuously

### For Teams
- Reduce code review burden
- Catch issues early in development
- Maintain architectural standards
- Track and respond to incidents

### For Solo Developers
- Get expert-level code review feedback
- Never miss security vulnerabilities
- Stay on top of releases and changes
- Build better habits through consistent feedback

## Requirements

- GitHub repository with Actions enabled
- Anthropic API key with sufficient credits
- (Optional) Email service for notifications (Resend)
- (Optional) Deployment platform integration (Railway, etc.)

## Contributing

We welcome contributions! To add a new agent:

1. Create workflow file in `.github/workflows/agent-{name}.yml`
2. Create prompt in `.github/agents/prompts/{name}.md`
3. Update `AGENT.md` with agent description
4. Add to daily schedule if applicable
5. Define escalation criteria

## License

MIT License - feel free to use this in your projects!

## Credits

Built with:
- [Claude](https://anthropic.com) by Anthropic
- [GitHub Actions](https://github.com/features/actions)
- [Resend](https://resend.com) for email notifications

## Support

- **Issues**: Open an issue in this repository
- **Discussions**: Join the discussions tab for questions and ideas
- **Email**: For security concerns, please email privately

---

**Ready to add AI teammates to your repository?** Get started in 5 minutes! ⚡

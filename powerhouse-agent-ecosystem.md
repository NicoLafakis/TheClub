# Powerhouse Agent Ecosystem - Complete Implementation Guide

## Overview

This document provides complete specifications for implementing an autonomous agent team that works in your repository like a group of dedicated employees. These agents operate on schedules, respond to events, collaborate through shared knowledge, and escalate issues when human intervention is needed.

### Philosophy

These aren't just scripts that run on triggers. They're designed to feel like coworkers:

- They have **working hours** and **schedules**
- They **communicate** with each other through a shared knowledge layer
- They **escalate** appropriately when stuck or when something needs human attention
- They **learn** about your codebase over time
- They **proactively** improve things, not just react

### The Team

| Agent | Role | Personality |
|-------|------|-------------|
| **Codebase Librarian** | 🧠 The Brain | Quiet, always watching, knows everything |
| **Code Review Agent** | 👀 Senior Developer | Thorough, constructive, context-aware |
| **Test Generation Agent** | 🧪 QA Engineer | Paranoid about edge cases, coverage-focused |
| **Security Audit Agent** | 🔒 Security Engineer | Vigilant, zero-tolerance for risks |
| **PR Prep Agent** | 📝 Technical Writer | Organized, communication-focused |
| **Architecture Guardian** | 🏗️ Staff Engineer | Big-picture thinker, pattern enforcer |
| **Release Captain** | 🚀 Release Manager | Process-oriented, changelog perfectionist |
| **Incident Responder** | 🚨 On-Call Engineer | Alert, diagnostic, knows when to escalate |

---

## Architecture

### Directory Structure

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
│   │   └── history.json
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
│   │   ├── orchestrator.ts
│   │   ├── knowledge-store.ts
│   │   ├── railway-monitor.ts
│   │   ├── notification-service.ts
│   │   └── agent-runner.ts
│   └── templates/
│       ├── incident-email.html
│       ├── daily-digest.html
│       └── escalation-email.html
├── AGENTS.md
└── INCIDENT_RUNBOOK.md
```

### Shared Knowledge Layer

All agents read from and write to a shared knowledge store. This is what makes them "smart" about your specific codebase.

```
┌─────────────────────────────────────────────────────────────────┐
│                     KNOWLEDGE STORE                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ Codebase    │ │ Patterns &  │ │ File        │ │ Incident   │ │
│  │ Map         │ │ Conventions │ │ Ownership   │ │ History    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
        ▲                 ▲                 ▲               ▲
        │                 │                 │               │
   ┌────┴────┐      ┌─────┴─────┐     ┌─────┴─────┐   ┌─────┴─────┐
   │Librarian│      │Code Review│     │ Arch.     │   │ Incident  │
   │ (writes)│      │  (reads)  │     │ Guardian  │   │ Responder │
   └─────────┘      └───────────┘     └───────────┘   └───────────┘
```

---

## Agent Schedules & Behaviors

### Daily Schedule (All Times UTC)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ HOUR │ AGENT ACTIVITY                                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ 00:00│ 🧠 Librarian: Nightly codebase scan & knowledge update            │
│ 01:00│ 🔒 Security: Deep vulnerability scan                               │
│ 02:00│ 🏗️ Architecture: Pattern analysis & drift detection               │
│ 03:00│ (quiet hours)                                                      │
│ 04:00│ (quiet hours)                                                      │
│ 05:00│ (quiet hours)                                                      │
│ 06:00│ 📊 Orchestrator: Generate daily digest email                       │
│ 07:00│ 🧪 Test Agent: Coverage analysis & test suggestions               │
│ 08:00│ 🚀 Release Captain: Check for unreleased changes                  │
│ 09:00│ Active monitoring begins (all agents responsive to events)        │
│  ... │ Event-driven: PR opened, commits pushed, etc.                     │
│ 17:00│ 📊 Orchestrator: End-of-day summary (if activity occurred)        │
│ 18:00│ Reduced monitoring (critical events only)                         │
│ 23:00│ 🧹 Cleanup: Archive old issues, close stale agent PRs             │
└──────────────────────────────────────────────────────────────────────────┘

🚨 Incident Responder: 24/7 monitoring - never sleeps
```

### Event Response Matrix

| Event | Responding Agents | Priority | Max Response Time |
|-------|-------------------|----------|-------------------|
| PR Opened | PR Prep → Code Review → Security → Architecture → Test Gen | High | 5 minutes |
| Push to main | Release Captain, Security | High | 2 minutes |
| Push to feature branch | Code Review (light), Test Gen | Medium | 10 minutes |
| Railway error detected | Incident Responder → (escalation chain) | Critical | 30 seconds |
| Issue opened | Librarian (context), Code Review (if bug) | Medium | 15 minutes |
| Scheduled (daily) | All agents per schedule | Low | N/A |
| Manual trigger | Any agent | Varies | 1 minute |

---

## Agent 1: Codebase Librarian

### Purpose
The brain of the operation. Maintains a living map of the codebase that other agents query for context.

### Schedule
- **Nightly (00:00 UTC)**: Full codebase scan
- **On PR merge**: Incremental update
- **On demand**: When other agents request fresh context

### Workflow File: `.github/workflows/agent-librarian.yml`

```yaml
name: Codebase Librarian

on:
  schedule:
    - cron: '0 0 * * *'  # Nightly at midnight UTC
  push:
    branches: [main, master]
  workflow_dispatch:
  repository_dispatch:
    types: [librarian-refresh]

permissions:
  contents: write
  pull-requests: read
  issues: read

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          npm install -g typescript ts-node
          cd .github/agents/scripts && npm install

      - name: Gather codebase metrics
        id: metrics
        run: |
          # Count files by type
          echo "ts_files=$(find . -name '*.ts' -not -path './node_modules/*' | wc -l)" >> $GITHUB_OUTPUT
          echo "js_files=$(find . -name '*.js' -not -path './node_modules/*' | wc -l)" >> $GITHUB_OUTPUT
          echo "py_files=$(find . -name '*.py' -not -path './venv/*' | wc -l)" >> $GITHUB_OUTPUT
          
          # Get directory structure
          find . -type d -not -path './node_modules/*' -not -path './.git/*' -not -path './dist/*' | head -100 > dirs.txt
          
          # Get all exports
          grep -rh "^export " --include="*.ts" --include="*.js" . 2>/dev/null | head -500 > exports.txt
          
          # Get all imports  
          grep -rh "^import " --include="*.ts" --include="*.js" . 2>/dev/null | head -1000 > imports.txt
          
          # Get file change frequency (last 90 days)
          git log --since="90 days ago" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -100 > hot-files.txt
          
          # Get contributors per file area
          for dir in src lib app components; do
            if [ -d "$dir" ]; then
              echo "=== $dir ===" >> ownership.txt
              git shortlog -sn --since="180 days ago" -- "$dir" | head -5 >> ownership.txt
            fi
          done

      - name: Build codebase map
        run: |
          cat > codebase-context.txt << 'EOF'
          # Codebase Analysis Context
          
          ## File Counts
          TypeScript: ${{ steps.metrics.outputs.ts_files }}
          JavaScript: ${{ steps.metrics.outputs.js_files }}
          Python: ${{ steps.metrics.outputs.py_files }}
          
          ## Directory Structure
          $(cat dirs.txt)
          
          ## Exports (sample)
          $(head -100 exports.txt)
          
          ## Import Patterns (sample)
          $(head -200 imports.txt)
          
          ## Hot Files (most changed recently)
          $(cat hot-files.txt)
          
          ## Ownership
          $(cat ownership.txt 2>/dev/null || echo "No ownership data")
          EOF

      - name: Run Librarian Analysis
        id: analysis
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt_file: .github/agents/prompts/librarian.md
          context_files: codebase-context.txt package.json tsconfig.json
          output_format: json
          output_file: .github/agents/knowledge/codebase-map.json

      - name: Commit knowledge update
        run: |
          git config user.name "Codebase Librarian"
          git config user.email "librarian@agents.local"
          git add .github/agents/knowledge/
          git diff --staged --quiet || git commit -m "📚 Librarian: Update codebase knowledge [skip ci]"
          git push
```

### Prompt File: `.github/agents/prompts/librarian.md`

```markdown
# Codebase Librarian

You are the Codebase Librarian - the institutional memory of this repository. Your job is to understand the codebase deeply and maintain knowledge that helps other agents do their jobs better.

## Your Responsibilities

1. **Map the Architecture**
   - Identify major modules/packages and their purposes
   - Understand the dependency graph between components
   - Recognize the tech stack and frameworks in use

2. **Document Patterns**
   - How does error handling work here?
   - What's the naming convention?
   - How are tests organized?
   - What's the component/module structure pattern?

3. **Track Ownership**
   - Who works on which areas?
   - Which areas are actively developed vs stable?
   - Where are the knowledge silos?

4. **Identify Hot Spots**
   - Which files change most often?
   - Which areas have had bugs?
   - Where is complexity accumulating?

## Output Format

Generate a JSON document with this structure:

```json
{
  "lastUpdated": "ISO timestamp",
  "summary": "2-3 sentence overview of this codebase",
  "techStack": {
    "primary": ["TypeScript", "React", "Node.js"],
    "frameworks": ["Next.js", "Prisma"],
    "infrastructure": ["Vercel", "PostgreSQL"]
  },
  "architecture": {
    "type": "monolith|monorepo|microservices",
    "layers": [
      {"name": "UI", "path": "src/components", "purpose": "React components"},
      {"name": "API", "path": "src/api", "purpose": "API routes"}
    ],
    "entryPoints": ["src/index.ts", "src/app/page.tsx"]
  },
  "patterns": {
    "errorHandling": "Description of how errors are handled",
    "stateManagement": "How state is managed",
    "dataFetching": "How data is fetched",
    "testing": "How tests are organized and written",
    "naming": "Naming conventions observed"
  },
  "ownership": {
    "areas": [
      {"path": "src/components", "primaryContributors": ["user1"], "activity": "high"}
    ]
  },
  "hotspots": {
    "frequentlyChanged": ["src/api/routes.ts", "src/utils/helpers.ts"],
    "complex": ["src/lib/parser.ts"],
    "fragile": []
  },
  "conventions": [
    "Use PascalCase for components",
    "API routes return { data, error } objects",
    "Tests live next to source files as *.test.ts"
  ],
  "warnings": [
    "Large file src/utils/everything.ts should be split",
    "Circular dependency between A and B"
  ]
}
```

## Guidelines

- Be specific - reference actual file paths and patterns
- Be honest - if the codebase has issues, note them
- Be helpful - include information that would help a new developer
- Update incrementally - preserve useful historical knowledge
- Stay factual - don't invent patterns that aren't there
```

---

## Agent 2: Code Review Agent

### Purpose
Reviews every PR with full codebase context from the Librarian.

### Triggers
- PR opened
- PR synchronized (new commits)

### Workflow File: `.github/workflows/agent-code-review.yml`

```yaml
name: Code Review Agent

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    # Don't run on PRs from agents
    if: "!contains(github.event.pull_request.labels.*.name, 'agent-generated')"
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get PR diff
        id: diff
        run: |
          git diff origin/${{ github.base_ref }}...HEAD > pr-diff.txt
          git diff --name-only origin/${{ github.base_ref }}...HEAD > changed-files.txt
          echo "file_count=$(wc -l < changed-files.txt)" >> $GITHUB_OUTPUT

      - name: Load codebase knowledge
        id: knowledge
        run: |
          if [ -f ".github/agents/knowledge/codebase-map.json" ]; then
            echo "has_knowledge=true" >> $GITHUB_OUTPUT
          else
            echo "has_knowledge=false" >> $GITHUB_OUTPUT
          fi

      - name: Get related code context
        run: |
          # For each changed file, get related files from the same directory
          while read file; do
            dir=$(dirname "$file")
            find "$dir" -maxdepth 1 -name "*.ts" -o -name "*.js" -o -name "*.py" 2>/dev/null | head -5
          done < changed-files.txt | sort -u > related-files.txt

      - name: Run Code Review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt_file: .github/agents/prompts/code-review.md
          context_files: |
            pr-diff.txt
            changed-files.txt
            .github/agents/knowledge/codebase-map.json
          output_mode: pr_comment
          comment_header: "## 👀 Code Review Agent"

      - name: Update review timestamp
        run: |
          echo "${{ github.event.pull_request.number }}" >> .github/agents/knowledge/reviewed-prs.log
```

### Prompt File: `.github/agents/prompts/code-review.md`

```markdown
# Code Review Agent

You are a senior developer performing code review. You have access to the Codebase Librarian's knowledge about this repository's patterns and conventions.

## Context Awareness

Before reviewing, check the codebase-map.json for:
- **Patterns**: Does this code follow established patterns?
- **Conventions**: Does naming/structure match conventions?
- **Architecture**: Is code in the right layer?
- **Hot spots**: Is this touching a fragile area?

## Review Approach

### 1. Understand Intent
Read the diff to understand what the PR is trying to accomplish.

### 2. Check Against Patterns
Using the Librarian's knowledge:
- Does this follow the project's error handling pattern?
- Does it match the established component structure?
- Are imports organized the expected way?

### 3. Identify Issues

**🔴 Blockers** (must fix):
- Logic errors that will cause bugs
- Security vulnerabilities
- Breaking changes without migration

**🟠 Warnings** (should fix):
- Deviations from established patterns
- Missing error handling
- Performance concerns
- Missing tests for complex logic

**🟡 Suggestions** (nice to have):
- Cleaner alternatives
- Better naming
- Documentation improvements

### 4. Acknowledge Good Work
Note 1-2 things done well, especially if they follow conventions.

## Output Format

### Summary
One paragraph: What does this PR do? Is it ready to merge?

### Review

For each issue:

**[BLOCKER/WARNING/SUGGESTION]** `filename:line`

> ```code snippet```

**Issue**: What's wrong

**Suggestion**: How to fix it

**Context**: Why this matters (reference patterns if applicable)

---

### Verdict

- ✅ **Approve**: No blockers, looks good
- 🔄 **Request Changes**: Has blockers that need addressing
- 💬 **Comment**: Has suggestions but can merge as-is

## Guidelines

- Reference the Librarian's knowledge when noting pattern deviations
- Be specific with line numbers
- Provide copy-paste-ready fixes when possible
- Don't nitpick formatting if there are logic issues
- Skip auto-generated files
- If the PR is large (>500 lines), note that and focus on critical issues
```

---

## Agent 3: Test Generation Agent

### Purpose
Suggests and generates tests for new or changed code.

### Triggers
- PR opened/synchronized (suggests tests)
- Manual trigger (generates tests for specific files)
- Daily (identifies coverage gaps)

### Workflow File: `.github/workflows/agent-test-generation.yml`

```yaml
name: Test Generation Agent

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - 'src/**'
      - 'lib/**'
      - 'app/**'
  schedule:
    - cron: '0 7 * * *'  # Daily at 7am UTC
  workflow_dispatch:
    inputs:
      target_file:
        description: 'Specific file to generate tests for'
        required: false
        type: string

permissions:
  contents: write
  pull-requests: write

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check existing coverage
        id: coverage
        run: |
          # Try to run coverage if available
          if [ -f "package.json" ] && grep -q "coverage" package.json; then
            npm ci
            npm run coverage -- --json --outputFile=coverage.json 2>/dev/null || true
          fi
          
          # Find test files
          find . -name "*.test.ts" -o -name "*.spec.ts" -o -name "*.test.js" -o -name "*.spec.js" \
            -not -path "./node_modules/*" > existing-tests.txt
          
          echo "test_count=$(wc -l < existing-tests.txt)" >> $GITHUB_OUTPUT

      - name: Get files needing tests
        id: targets
        run: |
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            # Get changed source files
            git diff --name-only origin/${{ github.base_ref }}...HEAD | \
              grep -E '\.(ts|js|py)$' | \
              grep -v '\.test\.' | \
              grep -v '\.spec\.' | \
              grep -v 'node_modules' > files-to-test.txt
          else
            # Find source files without corresponding test files
            find . -name "*.ts" -o -name "*.js" | \
              grep -v node_modules | \
              grep -v '\.test\.' | \
              grep -v '\.spec\.' | \
              grep -v '\.d\.ts' | \
              while read f; do
                test_file="${f%.*}.test.${f##*.}"
                spec_file="${f%.*}.spec.${f##*.}"
                [ ! -f "$test_file" ] && [ ! -f "$spec_file" ] && echo "$f"
              done > files-to-test.txt
          fi
          
          # Limit to reasonable number
          head -20 files-to-test.txt > targets.txt
          echo "target_count=$(wc -l < targets.txt)" >> $GITHUB_OUTPUT

      - name: Generate test suggestions
        if: steps.targets.outputs.target_count > 0
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt_file: .github/agents/prompts/test-generation.md
          context_files: |
            targets.txt
            existing-tests.txt
            .github/agents/knowledge/codebase-map.json
          source_files_from: targets.txt
          output_mode: ${{ github.event_name == 'pull_request' && 'pr_comment' || 'branch' }}
          branch_name: agent/tests-${{ github.run_number }}
          commit_message: "🧪 Test Agent: Add suggested tests"
          pr_title: "🧪 Test Agent: Suggested tests for coverage gaps"
          pr_labels: agent-generated,tests
```

### Prompt File: `.github/agents/prompts/test-generation.md`

```markdown
# Test Generation Agent

You are a QA engineer who writes thorough, practical tests. Your goal is to improve test coverage while writing tests that actually catch bugs.

## Context

Check the codebase-map.json to understand:
- How tests are organized in this project
- What testing patterns are used
- What test frameworks are available

## Analysis Approach

For each file:

### 1. Identify Testable Units
- Exported functions
- Public class methods
- React components
- API endpoints

### 2. Categorize by Risk
- **High risk**: Business logic, data transformations, auth
- **Medium risk**: Utilities, formatters, validators
- **Low risk**: Simple getters, constants, types

### 3. Design Test Cases

For each function, consider:
- **Happy path**: Normal inputs → expected outputs
- **Edge cases**: Empty, null, undefined, boundary values
- **Error cases**: Invalid inputs, failures
- **Integration points**: Mocks needed for external deps

## Output Format

### For PR Comments (suggesting tests):

## 🧪 Test Suggestions

### High Priority

**`src/utils/calculate.ts`** - `calculateTotal()`

This function handles money calculations and has no tests.

Suggested test cases:
1. Normal calculation with valid items
2. Empty array input
3. Negative quantities (should throw?)
4. Floating point precision (money!)

**Complexity**: Medium | **Risk**: High

---

### Medium Priority
...

---

### For Branch Output (generating tests):

Create actual test files following the project's testing patterns.

Example for a TypeScript project with Jest:

```typescript
// src/utils/calculate.test.ts
import { calculateTotal, applyDiscount } from './calculate';

describe('calculateTotal', () => {
  describe('happy path', () => {
    it('calculates total for valid items', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 1 },
      ];
      expect(calculateTotal(items)).toBe(25);
    });
  });

  describe('edge cases', () => {
    it('returns 0 for empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('handles single item', () => {
      expect(calculateTotal([{ price: 10, quantity: 1 }])).toBe(10);
    });
  });

  describe('error handling', () => {
    it('throws for negative quantity', () => {
      expect(() => calculateTotal([{ price: 10, quantity: -1 }]))
        .toThrow('Invalid quantity');
    });
  });
});
```

## Guidelines

- Match the existing test style in the project
- Use the same assertion library/patterns
- Don't over-mock - test real behavior when possible
- Focus on behavior, not implementation
- Prioritize high-risk code
- Include both unit and integration tests where appropriate
- Add comments explaining non-obvious test cases
```

---

## Agent 4: Security Audit Agent

### Purpose
Continuous security monitoring with immediate alerts for critical issues.

### Triggers
- PR opened/synchronized
- Push to main (post-merge scan)
- Daily deep scan (1am UTC)
- On demand

### Workflow File: `.github/workflows/agent-security-audit.yml`

```yaml
name: Security Audit Agent

on:
  pull_request:
    types: [opened, synchronize]
  push:
    branches: [main, master]
  schedule:
    - cron: '0 1 * * *'  # Daily at 1am UTC
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write
  security-events: write
  issues: write

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Gitleaks
        id: gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        continue-on-error: true

      - name: Run npm audit
        id: npm-audit
        if: hashFiles('package.json') != ''
        run: |
          npm audit --json > npm-audit.json 2>/dev/null || true
          CRITICAL=$(jq '.metadata.vulnerabilities.critical // 0' npm-audit.json)
          HIGH=$(jq '.metadata.vulnerabilities.high // 0' npm-audit.json)
          echo "critical=$CRITICAL" >> $GITHUB_OUTPUT
          echo "high=$HIGH" >> $GITHUB_OUTPUT
        continue-on-error: true

      - name: Collect security-relevant files
        id: files
        run: |
          # Patterns that indicate security-sensitive code
          PATTERNS="auth|login|password|token|secret|api[_-]?key|credential|session|cookie|jwt|oauth|encrypt|decrypt|hash|permission|role|admin"
          
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD | grep -iE "$PATTERNS" | tr '\n' ' ')
          else
            FILES=$(find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" \) \
              -not -path "./node_modules/*" | xargs grep -l -iE "$PATTERNS" 2>/dev/null | head -30 | tr '\n' ' ')
          fi
          echo "files=$FILES" >> $GITHUB_OUTPUT

      - name: Run Security Analysis
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt_file: .github/agents/prompts/security-audit.md
          context_files: |
            npm-audit.json
            ${{ steps.files.outputs.files }}
            .github/agents/knowledge/codebase-map.json
          output_mode: ${{ github.event_name == 'pull_request' && 'pr_comment' || 'issue' }}
          comment_header: "## 🔒 Security Audit"
          issue_title: "🔒 Security Audit - ${{ github.sha }}"
          issue_labels: security,automated

      - name: Alert on critical findings
        if: steps.npm-audit.outputs.critical > 0 || steps.gitleaks.outcome == 'failure'
        uses: ./.github/agents/scripts/notify
        with:
          type: security-critical
          message: "Critical security issue detected"
          channel: email
          recipient: ${{ secrets.SECURITY_ALERT_EMAIL }}
```

### Prompt File: `.github/agents/prompts/security-audit.md`

```markdown
# Security Audit Agent

You are a security engineer performing a thorough security review. Your job is to find vulnerabilities before attackers do.

## Severity Levels

- **🔴 CRITICAL**: Exploitable now, data at risk, requires immediate action
- **🟠 HIGH**: Significant risk, should fix before merge/deploy
- **🟡 MEDIUM**: Real risk but harder to exploit, fix soon
- **🟢 LOW**: Minor issues, defense in depth

## Audit Categories

### 1. Secrets & Credentials
- Hardcoded secrets, API keys, passwords
- Secrets in logs or error messages
- Private keys, certificates
- Connection strings with credentials
- .env files with real values

**Check for patterns**:
```
password|passwd|pwd|secret|token|api[_-]?key|auth|credential|private[_-]?key
```

### 2. Injection Vulnerabilities

**SQL Injection**:
- String concatenation in queries
- Template literals with user input
- Missing parameterized queries

**Command Injection**:
- exec(), spawn(), system() with user input
- Unsanitized shell commands

**XSS**:
- dangerouslySetInnerHTML
- Unescaped user content in HTML
- DOM manipulation with user strings

**Path Traversal**:
- User input in file paths
- Missing path sanitization

### 3. Authentication & Authorization
- Missing auth checks on routes
- Broken access control
- Insecure password handling
- JWT issues (no expiry, weak signing)
- Session fixation

### 4. Data Exposure
- Sensitive data in logs
- PII in error messages
- Excessive API responses
- Missing encryption for sensitive data

### 5. Dependency Vulnerabilities
- Check npm-audit.json for known CVEs
- Focus on critical and high severity
- Note if exploitable in this context

## Output Format

## 🔒 Security Audit Results

**Overall Risk**: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

### Findings

#### 🔴 CRITICAL

**[SEC-001] Hardcoded API Key**
- **File**: `src/services/api.ts:15`
- **Finding**: Production API key hardcoded in source
- **Risk**: Key exposed in repository, can be used by attackers
- **Remediation**: 
  1. Rotate the exposed key immediately
  2. Move to environment variable
  3. Add to .gitignore

```typescript
// VULNERABLE
const API_KEY = "sk_live_abc123...";

// FIXED
const API_KEY = process.env.API_KEY;
```

---

#### 🟠 HIGH
...

### Dependency Vulnerabilities

| Package | Version | Severity | CVE | Fix Available |
|---------|---------|----------|-----|---------------|
| lodash | 4.17.15 | Critical | CVE-2021-23337 | 4.17.21 ✅ |

### Recommendations

1. **Immediate**: [what to do now]
2. **Short-term**: [what to do this sprint]
3. **Long-term**: [what to improve over time]

### Clean Areas
Note any security-sensitive areas that were reviewed and found to be properly implemented.

## Guidelines

- False positives > false negatives for security
- Provide specific remediation steps
- Consider the full attack chain
- Note if issues are blocked by other controls
- Reference OWASP when relevant
```

---

## Agent 5: PR Prep Agent

### Purpose
Automatically prepares PRs with descriptions, labels, reviewers, and context.

### Triggers
- PR opened
- Draft PR converted to ready

### Workflow File: `.github/workflows/agent-pr-prep.yml`

```yaml
name: PR Prep Agent

on:
  pull_request:
    types: [opened, ready_for_review]

permissions:
  contents: read
  pull-requests: write

jobs:
  prepare:
    runs-on: ubuntu-latest
    # Only run if PR has no description or minimal description
    if: github.event.pull_request.body == '' || github.event.pull_request.body == null || length(github.event.pull_request.body) < 50
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Gather PR context
        id: context
        run: |
          # Get diff stats
          STATS=$(git diff --stat origin/${{ github.base_ref }}...HEAD | tail -1)
          echo "stats=$STATS" >> $GITHUB_OUTPUT
          
          # Get commit messages
          git log --oneline origin/${{ github.base_ref }}...HEAD > commits.txt
          
          # Get changed files
          git diff --name-only origin/${{ github.base_ref }}...HEAD > changed-files.txt
          
          # Categorize changes
          COMPONENTS=$(grep -c "components/" changed-files.txt 2>/dev/null || echo 0)
          API=$(grep -c "api/" changed-files.txt 2>/dev/null || echo 0)
          TESTS=$(grep -cE "\.test\.|\.spec\." changed-files.txt 2>/dev/null || echo 0)
          DOCS=$(grep -cE "\.md$|docs/" changed-files.txt 2>/dev/null || echo 0)
          
          echo "components=$COMPONENTS" >> $GITHUB_OUTPUT
          echo "api=$API" >> $GITHUB_OUTPUT
          echo "tests=$TESTS" >> $GITHUB_OUTPUT
          echo "docs=$DOCS" >> $GITHUB_OUTPUT
          
          # Estimate review time (rough: 1 min per 20 lines changed)
          LINES=$(git diff --shortstat origin/${{ github.base_ref }}...HEAD | grep -oE '[0-9]+ insertion' | grep -oE '[0-9]+')
          MINUTES=$((${LINES:-0} / 20 + 5))
          echo "review_mins=$MINUTES" >> $GITHUB_OUTPUT

      - name: Find related issues
        id: issues
        run: |
          # Look for issue references in commits and branch name
          BRANCH="${{ github.head_ref }}"
          ISSUES=$(echo "$BRANCH" | grep -oE '#[0-9]+|[0-9]+' | head -3 | tr '\n' ' ')
          
          # Also check commits
          COMMIT_ISSUES=$(grep -ohE '#[0-9]+' commits.txt | sort -u | tr '\n' ' ')
          
          echo "related=$ISSUES $COMMIT_ISSUES" >> $GITHUB_OUTPUT

      - name: Determine suggested reviewers
        id: reviewers
        run: |
          # Get top contributors to changed files
          REVIEWERS=""
          while read file; do
            CONTRIBUTOR=$(git log -1 --format='%an' -- "$file" 2>/dev/null)
            if [ -n "$CONTRIBUTOR" ] && [ "$CONTRIBUTOR" != "${{ github.event.pull_request.user.login }}" ]; then
              REVIEWERS="$REVIEWERS $CONTRIBUTOR"
            fi
          done < changed-files.txt
          
          # Dedupe and limit
          echo "$REVIEWERS" | tr ' ' '\n' | sort | uniq | head -3 | tr '\n' ' ' > reviewers.txt
          echo "suggested=$(cat reviewers.txt)" >> $GITHUB_OUTPUT

      - name: Generate PR description
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt_file: .github/agents/prompts/pr-prep.md
          context_files: |
            commits.txt
            changed-files.txt
            .github/agents/knowledge/codebase-map.json
          additional_context: |
            Stats: ${{ steps.context.outputs.stats }}
            Components changed: ${{ steps.context.outputs.components }}
            API changes: ${{ steps.context.outputs.api }}
            Tests: ${{ steps.context.outputs.tests }}
            Docs: ${{ steps.context.outputs.docs }}
            Estimated review time: ${{ steps.context.outputs.review_mins }} minutes
            Related issues: ${{ steps.issues.outputs.related }}
            Suggested reviewers: ${{ steps.reviewers.outputs.suggested }}
          output_mode: pr_description
          
      - name: Add labels
        uses: actions/github-script@v7
        with:
          script: |
            const labels = [];
            
            // Size labels
            const stats = `${{ steps.context.outputs.stats }}`;
            const insertions = parseInt(stats.match(/(\d+) insertion/)?.[1] || 0);
            if (insertions < 50) labels.push('size/small');
            else if (insertions < 200) labels.push('size/medium');
            else labels.push('size/large');
            
            // Type labels
            if (${{ steps.context.outputs.components }} > 0) labels.push('area/frontend');
            if (${{ steps.context.outputs.api }} > 0) labels.push('area/backend');
            if (${{ steps.context.outputs.tests }} > 0) labels.push('includes/tests');
            if (${{ steps.context.outputs.docs }} > 0) labels.push('includes/docs');
            
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              labels: labels
            });
```

### Prompt File: `.github/agents/prompts/pr-prep.md`

```markdown
# PR Prep Agent

You are a technical writer preparing a pull request for review. Your job is to make it easy for reviewers to understand and review this PR.

## Your Task

Generate a comprehensive PR description that:
1. Explains what changed and why
2. Highlights areas needing careful review
3. Provides testing guidance
4. Links related issues

## Output Format

Generate a PR description in this exact format:

## Summary

[2-3 sentences explaining what this PR does and why]

## Changes

[Bullet list of main changes, grouped logically]

- **[Area]**: Description of change
- **[Area]**: Description of change

## Review Guide

**Estimated review time**: [X] minutes

**Key areas to review**:
1. [File/area] - [What to look for]
2. [File/area] - [What to look for]

**Testing performed**:
- [ ] Unit tests pass
- [ ] Manual testing of [specific feature]
- [ ] [Other relevant testing]

## Related

- Fixes #[issue] (if applicable)
- Related to #[issue] (if applicable)

## Screenshots

[If UI changes, note: "Screenshots needed" or "N/A"]

---

## Guidelines

- Be concise but complete
- Focus on WHAT and WHY, not HOW (code shows how)
- Highlight breaking changes prominently
- Note any deployment considerations
- If the diff is large, summarize rather than list everything
- Use the codebase knowledge to provide context (e.g., "Updates the auth flow introduced in #123")
```

---

## Agent 6: Architecture Guardian

### Purpose
Enforces architectural patterns and prevents drift.

### Triggers
- PR opened/synchronized
- Daily analysis (2am UTC)
- On demand

### Workflow File: `.github/workflows/agent-architecture-guardian.yml`

```yaml
name: Architecture Guardian

on:
  pull_request:
    types: [opened, synchronize]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2am UTC
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Analyze imports and dependencies
        run: |
          # Build import graph
          echo "# Import Analysis" > import-analysis.txt
          
          # Find potential layer violations
          echo "## Potential Layer Violations" >> import-analysis.txt
          
          # Components importing from API directly
          grep -rn "from.*api\|from.*server" --include="*.tsx" --include="*.jsx" src/components 2>/dev/null >> import-analysis.txt || true
          
          # API routes importing from components
          grep -rn "from.*components" --include="*.ts" --include="*.js" src/api 2>/dev/null >> import-analysis.txt || true
          
          # Find circular dependencies (simplified check)
          echo "## Import Patterns" >> import-analysis.txt
          grep -rh "^import " --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null | \
            grep -v node_modules | \
            sed 's/.*from ["\x27]\([^"\x27]*\)["\x27].*/\1/' | \
            sort | uniq -c | sort -rn | head -30 >> import-analysis.txt

      - name: Get changed patterns
        if: github.event_name == 'pull_request'
        run: |
          git diff origin/${{ github.base_ref }}...HEAD > diff.txt
          git diff --name-only origin/${{ github.base_ref }}...HEAD > changed-files.txt

      - name: Run Architecture Analysis
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt_file: .github/agents/prompts/architecture-guardian.md
          context_files: |
            import-analysis.txt
            .github/agents/knowledge/codebase-map.json
            ${{ github.event_name == 'pull_request' && 'diff.txt' || '' }}
          output_mode: ${{ github.event_name == 'pull_request' && 'pr_comment' || 'issue' }}
          comment_header: "## 🏗️ Architecture Review"
          issue_title: "🏗️ Architecture Report - $(date +%Y-%m-%d)"
          issue_labels: architecture,automated
```

### Prompt File: `.github/agents/prompts/architecture-guardian.md`

```markdown
# Architecture Guardian

You are a staff engineer responsible for maintaining architectural integrity. You think in systems and patterns, not just code.

## Your Knowledge

Load the codebase-map.json to understand:
- The intended architecture (layers, modules)
- Established patterns
- Ownership boundaries

## What You Check

### 1. Layer Violations
- UI components calling database directly
- Business logic in UI components
- API routes with UI imports
- Utilities depending on business logic

### 2. Dependency Direction
- Dependencies should flow inward (UI → Business → Data)
- Inner layers should not know about outer layers
- Shared code should be truly shared (no hidden dependencies)

### 3. Pattern Consistency
- Are new components following established patterns?
- Are utilities being created that duplicate existing ones?
- Are new abstractions consistent with existing ones?

### 4. Module Boundaries
- Are modules staying cohesive?
- Is there inappropriate coupling between modules?
- Are interfaces clean and minimal?

### 5. Complexity Accumulation
- Are files growing too large?
- Are functions becoming too complex?
- Is cyclomatic complexity increasing?

## Output Format (PR Comment)

## 🏗️ Architecture Review

### Assessment

**Architectural Health**: 🟢 Clean | 🟡 Minor Issues | 🟠 Needs Discussion | 🔴 Violation

### Findings

#### Layer Violations

**[VIOLATION]** Component directly calls API
- **File**: `src/components/UserList.tsx`
- **Issue**: Imports from `src/api/users` - components should use hooks/services
- **Pattern**: Use `useUsers()` hook instead
- **Impact**: Breaks separation of concerns, harder to test

#### Pattern Deviations

**[WARNING]** New utility duplicates existing
- **New**: `src/utils/formatDate.ts`
- **Existing**: `src/lib/dates.ts` has `formatDate()`
- **Recommendation**: Use existing utility or consolidate

#### Positive Patterns
- ✅ Proper use of service layer for API calls
- ✅ Consistent component structure

### Recommendations

1. [Immediate actions needed]
2. [Follow-up items for tech debt]

---

## Output Format (Scheduled Report)

## 🏗️ Weekly Architecture Report

### Health Score: X/10

### Trends
- Layer violations: ↑ 3 this week (was 5, now 8)
- Duplicate utilities: → stable at 2
- Complex files: ↓ improved (removed 1)

### Top Issues

1. **Growing Complexity**: `src/lib/parser.ts` is now 800 lines
2. **Emerging Pattern**: 3 new components bypass hooks layer

### Module Health

| Module | Cohesion | Coupling | Complexity | Trend |
|--------|----------|----------|------------|-------|
| /components | Good | Low | Medium | → |
| /api | Good | Low | Low | ↓ |
| /lib | Medium | Medium | High | ↑ |

### Recommended Actions

1. Split `src/lib/parser.ts` into focused modules
2. Create ADR for data fetching pattern
3. Review coupling between auth and user modules

---

## Guidelines

- Be pragmatic - perfect architecture doesn't exist
- Focus on trends, not one-off issues
- Acknowledge trade-offs when they exist
- Reference the intended architecture from codebase-map
- Distinguish between "violation" and "evolution"
- Suggest, don't mandate (except for clear violations)
```

---

## Agent 7: Release Captain

### Purpose
Manages releases, changelogs, and version bumps.

### Triggers
- Push to main (checks for unreleased changes)
- Daily check (8am UTC)
- Manual trigger (create release)

### Workflow File: `.github/workflows/agent-release-captain.yml`

```yaml
name: Release Captain

on:
  push:
    branches: [main, master]
  schedule:
    - cron: '0 8 * * *'  # Daily at 8am UTC
  workflow_dispatch:
    inputs:
      release_type:
        description: 'Release type'
        required: true
        type: choice
        options:
          - auto
          - patch
          - minor
          - major

permissions:
  contents: write
  pull-requests: write

jobs:
  check:
    runs-on: ubuntu-latest
    outputs:
      should_release: ${{ steps.check.outputs.should_release }}
      version_bump: ${{ steps.analyze.outputs.bump }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check for unreleased changes
        id: check
        run: |
          # Get last release tag
          LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
          
          if [ -z "$LAST_TAG" ]; then
            echo "No previous release found"
            echo "should_release=true" >> $GITHUB_OUTPUT
            echo "commits_since=all" >> $GITHUB_OUTPUT
          else
            COMMITS=$(git rev-list --count $LAST_TAG..HEAD)
            echo "Commits since $LAST_TAG: $COMMITS"
            
            if [ "$COMMITS" -gt 0 ]; then
              echo "should_release=true" >> $GITHUB_OUTPUT
              git log --oneline $LAST_TAG..HEAD > commits-since-release.txt
            else
              echo "should_release=false" >> $GITHUB_OUTPUT
            fi
          fi
          
          echo "last_tag=$LAST_TAG" >> $GITHUB_OUTPUT

      - name: Analyze commits for version bump
        id: analyze
        if: steps.check.outputs.should_release == 'true'
        run: |
          # Analyze commit messages for conventional commits
          BREAKING=$(grep -ciE "^BREAKING|!" commits-since-release.txt 2>/dev/null || echo 0)
          FEAT=$(grep -ciE "^feat" commits-since-release.txt 2>/dev/null || echo 0)
          FIX=$(grep -ciE "^fix" commits-since-release.txt 2>/dev/null || echo 0)
          
          if [ "${{ github.event.inputs.release_type }}" != "" ] && [ "${{ github.event.inputs.release_type }}" != "auto" ]; then
            echo "bump=${{ github.event.inputs.release_type }}" >> $GITHUB_OUTPUT
          elif [ "$BREAKING" -gt 0 ]; then
            echo "bump=major" >> $GITHUB_OUTPUT
          elif [ "$FEAT" -gt 0 ]; then
            echo "bump=minor" >> $GITHUB_OUTPUT
          else
            echo "bump=patch" >> $GITHUB_OUTPUT
          fi

  prepare-release:
    needs: check
    if: needs.check.outputs.should_release == 'true'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get commits for changelog
        run: |
          LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
          if [ -n "$LAST_TAG" ]; then
            git log --pretty=format:"- %s (%h)" $LAST_TAG..HEAD > commits.txt
          else
            git log --pretty=format:"- %s (%h)" > commits.txt
          fi

      - name: Calculate new version
        id: version
        run: |
          LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
          VERSION=${LAST_TAG#v}
          
          IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"
          
          case "${{ needs.check.outputs.version_bump }}" in
            major)
              NEW_VERSION="$((MAJOR + 1)).0.0"
              ;;
            minor)
              NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
              ;;
            patch)
              NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
              ;;
          esac
          
          echo "new_version=v$NEW_VERSION" >> $GITHUB_OUTPUT
          echo "New version will be: v$NEW_VERSION"

      - name: Generate changelog entry
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt_file: .github/agents/prompts/release-captain.md
          context_files: commits.txt CHANGELOG.md
          additional_context: |
            New version: ${{ steps.version.outputs.new_version }}
            Bump type: ${{ needs.check.outputs.version_bump }}
            Date: $(date +%Y-%m-%d)
          output_mode: file
          output_file: changelog-entry.md

      - name: Update CHANGELOG.md
        run: |
          if [ -f "CHANGELOG.md" ]; then
            # Insert new entry after header
            sed -i '/^# Changelog/r changelog-entry.md' CHANGELOG.md
          else
            echo "# Changelog" > CHANGELOG.md
            cat changelog-entry.md >> CHANGELOG.md
          fi

      - name: Create Release PR
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "🚀 Release ${{ steps.version.outputs.new_version }}"
          title: "🚀 Release ${{ steps.version.outputs.new_version }}"
          body: |
            ## Release ${{ steps.version.outputs.new_version }}
            
            This PR was automatically generated by the Release Captain.
            
            ### Changes
            $(cat commits.txt)
            
            ### Checklist
            - [ ] Changelog looks correct
            - [ ] Version bump is appropriate (${{ needs.check.outputs.version_bump }})
            - [ ] All CI checks pass
            
            Merge this PR to create the release.
          branch: release/${{ steps.version.outputs.new_version }}
          labels: release,agent-generated
```

### Prompt File: `.github/agents/prompts/release-captain.md`

```markdown
# Release Captain

You are a release manager preparing release notes. Your job is to create clear, useful changelogs that help users understand what's new.

## Input

You'll receive:
- List of commits since last release
- Current CHANGELOG.md (for style matching)
- New version number
- Bump type (major/minor/patch)

## Output Format

Generate a changelog entry in this exact format:

```markdown

## [X.X.X] - YYYY-MM-DD

### ⚠️ Breaking Changes
- Description of breaking change and migration path

### ✨ Features
- Feature description (#PR if available)

### 🐛 Bug Fixes
- Fix description (#PR if available)

### 🔧 Improvements
- Improvement description

### 📚 Documentation
- Doc changes

### 🏗️ Internal
- Refactoring, dependencies, CI changes

```

## Guidelines

- **Group by impact**: Breaking → Features → Fixes → Rest
- **Be user-focused**: Describe what changed for users, not implementation details
- **Include PR/issue numbers** when available
- **Omit empty sections**: Don't include sections with no changes
- **Match existing style**: If CHANGELOG.md exists, match its conventions
- **Be concise**: One line per change, expand only for breaking changes
- **Skip noise**: Merge commits, CI fixes, typo corrections can be omitted

## Examples

Good: "Add dark mode support (#123)"
Bad: "Implement DarkModeProvider component with context"

Good: "Fix crash when uploading large files (#456)"
Bad: "Handle edge case in upload handler"

Good: "⚠️ API now requires authentication - see migration guide"
Bad: "Add auth middleware"
```

---

## Agent 8: Incident Responder

### Purpose
Monitors production errors, diagnoses issues, attempts resolution or escalates to humans.

### Triggers
- Railway webhook (error detected)
- Health check failures
- Manual trigger
- Scheduled health verification

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           RAILWAY APP                                    │
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │   App       │───►│   Logs      │───►│  Railway    │                  │
│  │   Error     │    │   Stream    │    │  Webhook    │                  │
│  └─────────────┘    └─────────────┘    └──────┬──────┘                  │
└───────────────────────────────────────────────┼─────────────────────────┘
                                                │
                                                ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                        INCIDENT RESPONDER WORKFLOW                        │
│                                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌───────────┐ │
│  │  Receive    │───►│  Classify   │───►│  Diagnose   │───►│  Decide   │ │
│  │  Alert      │    │  Severity   │    │  Root Cause │    │  Action   │ │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────┬─────┘ │
│                                                                   │       │
│                    ┌──────────────────────────────────────────────┤       │
│                    │                    │                         │       │
│                    ▼                    ▼                         ▼       │
│            ┌─────────────┐      ┌─────────────┐           ┌───────────┐  │
│            │ Auto-Fix    │      │ Create PR   │           │ Escalate  │  │
│            │ (simple)    │      │ (complex)   │           │ to Human  │  │
│            └─────────────┘      └─────────────┘           └─────┬─────┘  │
│                                                                   │       │
└───────────────────────────────────────────────────────────────────┼───────┘
                                                                    │
                                                                    ▼
                                                          ┌─────────────────┐
                                                          │  RESEND EMAIL   │
                                                          │                 │
                                                          │  To: Developer  │
                                                          │  Subject: 🚨    │
                                                          └─────────────────┘
```

### Workflow File: `.github/workflows/agent-incident-responder.yml`

```yaml
name: Incident Responder

on:
  repository_dispatch:
    types: [railway-error, health-check-failed]
  schedule:
    - cron: '*/5 * * * *'  # Health check every 5 minutes
  workflow_dispatch:
    inputs:
      error_message:
        description: 'Error to investigate'
        required: false
        type: string
      error_source:
        description: 'Where the error occurred'
        required: false
        type: string

permissions:
  contents: write
  pull-requests: write
  issues: write

env:
  RAILWAY_API_URL: ${{ secrets.RAILWAY_API_URL }}
  APP_HEALTH_URL: ${{ secrets.APP_HEALTH_URL }}
  RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
  ALERT_EMAIL: ${{ secrets.ALERT_EMAIL }}

jobs:
  # Health check job - runs every 5 minutes
  health-check:
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    outputs:
      healthy: ${{ steps.check.outputs.healthy }}
      error: ${{ steps.check.outputs.error }}
    
    steps:
      - name: Check application health
        id: check
        run: |
          set +e  # Don't exit on error
          
          RESPONSE=$(curl -s -o response.txt -w "%{http_code}" \
            --connect-timeout 10 \
            --max-time 30 \
            "${{ env.APP_HEALTH_URL }}/health" 2>&1)
          
          if [ "$RESPONSE" = "200" ]; then
            echo "healthy=true" >> $GITHUB_OUTPUT
            echo "✅ Health check passed"
          else
            echo "healthy=false" >> $GITHUB_OUTPUT
            echo "error=Health check failed: HTTP $RESPONSE" >> $GITHUB_OUTPUT
            echo "🚨 Health check failed: HTTP $RESPONSE"
            cat response.txt || true
          fi

      - name: Trigger incident response if unhealthy
        if: steps.check.outputs.healthy == 'false'
        uses: peter-evans/repository-dispatch@v2
        with:
          event-type: health-check-failed
          client-payload: '{"error": "${{ steps.check.outputs.error }}", "source": "health-check", "timestamp": "${{ github.run_id }}"}'

  # Main incident response job
  respond:
    if: github.event_name == 'repository_dispatch' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd .github/agents/scripts
          npm install

      - name: Parse incident details
        id: incident
        run: |
          if [ "${{ github.event_name }}" = "repository_dispatch" ]; then
            ERROR='${{ github.event.client_payload.error }}'
            SOURCE='${{ github.event.client_payload.source }}'
          else
            ERROR='${{ github.event.inputs.error_message }}'
            SOURCE='${{ github.event.inputs.error_source }}'
          fi
          
          echo "error=$ERROR" >> $GITHUB_OUTPUT
          echo "source=$SOURCE" >> $GITHUB_OUTPUT
          echo "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $GITHUB_OUTPUT
          
          # Create incident ID
          INCIDENT_ID="INC-$(date +%Y%m%d)-${{ github.run_number }}"
          echo "incident_id=$INCIDENT_ID" >> $GITHUB_OUTPUT

      - name: Fetch Railway logs
        id: logs
        run: |
          # Fetch recent logs from Railway (if available)
          if [ -n "${{ env.RAILWAY_API_URL }}" ]; then
            curl -s -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
              "${{ env.RAILWAY_API_URL }}/logs?limit=100" > railway-logs.json 2>/dev/null || true
          fi
          
          # Also check if we have any error tracking
          echo "Logs fetched" >> $GITHUB_OUTPUT

      - name: Gather diagnostic context
        run: |
          # Get recent changes that might be related
          git log --oneline -20 > recent-commits.txt
          
          # Get files changed in last day
          git diff --name-only HEAD~10 > recent-changes.txt 2>/dev/null || true
          
          # Check for recent deployments (look for release/deploy commits)
          git log --oneline --since="24 hours ago" --grep="release\|deploy" > recent-deploys.txt || true

      - name: Run incident diagnosis
        id: diagnosis
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt_file: .github/agents/prompts/incident-responder.md
          context_files: |
            railway-logs.json
            recent-commits.txt
            recent-changes.txt
            .github/agents/knowledge/codebase-map.json
          additional_context: |
            Incident ID: ${{ steps.incident.outputs.incident_id }}
            Error: ${{ steps.incident.outputs.error }}
            Source: ${{ steps.incident.outputs.source }}
            Timestamp: ${{ steps.incident.outputs.timestamp }}
          output_format: json
          output_file: diagnosis.json

      - name: Parse diagnosis and determine action
        id: action
        run: |
          # Parse the diagnosis
          SEVERITY=$(jq -r '.severity' diagnosis.json)
          CAN_AUTO_FIX=$(jq -r '.canAutoFix' diagnosis.json)
          ROOT_CAUSE=$(jq -r '.rootCause' diagnosis.json)
          FIX_DESCRIPTION=$(jq -r '.fixDescription' diagnosis.json)
          
          echo "severity=$SEVERITY" >> $GITHUB_OUTPUT
          echo "can_auto_fix=$CAN_AUTO_FIX" >> $GITHUB_OUTPUT
          echo "root_cause=$ROOT_CAUSE" >> $GITHUB_OUTPUT
          
          # Determine action
          if [ "$CAN_AUTO_FIX" = "true" ] && [ "$SEVERITY" != "critical" ]; then
            echo "action=auto-fix" >> $GITHUB_OUTPUT
          elif [ "$SEVERITY" = "critical" ]; then
            echo "action=escalate-immediate" >> $GITHUB_OUTPUT
          else
            echo "action=create-issue" >> $GITHUB_OUTPUT
          fi

      - name: Auto-fix (if possible)
        if: steps.action.outputs.action == 'auto-fix'
        run: |
          echo "Attempting auto-fix..."
          FIX_COMMANDS=$(jq -r '.fixCommands[]' diagnosis.json)
          
          # Apply fixes
          eval "$FIX_COMMANDS" || true

      - name: Create fix PR (if auto-fix applied)
        if: steps.action.outputs.action == 'auto-fix'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "🚨 Auto-fix: ${{ steps.incident.outputs.incident_id }}"
          title: "🚨 Incident Auto-Fix: ${{ steps.action.outputs.root_cause }}"
          body: |
            ## Incident Response
            
            **Incident ID**: ${{ steps.incident.outputs.incident_id }}
            **Detected**: ${{ steps.incident.outputs.timestamp }}
            **Severity**: ${{ steps.action.outputs.severity }}
            
            ### Root Cause
            ${{ steps.action.outputs.root_cause }}
            
            ### Applied Fix
            $(jq -r '.fixDescription' diagnosis.json)
            
            ### Verification Needed
            - [ ] Fix addresses the root cause
            - [ ] No regression introduced
            - [ ] Tests pass
            
            ---
            *This PR was automatically generated by the Incident Responder*
          branch: incident/${{ steps.incident.outputs.incident_id }}
          labels: incident,auto-fix,urgent

      - name: Create issue for manual fixes
        if: steps.action.outputs.action == 'create-issue'
        uses: actions/github-script@v7
        with:
          script: |
            const diagnosis = require('./diagnosis.json');
            
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `🚨 Incident: ${diagnosis.rootCause.substring(0, 50)}`,
              body: `## Incident Report

**ID**: ${{ steps.incident.outputs.incident_id }}
**Severity**: ${diagnosis.severity}
**Detected**: ${{ steps.incident.outputs.timestamp }}

### Error
\`\`\`
${{ steps.incident.outputs.error }}
\`\`\`

### Diagnosis

**Root Cause**: ${diagnosis.rootCause}

**Analysis**:
${diagnosis.analysis}

### Recommended Fix

${diagnosis.fixDescription}

### Affected Files
${diagnosis.affectedFiles?.join('\n- ') || 'Unknown'}

### Related Commits
Check recent-commits.txt for potentially related changes.

---
*Generated by Incident Responder*`,
              labels: ['incident', diagnosis.severity, 'needs-investigation']
            });

      - name: Send escalation email
        if: steps.action.outputs.action == 'escalate-immediate' || steps.action.outputs.severity == 'critical'
        run: |
          node .github/agents/scripts/send-notification.js
        env:
          NOTIFICATION_TYPE: incident-escalation
          INCIDENT_ID: ${{ steps.incident.outputs.incident_id }}
          SEVERITY: ${{ steps.action.outputs.severity }}
          ERROR: ${{ steps.incident.outputs.error }}
          ROOT_CAUSE: ${{ steps.action.outputs.root_cause }}
          DIAGNOSIS_FILE: diagnosis.json
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          RECIPIENT_EMAIL: ${{ secrets.ALERT_EMAIL }}

      - name: Log incident to history
        run: |
          # Append to incident history
          echo "${{ steps.incident.outputs.incident_id }},${{ steps.incident.outputs.timestamp }},${{ steps.action.outputs.severity }},${{ steps.action.outputs.action }}" >> .github/agents/knowledge/incident-history.csv
          
          git config user.name "Incident Responder"
          git config user.email "incident@agents.local"
          git add .github/agents/knowledge/incident-history.csv
          git diff --staged --quiet || git commit -m "📊 Log incident ${{ steps.incident.outputs.incident_id }} [skip ci]"
          git push || true
```

### Prompt File: `.github/agents/prompts/incident-responder.md`

```markdown
# Incident Responder

You are an on-call engineer responding to a production incident. Your job is to quickly diagnose the issue, determine if it can be auto-fixed, and either fix it or provide a clear escalation path.

## Incident Context

You'll receive:
- Error message and source
- Recent Railway logs (if available)
- Recent commits
- Recent file changes
- Codebase knowledge from the Librarian

## Your Process

### 1. Classify Severity

- **🔴 Critical**: Service down, data loss, security breach
- **🟠 High**: Major feature broken, significant user impact
- **🟡 Medium**: Feature degraded, workaround exists
- **🟢 Low**: Minor issue, cosmetic, edge case

### 2. Diagnose Root Cause

- Match error patterns to known issues
- Correlate with recent changes
- Check for common causes:
  - Missing environment variables
  - Database connection issues
  - API rate limits
  - Memory/resource exhaustion
  - Dependency failures
  - Code bugs from recent deploys

### 3. Determine Fix Strategy

**Can Auto-Fix** (simple, low-risk):
- Restart service (transient errors)
- Clear cache
- Rollback to previous version
- Update environment variable

**Needs Human** (complex, risky):
- Code changes required
- Database migrations
- Security incidents
- Data corruption
- Multiple services affected

## Output Format

Generate a JSON response:

```json
{
  "incidentId": "INC-YYYYMMDD-XXX",
  "severity": "critical|high|medium|low",
  "rootCause": "Brief description of what went wrong",
  "analysis": "Detailed analysis of the issue including:\n- What triggered it\n- What components are affected\n- Why it happened",
  "affectedFiles": ["src/api/route.ts", "src/lib/db.ts"],
  "relatedCommits": ["abc123", "def456"],
  "canAutoFix": true|false,
  "fixDescription": "Description of the fix",
  "fixCommands": [
    "command to run if auto-fixable"
  ],
  "verificationSteps": [
    "How to verify the fix worked"
  ],
  "escalationReason": "Why this needs human attention (if canAutoFix is false)",
  "preventionRecommendations": [
    "How to prevent this in the future"
  ]
}
```

## Guidelines

- **Speed matters**: Provide a diagnosis quickly, even if incomplete
- **Be conservative with auto-fix**: Only for well-understood, low-risk fixes
- **Always provide verification steps**: How do we know it's fixed?
- **Think about blast radius**: What else might be affected?
- **Learn from history**: Check incident-history.csv for patterns
- **Don't guess**: If uncertain, escalate to human
```

### Notification Script: `.github/agents/scripts/send-notification.js`

```javascript
// .github/agents/scripts/send-notification.js

const fs = require('fs');

async function sendIncidentEmail() {
  const { Resend } = require('resend');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Load diagnosis if available
  let diagnosis = {};
  try {
    diagnosis = JSON.parse(fs.readFileSync(process.env.DIAGNOSIS_FILE, 'utf8'));
  } catch (e) {
    console.log('Could not load diagnosis file');
  }
  
  const incidentId = process.env.INCIDENT_ID;
  const severity = process.env.SEVERITY;
  const error = process.env.ERROR;
  const rootCause = process.env.ROOT_CAUSE || 'Under investigation';
  
  const severityEmoji = {
    'critical': '🔴',
    'high': '🟠',
    'medium': '🟡',
    'low': '🟢'
  };
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .header { background: ${severity === 'critical' ? '#dc2626' : '#f59e0b'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
    .section { margin: 16px 0; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
    .section h3 { margin-top: 0; color: #374151; }
    .error-box { background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 13px; overflow-x: auto; }
    .action-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; }
    .meta { color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${severityEmoji[severity] || '⚠️'} Production Incident: ${incidentId}</h1>
    <p class="meta">Severity: ${severity.toUpperCase()} | Detected: ${new Date().toISOString()}</p>
  </div>
  
  <div class="content">
    <div class="section">
      <h3>Error</h3>
      <div class="error-box">${error}</div>
    </div>
    
    <div class="section">
      <h3>Root Cause Analysis</h3>
      <p>${rootCause}</p>
      ${diagnosis.analysis ? `<p><strong>Details:</strong> ${diagnosis.analysis}</p>` : ''}
    </div>
    
    ${diagnosis.affectedFiles ? `
    <div class="section">
      <h3>Affected Files</h3>
      <ul>
        ${diagnosis.affectedFiles.map(f => `<li><code>${f}</code></li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    <div class="section">
      <h3>Recommended Action</h3>
      <p>${diagnosis.fixDescription || 'Manual investigation required'}</p>
      ${diagnosis.verificationSteps ? `
      <p><strong>Verification:</strong></p>
      <ol>
        ${diagnosis.verificationSteps.map(s => `<li>${s}</li>`).join('')}
      </ol>
      ` : ''}
    </div>
    
    <a href="https://github.com/${process.env.GITHUB_REPOSITORY}/actions" class="action-button">
      View in GitHub Actions
    </a>
  </div>
</body>
</html>
  `;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Incident Responder <incidents@yourdomain.com>',
      to: [process.env.RECIPIENT_EMAIL],
      subject: `${severityEmoji[severity] || '⚠️'} [${severity.toUpperCase()}] Production Incident: ${incidentId}`,
      html: html,
    });
    
    if (error) {
      console.error('Failed to send email:', error);
      process.exit(1);
    }
    
    console.log('Incident notification sent:', data.id);
  } catch (error) {
    console.error('Error sending notification:', error);
    process.exit(1);
  }
}

// Route based on notification type
const type = process.env.NOTIFICATION_TYPE;

switch (type) {
  case 'incident-escalation':
    sendIncidentEmail();
    break;
  default:
    console.log('Unknown notification type:', type);
    process.exit(1);
}
```

---

## Railway Webhook Setup

### Setting Up Railway to Trigger Incidents

Create a webhook endpoint that Railway can call when errors occur.

#### Option 1: GitHub Repository Dispatch (Recommended)

Create a simple webhook receiver that triggers GitHub Actions:

```javascript
// webhook-receiver/index.js (deploy as separate Railway service or Vercel function)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { type, message, service, timestamp } = req.body;
  
  // Verify webhook secret
  const signature = req.headers['x-railway-signature'];
  if (signature !== process.env.RAILWAY_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Only process error events
  if (type !== 'error' && type !== 'crash') {
    return res.status(200).json({ status: 'ignored' });
  }
  
  // Trigger GitHub Actions
  const response = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/dispatches`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'railway-error',
        client_payload: {
          error: message,
          source: service,
          timestamp: timestamp,
          type: type
        }
      })
    }
  );
  
  if (!response.ok) {
    console.error('Failed to trigger GitHub Actions');
    return res.status(500).json({ error: 'Failed to dispatch' });
  }
  
  return res.status(200).json({ status: 'dispatched' });
}
```

#### Option 2: Railway Logs Polling

If webhooks aren't available, poll Railway logs:

```yaml
# Add to agent-incident-responder.yml schedule section
schedule:
  - cron: '*/5 * * * *'  # Every 5 minutes
```

Then check logs in the health-check job for error patterns.

---

## Orchestrator

### Purpose
Coordinates agent activities, prevents conflicts, generates daily summaries.

### Workflow File: `.github/workflows/agent-orchestrator.yml`

```yaml
name: Agent Orchestrator

on:
  schedule:
    - cron: '0 6 * * *'   # Morning digest at 6am UTC
    - cron: '0 17 * * *'  # End of day summary at 5pm UTC
    - cron: '0 23 * * *'  # Nightly cleanup at 11pm UTC
  workflow_dispatch:
    inputs:
      action:
        description: 'Orchestrator action'
        required: true
        type: choice
        options:
          - daily-digest
          - health-report
          - cleanup
          - full-refresh

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  morning-digest:
    if: github.event.schedule == '0 6 * * *' || github.event.inputs.action == 'daily-digest'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Gather agent activity
        run: |
          # Get yesterday's activity
          YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
          
          # PRs opened/merged
          gh pr list --state all --json number,title,state,createdAt,mergedAt,labels | \
            jq --arg date "$YESTERDAY" '[.[] | select(.createdAt | startswith($date))]' > pr-activity.json
          
          # Issues created
          gh issue list --state all --json number,title,state,createdAt,labels | \
            jq --arg date "$YESTERDAY" '[.[] | select(.createdAt | startswith($date))]' > issue-activity.json
          
          # Commits to main
          git log --since="$YESTERDAY" --until="today" --oneline origin/main > commits.txt || true
          
          # Agent-generated items
          gh pr list --label "agent-generated" --json number,title,state > agent-prs.json
          gh issue list --label "automated" --json number,title,state > agent-issues.json
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Load agent knowledge
        run: |
          cat .github/agents/knowledge/*.json 2>/dev/null | jq -s 'add' > combined-knowledge.json || echo "{}" > combined-knowledge.json

      - name: Generate daily digest
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Generate a daily digest email for the development team.
            
            Include:
            1. Repository activity summary (PRs, commits, issues)
            2. Agent activity (what each agent did)
            3. Outstanding items needing attention
            4. Health metrics from codebase knowledge
            
            Format as HTML email.
          context_files: |
            pr-activity.json
            issue-activity.json
            commits.txt
            agent-prs.json
            agent-issues.json
            combined-knowledge.json
          output_file: daily-digest.html

      - name: Send daily digest
        run: |
          node .github/agents/scripts/send-notification.js
        env:
          NOTIFICATION_TYPE: daily-digest
          DIGEST_FILE: daily-digest.html
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          RECIPIENT_EMAIL: ${{ secrets.TEAM_EMAIL }}

  cleanup:
    if: github.event.schedule == '0 23 * * *' || github.event.inputs.action == 'cleanup'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Close stale agent PRs
        run: |
          # Close agent-generated PRs older than 7 days with no activity
          STALE_DATE=$(date -d "7 days ago" +%Y-%m-%dT%H:%M:%SZ)
          
          gh pr list --label "agent-generated" --json number,updatedAt | \
            jq --arg date "$STALE_DATE" '.[] | select(.updatedAt < $date) | .number' | \
            xargs -I {} gh pr close {} --comment "Closing stale agent-generated PR. Please reopen if still needed."
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Archive old issues
        run: |
          # Add "stale" label to automated issues older than 14 days
          STALE_DATE=$(date -d "14 days ago" +%Y-%m-%dT%H:%M:%SZ)
          
          gh issue list --label "automated" --state open --json number,updatedAt | \
            jq --arg date "$STALE_DATE" '.[] | select(.updatedAt < $date) | .number' | \
            xargs -I {} gh issue edit {} --add-label "stale"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  refresh-knowledge:
    if: github.event.inputs.action == 'full-refresh'
    runs-on: ubuntu-latest
    
    steps:
      - name: Trigger Librarian refresh
        uses: peter-evans/repository-dispatch@v2
        with:
          event-type: librarian-refresh

      - name: Wait for Librarian
        run: sleep 120  # Wait 2 minutes for Librarian to complete

      - name: Trigger Architecture Guardian
        run: |
          gh workflow run agent-architecture-guardian.yml
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Configuration

### Main Configuration: `.github/agents/config.yml`

```yaml
# Repository Agent Ecosystem Configuration
# ==========================================

# Global Settings
global:
  # Timezone for scheduling (affects "working hours")
  timezone: "America/New_York"
  
  # Working hours (agents are more active during these times)
  working_hours:
    start: 9   # 9 AM
    end: 18    # 6 PM
  
  # Notification settings
  notifications:
    email_enabled: true
    daily_digest: true
    incident_alerts: true
    
  # Default labels for agent-created items
  labels:
    pr: ["agent-generated"]
    issue: ["automated", "needs-review"]
    incident: ["incident", "urgent"]

# Agent-Specific Configuration
agents:
  librarian:
    enabled: true
    schedule: "0 0 * * *"  # Midnight UTC
    
    # What to track
    track:
      patterns: true
      ownership: true
      complexity: true
      dependencies: true
    
    # Directories to exclude
    exclude:
      - node_modules
      - dist
      - build
      - .git
      - coverage

  code-review:
    enabled: true
    
    # Review settings
    auto_approve: false  # Never auto-approve
    comment_threshold: "medium"  # Only comment on medium+ severity
    
    # Skip these patterns
    skip_patterns:
      - "*.min.js"
      - "*.generated.*"
      - "*.lock"
      - "dist/**"
    
    # Focus areas (prioritize these)
    focus_areas:
      - "src/api/**"
      - "src/lib/**"
      - "src/auth/**"

  test-generation:
    enabled: true
    
    # Auto-generate tests for
    auto_generate_for:
      - "src/utils/**"
      - "src/lib/**"
    
    # Coverage thresholds
    coverage:
      target: 80
      minimum: 60
    
    # Test framework (detected automatically if not set)
    framework: null  # jest, mocha, pytest, etc.

  security-audit:
    enabled: true
    
    # Severity thresholds
    fail_on: "critical"  # Fail PR check on this severity
    comment_on: "medium"  # Comment on this severity and above
    
    # Secret patterns to detect
    secret_patterns:
      - "api[_-]?key"
      - "secret"
      - "password"
      - "token"
      - "credential"
    
    # Files to always scan
    always_scan:
      - "*.env*"
      - "*config*"
      - "*secret*"

  pr-prep:
    enabled: true
    
    # Auto-label based on paths
    path_labels:
      "src/components/**": "frontend"
      "src/api/**": "backend"
      "*.test.*": "tests"
      "*.md": "documentation"
    
    # Size thresholds for labels
    size_labels:
      small: 50   # < 50 lines
      medium: 200 # 50-200 lines
      large: 500  # 200-500 lines
      # > 500 lines = "size/xl"

  architecture-guardian:
    enabled: true
    schedule: "0 2 * * *"  # 2 AM UTC
    
    # Architecture rules
    rules:
      # Layer dependencies (what can import what)
      layers:
        ui: ["services", "utils", "types"]
        services: ["utils", "types", "api"]
        api: ["services", "utils", "types", "db"]
        db: ["utils", "types"]
      
      # Forbidden imports
      forbidden:
        - from: "components"
          to: "api"
        - from: "api"
          to: "components"
    
    # Complexity thresholds
    complexity:
      max_file_lines: 500
      max_function_lines: 50
      max_cyclomatic: 10

  release-captain:
    enabled: true
    schedule: "0 8 * * *"  # 8 AM UTC
    
    # Version bump rules
    version:
      # Keywords in commits that trigger specific bumps
      major_keywords: ["BREAKING", "!:"]
      minor_keywords: ["feat"]
      patch_keywords: ["fix", "patch", "bugfix"]
    
    # Changelog settings
    changelog:
      file: "CHANGELOG.md"
      format: "keepachangelog"  # or "conventional"
    
    # Auto-release settings
    auto_release:
      enabled: false  # Require manual merge of release PR
      branches: ["main"]

  incident-responder:
    enabled: true
    
    # Health check settings
    health_check:
      enabled: true
      interval: "*/5 * * * *"  # Every 5 minutes
      endpoint: "/health"
      timeout: 30
    
    # Severity escalation
    escalation:
      critical: "immediate"  # Email immediately
      high: "15m"           # Wait 15 min before escalating
      medium: "1h"          # Wait 1 hour
      low: "never"          # Don't escalate, just create issue
    
    # Auto-fix settings
    auto_fix:
      enabled: true
      max_severity: "medium"  # Don't auto-fix high/critical
      require_tests: true     # Only auto-fix if tests pass

# Railway Integration
railway:
  enabled: true
  project_id: "${RAILWAY_PROJECT_ID}"
  
  # What to monitor
  monitor:
    logs: true
    metrics: true
    deployments: true
  
  # Error patterns to watch for
  error_patterns:
    - "Error:"
    - "Exception:"
    - "FATAL"
    - "panic:"
    - "Uncaught"

# Notification Settings
notifications:
  resend:
    enabled: true
    from: "agents@yourdomain.com"
  
  recipients:
    incidents: "${ALERT_EMAIL}"
    daily_digest: "${TEAM_EMAIL}"
    security: "${SECURITY_EMAIL}"
  
  # Quiet hours (no non-critical notifications)
  quiet_hours:
    enabled: true
    start: 22  # 10 PM
    end: 7     # 7 AM
    exceptions: ["critical", "security"]
```

---

## Required Secrets

Set these in your repository settings (Settings → Secrets and variables → Actions):

| Secret | Description | Required |
|--------|-------------|----------|
| `ANTHROPIC_API_KEY` | Claude API key | Yes |
| `RESEND_API_KEY` | Resend email API key | For notifications |
| `ALERT_EMAIL` | Email for incident alerts | For notifications |
| `TEAM_EMAIL` | Email for daily digests | For notifications |
| `SECURITY_EMAIL` | Email for security alerts | For notifications |
| `RAILWAY_TOKEN` | Railway API token | For Railway integration |
| `RAILWAY_PROJECT_ID` | Railway project ID | For Railway integration |
| `APP_HEALTH_URL` | Your app's base URL | For health checks |

---

## Documentation File: `.github/AGENTS.md`

```markdown
# 🤖 Repository Agent Team

This repository has an autonomous agent team that works alongside human developers.

## Meet the Team

| Agent | Schedule | What They Do |
|-------|----------|--------------|
| 🧠 **Librarian** | Nightly + on merge | Maintains codebase knowledge |
| 👀 **Code Review** | Every PR | Reviews code quality |
| 🧪 **Test Generator** | PRs + daily | Suggests and writes tests |
| 🔒 **Security Audit** | Every PR + daily | Scans for vulnerabilities |
| 📝 **PR Prep** | PR opened | Writes descriptions, adds labels |
| 🏗️ **Architecture Guardian** | PRs + daily | Enforces patterns |
| 🚀 **Release Captain** | Daily + on demand | Manages releases |
| 🚨 **Incident Responder** | 24/7 | Monitors production |

## Daily Schedule

```
00:00 UTC - Librarian updates codebase knowledge
01:00 UTC - Security deep scan
02:00 UTC - Architecture analysis
06:00 UTC - Daily digest email sent
07:00 UTC - Test coverage analysis
08:00 UTC - Release Captain checks for unreleased changes
09:00-17:00 UTC - Active monitoring (all agents responsive)
17:00 UTC - End of day summary
23:00 UTC - Cleanup stale items
```

## Working With Agents

### Responding to Reviews
- Address **🔴 Blockers** before merge
- Consider **🟠 Warnings** (use judgment)
- **🟡 Suggestions** are optional

### Agent-Generated PRs
PRs with the `agent-generated` label were created by agents.
- Review as you would any PR
- They're auto-closed after 7 days if not merged
- Reopen if you still need them

### Incident Alerts
When production issues occur:
1. Incident Responder diagnoses the issue
2. If simple: creates auto-fix PR
3. If complex: creates issue + sends email
4. Critical issues: immediate email escalation

## Configuration

Edit `.github/agents/config.yml` to customize agent behavior.

## Disabling Agents

To disable an agent temporarily:
1. Go to Actions tab
2. Find the agent workflow
3. Click "..." → "Disable workflow"

To disable permanently:
Edit `config.yml` and set `enabled: false` for that agent.

## Feedback

If agents are too noisy or missing things:
1. Adjust thresholds in `config.yml`
2. Update prompts in `.github/agents/prompts/`
3. Open an issue with feedback
```

---

## Quick Start

### 1. Create Directory Structure

```bash
mkdir -p .github/workflows
mkdir -p .github/agents/prompts
mkdir -p .github/agents/scripts
mkdir -p .github/agents/knowledge
mkdir -p .github/agents/templates
```

### 2. Add Secrets

Go to Settings → Secrets → Actions and add:
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY` 
- `ALERT_EMAIL`
- `APP_HEALTH_URL`
- `RAILWAY_TOKEN` (if using Railway)

### 3. Copy Files

Copy each workflow file, prompt file, and script from this guide to the appropriate location.

### 4. Initial Setup

```bash
# Trigger Librarian to build initial knowledge
gh workflow run agent-librarian.yml

# Verify health check
gh workflow run agent-incident-responder.yml
```

### 5. Enable Workflows

By default, scheduled workflows are disabled on fork. Enable them:
1. Go to Actions tab
2. Click on each workflow
3. Click "Enable workflow"

---

## Troubleshooting

### Agents not running
- Check Actions tab for workflow errors
- Verify secrets are set correctly
- Ensure workflows are enabled

### Too many comments/issues
- Increase thresholds in `config.yml`
- Adjust `comment_threshold` to "high"
- Add patterns to skip lists

### Missing findings
- Lower thresholds
- Check prompts for overly strict criteria
- Ensure files aren't in exclude patterns

### Email not sending
- Verify Resend API key
- Check email addresses are valid
- Review action logs for errors

### Railway integration issues
- Verify Railway token has correct permissions
- Check project ID is correct
- Test health endpoint manually

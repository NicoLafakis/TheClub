# 📚 Codebase Librarian Agent

## Overview

The Codebase Librarian is the institutional memory of the repository. This agent maintains a living map of the codebase that helps other agents understand the project's structure, patterns, and conventions.

## What It Does

The Librarian agent:

- **Maps Architecture**: Identifies major modules, packages, and their purposes
- **Documents Patterns**: Captures coding conventions, error handling approaches, and structural patterns
- **Tracks Ownership**: Identifies which team members work on which areas
- **Identifies Hot Spots**: Finds files that change frequently or accumulate complexity
- **Maintains Knowledge**: Stores all findings in JSON files that other agents can reference

## How It Works

### Trigger Schedule

The Librarian runs on:
- **Nightly at midnight UTC** - Full codebase scan
- **On merge to main/master** - Incremental knowledge update
- **On demand** - Manual workflow trigger
- **When requested by other agents** - Via `repository_dispatch` event

### Workflow Process

1. **Checkout Code**: Retrieves the latest repository state with full git history
2. **Gather Metrics**: Collects file counts, directory structure, and git activity
3. **Analyze Patterns**: Examines exports, imports, and code organization
4. **Track Activity**: Reviews git logs to identify hot files and contributors
5. **Generate Knowledge**: Uses AI to analyze all data and produce structured knowledge
6. **Commit Updates**: Stores knowledge as JSON files in `.github/agents/knowledge/`

### Output Files

The Librarian generates:

- **`codebase-map.json`** - Complete architecture map with:
  - Tech stack information
  - Architecture type and layers
  - Coding patterns and conventions
  - File ownership data
  - Hot spots and complexity warnings

## Configuration Options

### In `.github/agents/config.yml`

```yaml
agents:
  librarian:
    enabled: true
    schedule: "0 0 * * *"  # Cron expression for nightly runs
    
    # What to track
    track:
      patterns: true        # Document coding patterns
      ownership: true       # Track file ownership
      complexity: true      # Monitor complexity growth
      dependencies: true    # Map dependencies between modules
    
    # Directories to exclude from analysis
    exclude:
      - node_modules
      - dist
      - build
      - .git
      - coverage
```

### Workflow Configuration

Located at `.github/workflows/agent-librarian.yml`

Key parameters:
- `fetch-depth: 0` - Ensures full git history is available
- `initial_wait` - Time to allow for long-running analysis
- Commit message uses `[skip ci]` to prevent infinite loops

## Knowledge Schema

The `codebase-map.json` file follows this structure:

```json
{
  "lastUpdated": "2024-12-30T00:00:00Z",
  "summary": "Brief overview of the codebase",
  "techStack": {
    "primary": ["TypeScript", "React", "Node.js"],
    "frameworks": ["Next.js", "Prisma"],
    "infrastructure": ["Vercel", "PostgreSQL"]
  },
  "architecture": {
    "type": "monolith|monorepo|microservices",
    "layers": [
      {
        "name": "UI",
        "path": "src/components",
        "purpose": "React components"
      }
    ],
    "entryPoints": ["src/index.ts"]
  },
  "patterns": {
    "errorHandling": "How errors are handled",
    "stateManagement": "State management approach",
    "dataFetching": "Data fetching patterns",
    "testing": "Testing organization",
    "naming": "Naming conventions"
  },
  "ownership": {
    "areas": [
      {
        "path": "src/components",
        "primaryContributors": ["username"],
        "activity": "high|medium|low"
      }
    ]
  },
  "hotspots": {
    "frequentlyChanged": ["src/api/routes.ts"],
    "complex": ["src/lib/parser.ts"],
    "fragile": []
  },
  "conventions": [
    "Use PascalCase for components",
    "API routes return { data, error } objects"
  ],
  "warnings": [
    "Large file src/utils/everything.ts should be split"
  ]
}
```

## How Other Agents Use It

The Librarian's knowledge is consumed by:

- **Code Review Agent** - Checks if PRs follow established patterns
- **Test Generation Agent** - Understands testing frameworks and patterns
- **Security Audit Agent** - Identifies security-sensitive areas
- **PR Prep Agent** - Provides context for PR descriptions
- **Architecture Guardian** - Compares changes against intended architecture
- **Incident Responder** - Uses codebase knowledge for root cause analysis

## Manual Triggering

### Using GitHub CLI

```bash
gh workflow run agent-librarian.yml
```

### Using GitHub Actions UI

1. Go to the "Actions" tab
2. Select "Codebase Librarian" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Programmatically via API

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/agent-librarian.yml/dispatches \
  -d '{"ref":"main"}'
```

## Troubleshooting

### Knowledge Not Updating

**Symptoms**: The `codebase-map.json` file is outdated

**Solutions**:
- Check workflow runs in Actions tab for errors
- Verify `ANTHROPIC_API_KEY` secret is set correctly
- Ensure git user is configured properly in workflow
- Check for git conflicts in knowledge files

### Missing Knowledge File

**Symptoms**: Other agents report missing `codebase-map.json`

**Solutions**:
- Manually trigger Librarian workflow to generate initial knowledge
- Check workflow permissions allow writing to repository
- Verify `.github/agents/knowledge/` directory exists

### Incomplete Analysis

**Symptoms**: Knowledge file missing expected patterns or areas

**Solutions**:
- Review excluded directories in config - may be too broad
- Check if codebase metrics capture enough context
- Adjust the Librarian prompt to focus on missing areas
- Increase the context window by gathering more file samples

## Best Practices

1. **Run After Major Changes**: Trigger manually after significant refactoring
2. **Review Knowledge Periodically**: Check that captured patterns match reality
3. **Update Exclusions**: Add build artifacts and generated files to exclude list
4. **Monitor Knowledge Size**: Large knowledge files may need pruning
5. **Validate After Updates**: Review git diff on knowledge files to ensure accuracy

## Customization

### Adjusting the Prompt

Edit `.github/agents/prompts/librarian.md` to:
- Focus on specific patterns relevant to your project
- Add custom analysis sections
- Change output format for specific needs
- Emphasize certain architectural concerns

### Extending Knowledge

To add custom knowledge fields:
1. Update the prompt to request additional information
2. Modify consuming agents to use the new fields
3. Document the schema changes

### Integration with External Tools

The Librarian can be extended to:
- Export knowledge to wiki or documentation site
- Generate architecture diagrams from the knowledge
- Feed data into analytics dashboards
- Integrate with project management tools

## Performance Considerations

- **Full Scan**: Takes 2-5 minutes depending on repository size
- **Incremental Updates**: Faster when triggered by specific changes
- **API Usage**: Consumes Claude API tokens based on codebase size
- **Git Operations**: Requires full git history (large repos take longer)

## Security & Privacy

- Knowledge files are committed to the repository (consider sensitive data)
- No external services receive codebase data except Claude API
- Ensure prompt doesn't extract secrets or credentials
- Review knowledge files before committing if repo contains proprietary code

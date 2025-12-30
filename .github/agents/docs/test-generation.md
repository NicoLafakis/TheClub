# 🧪 Test Generation Agent

## Overview

The Test Generation Agent acts as a QA engineer focused on improving test coverage. It analyzes code to identify testing gaps and generates practical test suggestions or complete test files.

## What It Does

The Test Generation Agent:

- **Analyzes Test Coverage**: Identifies files and functions without adequate tests
- **Suggests Test Cases**: Recommends specific test scenarios for new code
- **Generates Tests**: Creates complete test files following project patterns
- **Categorizes by Risk**: Prioritizes high-risk code for testing
- **Reviews Test Quality**: Ensures tests follow project conventions
- **Identifies Edge Cases**: Finds boundary conditions that should be tested

## How It Works

### Trigger Events

The Test Generation Agent runs when:
- **PR Opened/Synchronized** - Suggests tests for changed files
- **Daily at 7am UTC** - Scheduled coverage analysis
- **Manual Trigger** - On-demand test generation for specific files

### Workflow Process

#### For PR Reviews (Suggesting Tests)

1. **Checkout Code**: Gets the PR branch
2. **Identify Changed Files**: Finds source files modified in the PR
3. **Check Existing Tests**: Looks for corresponding test files
4. **Load Knowledge**: Retrieves testing patterns from Librarian
5. **Analyze Code**: Identifies testable units and risk levels
6. **Generate Suggestions**: Creates prioritized test recommendations
7. **Post Comment**: Adds test suggestions to the PR

#### For Scheduled Runs (Generating Tests)

1. **Scan Repository**: Finds all source files without tests
2. **Prioritize Files**: Ranks by complexity and risk
3. **Generate Tests**: Creates actual test files (top 20 files)
4. **Create Branch**: Makes a new branch with generated tests
5. **Open PR**: Submits PR with agent-generated tests
6. **Label Appropriately**: Tags PR as `agent-generated` and `tests`

### Test Analysis Approach

The agent categorizes code by risk level:

**High Risk** (Priority testing):
- Business logic
- Data transformations
- Authentication/authorization
- Payment processing
- API endpoints

**Medium Risk**:
- Utilities
- Formatters
- Validators
- Helper functions

**Low Risk**:
- Simple getters/setters
- Constants
- Type definitions
- Configuration files

## Configuration Options

### In `.github/agents/config.yml`

```yaml
agents:
  test-generation:
    enabled: true
    
    # Auto-generate tests for these paths
    auto_generate_for:
      - "src/utils/**"
      - "src/lib/**"
      - "src/services/**"
      - "src/api/**"
    
    # Coverage thresholds
    coverage:
      target: 80          # Target coverage percentage
      minimum: 60         # Minimum acceptable coverage
    
    # Test framework (auto-detected if not set)
    framework: null       # Options: jest, mocha, pytest, vitest, etc.
    
    # Directories to skip
    skip_directories:
      - "node_modules"
      - "dist"
      - "build"
      - "coverage"
```

### Workflow Configuration

Located at `.github/workflows/agent-test-generation.yml`

Key parameters:
- Triggers on PR changes to `src/`, `lib/`, `app/` directories
- Daily scheduled run for comprehensive analysis
- Manual trigger option with `target_file` input
- Outputs either PR comment or new PR with tests

## Test Suggestion Format

For PR comments, the agent provides:

```markdown
## 🧪 Test Suggestions

### High Priority

**`src/utils/calculator.ts`** - `calculateTotal()`

This function handles monetary calculations and has no tests.

**Risk Level**: High - Handles money, math errors impact users

**Suggested test cases**:
1. **Happy path**: Calculate total with valid items
2. **Edge case**: Empty array should return 0
3. **Edge case**: Single item calculation
4. **Error case**: Negative quantities should throw
5. **Precision**: Floating point handling for currency

**Example test structure**:
```typescript
describe('calculateTotal', () => {
  it('calculates total for valid items', () => {
    const items = [
      { price: 10.99, quantity: 2 },
      { price: 5.50, quantity: 1 }
    ];
    expect(calculateTotal(items)).toBe(27.48);
  });
  
  // More test cases...
});
```

**Complexity**: Medium | **Estimated Time**: 20 minutes

---

### Medium Priority

[Similar format for medium priority items]

---

### Low Priority

[Similar format for low priority items]

---

### Coverage Summary

- **Total files changed**: 12
- **Files with tests**: 4 (33%)
- **Files needing tests**: 8
- **High risk files without tests**: 3
```

## Generated Test Format

When generating actual test files, the agent:

1. **Matches Project Style**: Uses same testing framework and patterns
2. **Follows Conventions**: Mirrors existing test organization
3. **Includes Comments**: Explains non-obvious test cases
4. **Comprehensive Coverage**: Tests happy path, edge cases, and errors
5. **Uses Proper Mocks**: Mocks external dependencies appropriately

Example generated test:

```typescript
// src/utils/calculator.test.ts
import { calculateTotal, applyDiscount, validateItem } from './calculator';

describe('calculator utilities', () => {
  describe('calculateTotal', () => {
    describe('happy path', () => {
      it('calculates total for valid items', () => {
        const items = [
          { price: 10, quantity: 2 },
          { price: 5, quantity: 1 }
        ];
        expect(calculateTotal(items)).toBe(25);
      });

      it('handles decimal prices correctly', () => {
        const items = [{ price: 10.99, quantity: 2 }];
        expect(calculateTotal(items)).toBe(21.98);
      });
    });

    describe('edge cases', () => {
      it('returns 0 for empty array', () => {
        expect(calculateTotal([])).toBe(0);
      });

      it('handles single item', () => {
        const items = [{ price: 10, quantity: 1 }];
        expect(calculateTotal(items)).toBe(10);
      });

      it('handles zero quantity', () => {
        const items = [{ price: 10, quantity: 0 }];
        expect(calculateTotal(items)).toBe(0);
      });
    });

    describe('error handling', () => {
      it('throws for negative price', () => {
        const items = [{ price: -10, quantity: 1 }];
        expect(() => calculateTotal(items)).toThrow('Invalid price');
      });

      it('throws for negative quantity', () => {
        const items = [{ price: 10, quantity: -1 }];
        expect(() => calculateTotal(items)).toThrow('Invalid quantity');
      });

      it('handles null/undefined gracefully', () => {
        expect(() => calculateTotal(null)).toThrow();
        expect(() => calculateTotal(undefined)).toThrow();
      });
    });
  });

  describe('applyDiscount', () => {
    // Additional test cases...
  });
});
```

## How It Uses Librarian Knowledge

The agent references `codebase-map.json` to:

1. **Detect Test Framework**
   - Identifies which testing library is used (Jest, Mocha, etc.)
   - Understands test file naming conventions
   - Recognizes assertion libraries in use

2. **Follow Test Patterns**
   - Mimics existing test structure
   - Uses same describe/it patterns
   - Matches mocking approaches
   - Follows setup/teardown conventions

3. **Understand Business Logic**
   - Identifies critical business logic paths
   - Recognizes data transformation flows
   - Understands API endpoints to test

4. **Prioritize Based on Risk**
   - Uses hot spots data to prioritize fragile areas
   - Considers complexity metrics
   - Identifies frequently changed code

## Manual Test Generation

### For Specific File

```bash
gh workflow run agent-test-generation.yml \
  -f target_file="src/utils/calculator.ts"
```

### Via GitHub UI

1. Go to Actions tab
2. Select "Test Generation Agent"
3. Click "Run workflow"
4. Enter file path (optional)
5. Click "Run workflow"

## Best Practices

### For Repository Maintainers

1. **Review Generated Tests**: Don't auto-merge test PRs
2. **Refine Coverage Targets**: Adjust based on project needs
3. **Update Auto-Generate Paths**: Focus on critical directories
4. **Maintain Test Patterns**: Keep existing tests as good examples
5. **Run Coverage Reports**: Validate actual coverage regularly

### For Developers

1. **Write Tests First**: Don't rely solely on agent for tests
2. **Review Suggestions**: Agent may miss domain-specific edge cases
3. **Improve Generated Tests**: Add business logic validation
4. **Update Test Patterns**: Keep test conventions current
5. **Document Complex Cases**: Help agent understand special scenarios

## Customization

### Adjusting Test Quality

Edit `.github/agents/prompts/test-generation.md` to:
- Emphasize integration vs unit tests
- Focus on specific types of edge cases
- Include performance testing
- Add accessibility testing for UI components

### Custom Test Templates

Provide example tests as reference:

```yaml
- name: Provide test examples
  run: |
    cp tests/examples/*.test.ts context/
    
- name: Generate tests
  with:
    context_files: |
      context/*.test.ts
      targets.txt
```

### Framework-Specific Generation

Add framework detection logic:

```yaml
- name: Detect test framework
  run: |
    if grep -q "jest" package.json; then
      echo "framework=jest" >> $GITHUB_OUTPUT
    elif grep -q "vitest" package.json; then
      echo "framework=vitest" >> $GITHUB_OUTPUT
    fi
```

## Troubleshooting

### Tests Not Generated

**Symptoms**: Workflow runs but no tests appear

**Solutions**:
- Check if files match `auto_generate_for` patterns
- Verify test files don't already exist
- Check branch creation permissions
- Review workflow logs for errors

### Poor Test Quality

**Symptoms**: Generated tests are too simple or miss edge cases

**Solutions**:
- Improve examples in existing test suite
- Update prompt with specific requirements
- Provide more context about business logic
- Add comments in source code explaining edge cases

### Wrong Test Framework

**Symptoms**: Tests use wrong syntax or libraries

**Solutions**:
- Set `framework` explicitly in config
- Ensure Librarian has detected correct framework
- Add framework examples to context
- Update package.json with correct dependencies

### Tests Don't Pass

**Symptoms**: Generated tests fail when run

**Solutions**:
- Run tests in PR to verify
- Check import paths are correct
- Verify mocks match actual APIs
- Review agent's understanding of code behavior

## Integration with CI/CD

### Run Generated Tests

```yaml
- name: Install dependencies
  run: npm ci
  
- name: Run new tests
  run: npm test -- --findRelatedTests $(git diff --name-only origin/main | grep '\.test\.')
```

### Coverage Reporting

```yaml
- name: Generate coverage
  run: npm test -- --coverage --json --outputFile=coverage.json
  
- name: Comment coverage
  uses: actions/github-script@v7
  with:
    script: |
      const coverage = require('./coverage.json');
      // Post coverage comment
```

### Auto-Merge Passing Tests

```yaml
- name: Auto-merge if tests pass
  if: success() && steps.test.outcome == 'success'
  run: |
    gh pr merge --auto --squash
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Performance Considerations

- **Analysis Time**: 1-3 minutes for PR reviews
- **Generation Time**: 5-10 minutes for scheduled runs
- **API Usage**: Varies by number of files (1000-3000 tokens per file)
- **Test Execution**: Generated tests should run quickly

## Advanced Features

### Risk-Based Prioritization

The agent uses multiple factors to prioritize:
- Cyclomatic complexity
- Lines of code
- Change frequency
- Existing test coverage
- Dependency graph position

### Mutation Testing Integration

Combine with mutation testing:

```yaml
- name: Run mutation tests
  run: npm run test:mutation
  
- name: Generate tests for uncovered mutations
  with:
    additional_context: "Mutation report: $(cat mutation-report.json)"
```

### Coverage Trends

Track coverage over time:

```yaml
- name: Store coverage metrics
  run: |
    echo "$(date),$(jq '.total.lines.pct' coverage.json)" >> .github/coverage-history.csv
    git add .github/coverage-history.csv
    git commit -m "Update coverage history"
```

## Related Documentation

- [Codebase Librarian](./librarian.md) - Provides testing patterns
- [Code Review Agent](./code-review.md) - Reviews test quality
- [Security Audit Agent](./security-audit.md) - Security test requirements

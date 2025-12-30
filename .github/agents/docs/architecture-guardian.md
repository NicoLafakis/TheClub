# 🏗️ Architecture Guardian Agent

## Overview

The Architecture Guardian is a staff engineer focused on maintaining architectural integrity. It thinks in systems and patterns, preventing architectural drift and enforcing boundaries.

## What It Does

The Architecture Guardian:

- **Enforces Layer Boundaries**: Prevents improper dependencies between layers
- **Detects Pattern Violations**: Identifies deviations from established patterns
- **Monitors Complexity**: Tracks complexity accumulation in files and modules
- **Prevents Duplication**: Finds duplicate utilities and abstractions
- **Reviews Module Cohesion**: Ensures modules stay focused and well-defined
- **Tracks Architectural Trends**: Reports on long-term architectural health

## How It Works

### Trigger Events

The Architecture Guardian runs when:
- **PR Opened/Synchronized** - Reviews architectural changes in PRs
- **Daily at 2am UTC** - Scheduled architecture analysis
- **Manual Trigger** - On-demand architectural review

### Workflow Process

1. **Checkout Code**: Gets repository with full history
2. **Analyze Imports**: Builds import dependency graph
3. **Detect Violations**: Finds layer boundary violations
4. **Check Patterns**: Compares against established patterns
5. **Measure Complexity**: Analyzes file sizes and complexity
6. **Load Knowledge**: References architectural intent from Librarian
7. **Generate Report**: Creates findings with recommendations
8. **Post Results**: Comments on PR or creates issue

### Analysis Categories

**1. Layer Violations**
- UI components calling database directly
- Business logic in UI components
- API routes importing UI code
- Data layer depending on business logic

**2. Dependency Direction**
- Dependencies should flow inward (UI → Business → Data)
- Inner layers shouldn't know about outer layers
- Circular dependencies between modules

**3. Pattern Consistency**
- New code following established patterns
- Duplicate utilities being created
- Inconsistent abstraction levels

**4. Module Boundaries**
- Modules staying cohesive
- Inappropriate coupling between modules
- Clean, minimal interfaces

**5. Complexity Accumulation**
- Files growing too large (>500 lines)
- Functions becoming complex
- Cyclomatic complexity increasing

## Configuration Options

### In `.github/agents/config.yml`

```yaml
agents:
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
        - from: "ui"
          to: "database"
    
    # Complexity thresholds
    complexity:
      max_file_lines: 500
      max_function_lines: 50
      max_cyclomatic: 10
      warn_file_lines: 300
    
    # Pattern enforcement
    patterns:
      enforce_service_layer: true
      require_interfaces: false
      ban_circular_deps: true
```

### Workflow Configuration

Located at `.github/workflows/agent-architecture-guardian.yml`

Key settings:
- Analyzes import patterns and dependencies
- Compares against codebase-map architecture
- Reports violations and trends
- Creates issues for scheduled runs

## Report Format

### For PR Reviews

```markdown
## 🏗️ Architecture Review

**Architectural Health**: 🟡 Minor Issues

**Analysis Date**: 2024-12-30T03:42:55Z
**Files Analyzed**: 45 changed
**Findings**: 1 violation, 2 warnings

---

### Layer Violations

#### 🔴 [VIOLATION] Component Directly Calls API

**File**: `src/components/UserList.tsx:23`
**Severity**: Critical

**Issue**:
```typescript
import { fetchUsers } from 'src/api/users';
// In component:
const users = await fetchUsers();
```

Components should not directly import from API layer.

**Pattern**: Use the service/hook layer
```typescript
// Correct pattern:
import { useUsers } from 'src/hooks/useUsers';

function UserList() {
  const { users, loading } = useUsers();
  // ...
}
```

**Impact**: 
- Breaks separation of concerns
- Makes components harder to test
- Couples UI to API implementation
- Violates established architecture pattern

**Reference**: See `codebase-map.json` → architecture → layers

---

### Pattern Deviations

#### 🟠 [WARNING] New Utility Duplicates Existing

**New**: `src/utils/formatDate.ts`
**Existing**: `src/lib/dates.ts` already has `formatDate()`

**Issue**: Creating duplicate utilities fragments codebase knowledge

**Recommendation**: 
1. Use existing utility from `src/lib/dates.ts`
2. If new functionality needed, extend existing utility
3. If different purpose, choose distinct name

**Impact**: Maintenance burden, potential inconsistencies

---

#### 🟠 [WARNING] Growing Complexity

**File**: `src/services/dataProcessor.ts`
**Current Size**: 487 lines (approaching 500 line threshold)
**Cyclomatic Complexity**: 28 (high)

**Recommendation**: Consider splitting into focused modules:
- `dataProcessor/validator.ts` - Input validation
- `dataProcessor/transformer.ts` - Data transformation  
- `dataProcessor/aggregator.ts` - Aggregation logic

---

### Positive Patterns ✅

- ✅ Proper use of service layer for API calls
- ✅ Consistent component structure across UI
- ✅ Clean separation between business logic and presentation
- ✅ Appropriate use of shared utilities

---

### Recommendations

**Immediate Actions**:
1. Fix component/API layer violation before merge
2. Remove duplicate utility or consolidate

**Follow-up Items**:
1. Refactor `dataProcessor.ts` when size reaches 500 lines
2. Document data processing pattern in ADR
3. Consider creating architecture decision record for service layer

---

**Trend**: Overall architecture health is stable. This PR introduces one violation that should be addressed.
```

### For Scheduled Reports

```markdown
## 🏗️ Weekly Architecture Report

**Report Period**: Dec 23-30, 2024
**Health Score**: 7.5/10 (↓ from 8.0)

---

### Trends

- **Layer violations**: ↑ 3 new this week (was 5, now 8)
- **Duplicate utilities**: → stable at 2
- **Complex files**: ↓ improved (removed 1, now 3)
- **Circular dependencies**: ✅ none detected
- **Average file size**: → 127 lines (stable)

---

### Top Issues

#### 1. Growing Complexity in Parser Module

**File**: `src/lib/parser.ts` (now 847 lines)
**Growth**: +145 lines this week
**Complexity**: High (cyclomatic complexity: 45)

**Impact**: 
- Difficult to maintain
- High bug risk
- Hard to test thoroughly

**Recommendation**: Split into focused modules by responsibility

---

#### 2. Emerging Anti-Pattern: Bypassing Service Layer

**Instances**: 3 new components this week
**Files**: 
- `src/components/Dashboard.tsx`
- `src/components/Analytics.tsx`  
- `src/components/Reports.tsx`

**Pattern**: Components directly importing from API layer

**Recommendation**: 
1. Create ADR documenting service layer requirement
2. Add pre-commit hook to prevent
3. Refactor existing violations

---

### Module Health Matrix

| Module | Cohesion | Coupling | Complexity | Size | Trend | Grade |
|--------|----------|----------|------------|------|-------|-------|
| `/components` | High | Low | Medium | 4,200 | → | A- |
| `/api` | High | Low | Low | 1,800 | ↓ | A |
| `/services` | Medium | Medium | Medium | 2,500 | → | B+ |
| `/lib` | Medium | High | High | 3,400 | ↑ | C+ |
| `/utils` | High | Low | Low | 800 | → | A |
| `/hooks` | High | Low | Medium | 1,200 | ↓ | A- |

**Key**:
- ↑ Degrading
- → Stable  
- ↓ Improving

---

### Architectural Debt Tracking

**Total Items**: 12 (↑ from 10 last week)
**New This Week**: 3
**Resolved This Week**: 1

**Top Priorities**:
1. Split `parser.ts` (Technical debt: 5 story points)
2. Enforce service layer pattern (3 story points)
3. Consolidate duplicate date utilities (2 story points)

---

### Recommended Actions

**This Sprint**:
1. ⚠️ Address parser.ts complexity (critical)
2. Create service layer ADR
3. Fix component/API violations

**Next Sprint**:
1. Refactor lib/ module to reduce coupling
2. Consolidate utility duplicates
3. Add architecture tests to CI

**Q1 2025**:
1. Implement automated architecture testing
2. Create architecture documentation
3. Team training on architectural patterns

---

### Wins This Week 🎉

- ✅ Removed circular dependency in auth module
- ✅ Consolidated database utilities (from 3 to 1)
- ✅ Improved test coverage in services layer
- ✅ Documented data flow pattern

---

**Next Review**: Weekly on Monday at 2am UTC
```

## How It Uses Librarian Knowledge

The Architecture Guardian references `codebase-map.json` to:

1. **Understand Intended Architecture**
   - Loads architectural layers and boundaries
   - Reads established patterns
   - Understands module structure

2. **Compare Against Reality**
   - Detects deviations from intended design
   - Identifies pattern violations
   - Spots architectural drift

3. **Provide Context**
   - References why patterns exist
   - Explains impact of violations
   - Suggests fixes aligned with architecture

## Best Practices

### For Architects

1. **Define Clear Boundaries**: Document layer rules explicitly
2. **Update Knowledge**: Keep codebase-map current with decisions
3. **Review Reports**: Act on weekly architecture reports
4. **Track Debt**: Maintain architectural debt backlog
5. **Enforce Gradually**: Introduce rules incrementally

### For Developers

1. **Follow Patterns**: Adhere to established architectural patterns
2. **Ask Before Breaking**: Question violations before implementing
3. **Refactor Continuously**: Don't let complexity accumulate
4. **Document Decisions**: Use ADRs for architectural choices
5. **Review Feedback**: Understand why Guardian flags issues

## Troubleshooting

### False Violation Reports

**Symptoms**: Agent reports valid code as violations

**Solutions**:
- Update architecture rules in config
- Refine layer definitions
- Add exceptions for valid cases
- Update Librarian knowledge

### Missing Violations

**Symptoms**: Agent doesn't catch known issues

**Solutions**:
- Add rules for specific patterns
- Update forbidden import list
- Lower complexity thresholds
- Enhance import analysis

### Inconsistent Enforcement

**Symptoms**: Similar violations treated differently

**Solutions**:
- Standardize architecture rules
- Document patterns explicitly
- Update Librarian with clear boundaries
- Add automated architecture tests

## Advanced Features

### Architecture Decision Records (ADRs)

Create and reference ADRs:

```yaml
- name: Check for ADR
  run: |
    if [ -f "docs/adr/0042-service-layer.md" ]; then
      echo "adr_url=docs/adr/0042-service-layer.md" >> $GITHUB_OUTPUT
    fi
```

### Automated Architecture Tests

Integrate with testing:

```yaml
- name: Run architecture tests
  run: |
    npm run test:architecture
    # Example: jest --config jest.architecture.config.js
```

### Dependency Graph Visualization

Generate visual graphs:

```yaml
- name: Generate dependency graph
  run: |
    npx madge --image deps.png src/
    
- name: Upload graph
  uses: actions/upload-artifact@v3
  with:
    name: dependency-graph
    path: deps.png
```

### Custom Rules Engine

Extend with custom checks:

```yaml
- name: Custom architecture rules
  run: |
    # Example: No barrel exports in components
    ! find src/components -name "index.ts" -exec grep -l "export.*from" {} \;
```

## Performance Considerations

- **Analysis Time**: 2-4 minutes per run
- **API Usage**: 2000-4000 tokens per analysis
- **Scalability**: Handles large codebases (10,000+ files)
- **Impact**: Import graph analysis is most expensive

## Related Documentation

- [Codebase Librarian](./librarian.md) - Architecture knowledge source
- [Code Review Agent](./code-review.md) - Code-level reviews
- [PR Prep Agent](./pr-prep.md) - PR categorization

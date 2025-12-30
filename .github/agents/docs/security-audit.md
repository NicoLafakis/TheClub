# 🔒 Security Audit Agent

## Overview

The Security Audit Agent acts as a dedicated security engineer performing continuous security monitoring. It scans code for vulnerabilities, secrets, and security issues with immediate alerts for critical findings.

## What It Does

The Security Audit Agent:

- **Scans for Vulnerabilities**: Detects injection flaws, XSS, and other OWASP Top 10 issues
- **Finds Secrets**: Identifies hardcoded API keys, passwords, and credentials
- **Audits Dependencies**: Checks for known CVEs in npm packages
- **Reviews Auth/AuthZ**: Validates authentication and authorization patterns
- **Analyzes Data Exposure**: Finds sensitive data leaks in logs or responses
- **Prioritizes by Severity**: Classifies findings as Critical, High, Medium, or Low
- **Provides Remediation**: Offers specific steps to fix each vulnerability

## How It Works

### Trigger Events

The Security Audit Agent runs when:
- **PR Opened/Synchronized** - Security check on new code
- **Push to Main** - Post-merge verification scan
- **Daily at 1am UTC** - Deep scheduled security scan
- **Manual Trigger** - On-demand security audit

### Workflow Process

1. **Checkout Code**: Gets full repository with git history
2. **Run Gitleaks**: Scans for secrets in code and git history
3. **Run npm audit**: Checks dependency vulnerabilities
4. **Identify Security Files**: Finds auth, API, password-related code
5. **AI Security Analysis**: Deep scan using Claude
6. **Generate Report**: Creates detailed findings document
7. **Post Results**: Comments on PR or creates issue
8. **Send Alerts**: Emails for critical/high severity findings

### Audit Categories

**1. Secrets & Credentials**
- Hardcoded API keys, passwords, tokens
- Credentials in logs or error messages
- Private keys and certificates
- Connection strings with passwords
- .env files with real values

**2. Injection Vulnerabilities**
- SQL injection (string concatenation in queries)
- Command injection (exec/spawn with user input)
- XSS (unescaped HTML, dangerouslySetInnerHTML)
- Path traversal (user input in file paths)
- LDAP injection
- XML injection

**3. Authentication & Authorization**
- Missing authentication checks
- Broken access control
- Weak password handling
- JWT issues (no expiry, weak signing)
- Session management flaws
- Privilege escalation risks

**4. Data Exposure**
- Sensitive data in logs
- PII in error messages
- Excessive API responses
- Missing encryption for sensitive data
- Debug information exposure

**5. Dependency Vulnerabilities**
- Known CVEs in packages
- Outdated dependencies
- Vulnerable transitive dependencies

## Configuration Options

### In `.github/agents/config.yml`

```yaml
agents:
  security-audit:
    enabled: true
    
    # Severity thresholds
    fail_on: "critical"       # Fail PR check on this severity
    comment_on: "medium"      # Comment on this and above
    
    # Secret detection patterns
    secret_patterns:
      - "api[_-]?key"
      - "secret"
      - "password"
      - "token"
      - "credential"
      - "private[_-]?key"
      - "auth[_-]?token"
    
    # Always scan these files
    always_scan:
      - "*.env*"
      - "*config*"
      - "*secret*"
      - "*credential*"
      - "src/auth/**"
      - "src/api/**"
    
    # Email alerts
    alerts:
      critical: true          # Send email for critical
      high: true             # Send email for high
      medium: false          # Don't email for medium
```

### Workflow Configuration

Located at `.github/workflows/agent-security-audit.yml`

Key settings:
- Requires `security-events: write` permission
- Runs Gitleaks for secret detection
- Executes npm audit for dependencies
- Sends email alerts via Resend API

## Security Report Format

### For PR Comments

```markdown
## 🔒 Security Audit Results

**Overall Risk**: 🔴 Critical

**Scan Date**: 2024-12-30T03:42:55Z
**Files Scanned**: 127
**Issues Found**: 3 Critical, 2 High, 5 Medium

---

### 🔴 CRITICAL FINDINGS

#### [SEC-001] Hardcoded API Key in Production Code

**File**: `src/services/payment.ts:15`
**Severity**: Critical
**CWE**: CWE-798 (Use of Hard-coded Credentials)

**Finding**:
```typescript
const STRIPE_API_KEY = "sk_live_abc123def456...";
```

**Risk**: 
- API key exposed in git history
- Attackers can use key to make unauthorized charges
- Key compromise requires immediate rotation

**Remediation**:
1. **Immediate**: Rotate the exposed Stripe API key in dashboard
2. **Code fix**: Replace with environment variable:
   ```typescript
   const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
   if (!STRIPE_API_KEY) {
     throw new Error('STRIPE_API_KEY not configured');
   }
   ```
3. **Prevention**: Add `.env` to `.gitignore`
4. **Detection**: Configure git hooks to prevent secrets

**References**: 
- [OWASP: Use of Hard-coded Credentials](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_credentials)
- [Stripe: API Key Security](https://stripe.com/docs/keys#limit-access)

---

#### [SEC-002] SQL Injection Vulnerability

**File**: `src/api/users.ts:42`
**Severity**: Critical
**CWE**: CWE-89 (SQL Injection)

**Finding**:
```typescript
const users = await db.query(
  `SELECT * FROM users WHERE email = '${userEmail}'`
);
```

**Risk**:
- Attacker can execute arbitrary SQL
- Potential data breach (read all user data)
- Database manipulation possible
- Could lead to authentication bypass

**Remediation**:
```typescript
// SECURE: Use parameterized query
const users = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
);
```

**Test Case**:
```typescript
// This input would cause SQL injection:
const maliciousEmail = "' OR '1'='1";
// Would execute: SELECT * FROM users WHERE email = '' OR '1'='1'
```

**References**:
- [OWASP: SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)

---

### 🟠 HIGH FINDINGS

#### [SEC-003] Cross-Site Scripting (XSS) Vulnerability

**File**: `src/components/UserProfile.tsx:89`
**Severity**: High
**CWE**: CWE-79 (Cross-site Scripting)

**Finding**:
```typescript
<div dangerouslySetInnerHTML={{ __html: user.bio }} />
```

**Risk**:
- Attackers can inject malicious JavaScript
- Session hijacking via stolen cookies
- Phishing attacks within the app
- Reputation damage

**Remediation**:
```typescript
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(user.bio) 
}} />
```

Or better, use markdown:
```typescript
import ReactMarkdown from 'react-markdown';

<ReactMarkdown>{user.bio}</ReactMarkdown>
```

---

### 🟡 MEDIUM FINDINGS

[Similar format for medium severity issues]

---

### Dependency Vulnerabilities

| Package | Current | Severity | CVE | Fixed In | Auto-Fix |
|---------|---------|----------|-----|----------|----------|
| lodash | 4.17.15 | Critical | CVE-2021-23337 | 4.17.21 | ✅ Yes |
| axios | 0.21.1 | High | CVE-2021-3749 | 0.21.2 | ✅ Yes |
| express | 4.16.4 | Medium | CVE-2022-24999 | 4.17.3 | ✅ Yes |

**Remediation**:
```bash
npm audit fix
# Or for breaking changes:
npm audit fix --force
```

---

### Recommendations

#### Immediate Actions (within 24 hours)
1. Rotate exposed Stripe API key
2. Fix SQL injection in user query
3. Update lodash to patch critical CVE

#### Short-term (this sprint)
1. Implement XSS sanitization
2. Update all dependencies with npm audit fix
3. Add security testing to CI/CD

#### Long-term (technical debt)
1. Implement Content Security Policy
2. Add automated secret scanning in pre-commit hooks
3. Regular dependency audits (automated)
4. Security training for team

---

### Clean Areas ✅

The following security-sensitive areas were reviewed and found secure:
- ✅ JWT token handling in `src/auth/jwt.ts` uses proper signing
- ✅ Password hashing in `src/auth/password.ts` uses bcrypt correctly
- ✅ CORS configuration in `src/middleware/cors.ts` is appropriate
- ✅ Rate limiting implemented on API endpoints

---

**Next Steps**: Address critical findings before merging this PR.
```

## Severity Classification

### 🔴 Critical
- Exploitable now
- Direct security breach possible
- Data loss or corruption risk
- Immediate action required

**Examples**:
- Hardcoded secrets in production code
- SQL injection vulnerabilities
- Authentication bypass
- Remote code execution

### 🟠 High
- Significant security risk
- Requires effort to exploit
- Should fix before merge/deploy
- Potential for serious impact

**Examples**:
- XSS vulnerabilities
- Missing authentication on sensitive endpoints
- Insecure crypto usage
- Path traversal

### 🟡 Medium
- Real security issue
- Harder to exploit or limited impact
- Fix soon but not blocking
- Defense in depth concern

**Examples**:
- Information disclosure
- Weak password requirements
- Missing security headers
- Unvalidated redirects

### 🟢 Low
- Minor security issue
- Very difficult to exploit
- Informational finding
- Best practice recommendation

**Examples**:
- Missing security headers (CSP, etc.)
- Outdated dependencies (no known exploits)
- Verbose error messages
- Cookie security flags

## Alert Configuration

### Email Alerts

For critical/high findings, the agent sends detailed email alerts:

**Recipients**:
- `SECURITY_EMAIL` - Security team email
- `ALERT_EMAIL` - On-call engineer email

**Email Content**:
- Severity and urgency
- Detailed finding description
- Exact file and line number
- Specific remediation steps
- Links to PR/issue in GitHub

### Notification Settings

```yaml
# In .github/agents/config.yml
notifications:
  resend:
    enabled: true
    from: "security@yourdomain.com"
  
  recipients:
    critical: "${SECURITY_EMAIL}"
    high: "${SECURITY_EMAIL}"
    medium: "${TEAM_EMAIL}"
```

## Integration with Security Tools

### Gitleaks

Detects secrets in:
- Current code
- Git history
- Uncommitted changes

Configuration: `.gitleaks.toml` (if present)

### npm audit

Checks for:
- Known CVEs in direct dependencies
- Vulnerabilities in transitive dependencies
- Severity levels from npm registry

### CodeQL (Optional)

Can be integrated:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v2
  with:
    languages: javascript,typescript
    
- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v2
```

## Best Practices

### For Security Teams

1. **Review All Critical**: Manually verify critical findings
2. **Tune Detection**: Adjust patterns to reduce false positives
3. **Track Metrics**: Monitor vulnerability trends over time
4. **Update Patterns**: Add new secret patterns as needed
5. **Incident Response**: Have runbook for critical findings

### For Developers

1. **Never Commit Secrets**: Use environment variables
2. **Fix Immediately**: Address critical/high before merge
3. **Understand Remediation**: Don't just copy-paste fixes
4. **Test Fixes**: Verify vulnerabilities are actually resolved
5. **Learn Patterns**: Understand why code was vulnerable

## Troubleshooting

### False Positives

**Symptoms**: Agent reports non-issues

**Solutions**:
- Add patterns to allowlist
- Update secret detection rules
- Provide more context in code comments
- Adjust severity thresholds

### Missed Vulnerabilities

**Symptoms**: Known issues not detected

**Solutions**:
- Add specific checks to prompt
- Update secret patterns
- Enable additional security tools
- Increase scan depth

### Alert Fatigue

**Symptoms**: Too many low-priority alerts

**Solutions**:
- Raise `comment_on` threshold
- Disable alerts for low/medium
- Fix underlying issues to reduce noise
- Batch non-critical findings in daily digest

## Advanced Features

### Custom Security Rules

Add project-specific checks:

```yaml
- name: Check custom security rules
  run: |
    # Example: Ensure all API routes have auth
    ! grep -r "app.get\|app.post" src/api/ | grep -v "authenticate"
```

### Security Metrics Dashboard

Track security trends:

```yaml
- name: Update security metrics
  run: |
    CRITICAL=$(jq '.findings.critical | length' security-report.json)
    echo "$(date),$CRITICAL" >> .github/security-metrics.csv
```

### Integration with SAST Tools

Combine multiple tools:

```yaml
- name: Run Semgrep
  run: semgrep --config auto src/
  
- name: Run Bandit (Python)
  if: hashFiles('**/*.py') != ''
  run: bandit -r src/
```

## Performance Considerations

- **Scan Time**: 2-5 minutes per run
- **API Usage**: 2000-5000 tokens per scan
- **Secret Scanning**: Scales with git history size
- **Dependency Audit**: Quick (npm audit is fast)

## Security & Privacy

- Code sent to Claude API for analysis
- Secrets found are NOT sent to external services
- Gitleaks runs locally only
- Email alerts may contain sensitive paths
- Consider using GitHub Advanced Security for private repos

## Related Documentation

- [Code Review Agent](./code-review.md) - General code quality
- [Incident Responder](./incident-responder.md) - Production security monitoring
- [Codebase Librarian](./librarian.md) - Security pattern knowledge

# 🚨 Incident Responder Agent

## Overview

The Incident Responder is an on-call engineer that monitors production 24/7, diagnoses issues, attempts automatic fixes, and escalates critical problems to humans. It's the first line of defense for production incidents.

## What It Does

The Incident Responder:

- **Monitors Production**: Continuous health checks and error monitoring
- **Detects Incidents**: Identifies errors, crashes, and anomalies
- **Diagnoses Root Causes**: Analyzes logs, commits, and code to find issues
- **Attempts Auto-Fixes**: Applies simple, safe fixes automatically
- **Escalates Appropriately**: Notifies humans for complex/critical issues
- **Documents Incidents**: Maintains incident history and patterns
- **Provides Context**: Links errors to recent code changes

## How It Works

### Trigger Events

The Incident Responder runs when:
- **Health Check Fails** - Every 5 minutes health check detects issue
- **Railway Webhook** - Railway app reports error or crash
- **Manual Trigger** - On-demand incident investigation
- **Repository Dispatch** - Other systems report errors

### Workflow Process

#### Health Check Mode (Every 5 Minutes)

1. **Check Application**: Sends HTTP request to health endpoint
2. **Evaluate Response**: Checks for 200 OK status
3. **Trigger Response**: If failed, dispatches incident response workflow
4. **Log Status**: Records health check result

#### Incident Response Mode

1. **Parse Incident**: Extracts error details and source
2. **Fetch Logs**: Retrieves recent Railway/application logs
3. **Gather Context**: Gets recent commits and file changes
4. **Load Knowledge**: References codebase architecture
5. **AI Diagnosis**: Deep analysis to find root cause
6. **Determine Action**: Decide on auto-fix, escalate, or create issue
7. **Execute Response**: Apply fix or notify humans
8. **Log Incident**: Record in incident history

### Severity Classification

**🔴 Critical**:
- Service completely down
- Data loss or corruption
- Security breach
- Immediate user impact

**🟠 High**:
- Major feature broken
- Significant degradation
- Many users affected
- SLA at risk

**🟡 Medium**:
- Feature degraded
- Workaround exists
- Limited users affected
- Not blocking

**🟢 Low**:
- Minor issue
- Cosmetic problem
- Edge case
- No user impact

## Configuration Options

### In `.github/agents/config.yml`

```yaml
agents:
  incident-responder:
    enabled: true
    
    # Health check settings
    health_check:
      enabled: true
      interval: "*/5 * * * *"     # Every 5 minutes
      endpoint: "/health"
      timeout: 30                  # seconds
      retry_count: 2
    
    # Severity escalation rules
    escalation:
      critical: "immediate"        # Email immediately
      high: "15m"                 # Wait 15 min before escalating
      medium: "1h"                # Wait 1 hour
      low: "never"                # Don't escalate, just log
    
    # Auto-fix settings
    auto_fix:
      enabled: true
      max_severity: "medium"      # Don't auto-fix high/critical
      require_tests: true         # Only if tests pass
      max_attempts: 1             # Don't retry failed fixes
    
    # Notification settings
    notifications:
      email_critical: true
      email_high: true
      email_medium: false
      include_logs: true
      include_recent_changes: true
```

### Required Secrets

```yaml
ANTHROPIC_API_KEY    # Claude API for diagnosis
RESEND_API_KEY       # Email service for alerts
ALERT_EMAIL          # Recipient for incident alerts
APP_HEALTH_URL       # Base URL for health checks
RAILWAY_TOKEN        # Railway API access (optional)
RAILWAY_PROJECT_ID   # Railway project (optional)
```

## Incident Report Format

### Diagnosis Output

```json
{
  "incidentId": "INC-20241230-042",
  "severity": "high",
  "rootCause": "Database connection pool exhausted",
  "analysis": "The application ran out of database connections due to a connection leak in the user authentication middleware. Each request was opening a new connection but not properly closing it, leading to pool exhaustion after ~100 requests.",
  "affectedFiles": [
    "src/middleware/authenticate.ts",
    "src/lib/database.ts"
  ],
  "relatedCommits": [
    "abc123 - Update auth middleware",
    "def456 - Refactor database client"
  ],
  "canAutoFix": false,
  "fixDescription": "Add proper connection cleanup in auth middleware finally block",
  "fixCommands": [],
  "verificationSteps": [
    "Monitor database connection count",
    "Verify connections are released after auth",
    "Load test with 200 concurrent requests"
  ],
  "escalationReason": "Requires code changes and deployment",
  "preventionRecommendations": [
    "Add connection pool monitoring alerts",
    "Implement connection leak detection in tests",
    "Use connection middleware with automatic cleanup"
  ]
}
```

### GitHub Issue Created

```markdown
## 🚨 Incident Report: INC-20241230-042

**Severity**: 🟠 High
**Detected**: 2024-12-30T04:25:13Z
**Status**: Under Investigation

---

### Error

```
Error: Connection pool exhausted
  at Database.connect (database.ts:45)
  at authenticate (middleware/authenticate.ts:23)
  at Layer.handle (express/lib/router/layer.js:95)
```

---

### Diagnosis

**Root Cause**: Database connection pool exhausted

**Analysis**:
The application ran out of database connections due to a connection leak in the user authentication middleware. Each request was opening a new connection but not properly closing it, leading to pool exhaustion after ~100 requests.

**How it happened**:
1. Recent refactor in commit abc123 changed auth middleware
2. New code opens DB connection in try block
3. Missing finally block to ensure connection closes
4. Under load, connections accumulate until pool exhausted
5. All subsequent requests fail with connection error

---

### Affected Components

- `src/middleware/authenticate.ts` - Connection leak
- `src/lib/database.ts` - Connection pool management

---

### Related Changes

Recent commits that may have introduced this:
- abc123 (2024-12-29) - Update auth middleware
- def456 (2024-12-29) - Refactor database client

---

### Recommended Fix

Add proper connection cleanup in auth middleware:

```typescript
// In src/middleware/authenticate.ts
export async function authenticate(req, res, next) {
  const conn = await db.connect();
  try {
    const user = await validateToken(req.headers.authorization, conn);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  } finally {
    // MISSING: Connection cleanup
    await conn.release();  // ADD THIS
  }
}
```

---

### Verification Steps

After deploying fix:
1. Monitor database connection count (should stay below pool size)
2. Verify connections are released after each auth request
3. Load test with 200 concurrent requests
4. Check for any remaining connection leaks

---

### Prevention Recommendations

**Short-term**:
1. Add connection pool monitoring with alerts at 80% capacity
2. Implement connection leak detection in integration tests
3. Add database connection metrics to dashboard

**Long-term**:
1. Use connection middleware with automatic cleanup
2. Consider connection pooling at application level
3. Add automated load testing to CI/CD

---

### Incident Timeline

- **04:25:13** - Health check failed (connection timeout)
- **04:25:45** - Incident Responder triggered
- **04:26:30** - Diagnosis completed
- **04:27:00** - GitHub issue created
- **04:27:15** - Alert email sent to on-call

---

**Priority**: Address before next deployment

*Generated by Incident Responder Agent*
```

### Escalation Email

```html
Subject: 🟠 [HIGH] Production Incident: Database Connection Leak

<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; line-height: 1.6;">
  <div style="background: #f59e0b; color: white; padding: 20px;">
    <h1>🟠 Production Incident</h1>
    <p>Incident ID: INC-20241230-042</p>
    <p>Severity: HIGH | Detected: 2024-12-30 04:25:13 UTC</p>
  </div>
  
  <div style="padding: 20px;">
    <h2>Error</h2>
    <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; font-family: monospace;">
      Error: Connection pool exhausted<br/>
      at Database.connect (database.ts:45)
    </div>
    
    <h2>Root Cause</h2>
    <p>Database connection pool exhausted due to connection leak in authentication middleware.</p>
    
    <h2>Impact</h2>
    <ul>
      <li>All authenticated requests failing</li>
      <li>~50 users affected in last 5 minutes</li>
      <li>Service degraded but not completely down</li>
    </ul>
    
    <h2>Affected Files</h2>
    <ul>
      <li><code>src/middleware/authenticate.ts</code></li>
      <li><code>src/lib/database.ts</code></li>
    </ul>
    
    <h2>Recommended Action</h2>
    <p>Deploy fix to add connection cleanup in finally block.</p>
    <pre style="background: #f3f4f6; padding: 12px;">
finally {
  await conn.release();
}
    </pre>
    
    <h2>Related Changes</h2>
    <p>Likely introduced in commit abc123 from 2024-12-29</p>
    
    <a href="https://github.com/OWNER/REPO/issues/XXX" 
       style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none;">
      View Full Incident Report
    </a>
  </div>
</body>
</html>
```

## Auto-Fix Capabilities

The agent can automatically fix simple, safe issues:

### Fixable Issues

**Service Restart** (transient errors):
- Memory exhaustion recovered on restart
- Hanging process
- Stuck worker threads

**Configuration Updates**:
- Missing environment variable (if value known)
- Incorrect configuration value
- Rate limit adjustments

**Cache Clearing**:
- Stale cache causing issues
- Cache corruption

**Rollback**:
- Recent deployment causing issues
- Known bad commit

### Non-Fixable Issues (Escalate)

**Requires Code Changes**:
- Logic errors
- Missing error handling
- Algorithm bugs

**Requires Human Decision**:
- Security incidents
- Data corruption
- Performance degradation
- Multiple root causes

**High Risk**:
- Database migrations
- Schema changes
- Authentication changes

## Railway Integration

### Webhook Setup

Create a webhook receiver:

```javascript
// webhook-receiver/index.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { type, message, service, timestamp } = req.body;
  
  // Verify webhook signature
  const signature = req.headers['x-railway-signature'];
  if (signature !== process.env.RAILWAY_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Only process errors/crashes
  if (type !== 'error' && type !== 'crash') {
    return res.status(200).json({ status: 'ignored' });
  }
  
  // Trigger GitHub Actions
  await fetch(
    `https://api.github.com/repos/OWNER/REPO/dispatches`,
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
          timestamp,
          type
        }
      })
    }
  );
  
  return res.status(200).json({ status: 'dispatched' });
}
```

Deploy this as a separate Railway service or Vercel function, then configure Railway to send webhooks to it.

## Best Practices

### For Operations Teams

1. **Monitor Alert Volume**: Tune thresholds to reduce noise
2. **Review Auto-Fixes**: Ensure they're appropriate
3. **Track Incident Patterns**: Use history for prevention
4. **Update Escalation Rules**: Adjust based on experience
5. **Test Health Endpoints**: Ensure they're reliable

### For Developers

1. **Implement Health Checks**: Comprehensive, fast endpoints
2. **Add Context to Errors**: Include relevant debugging info
3. **Use Structured Logging**: Makes diagnosis easier
4. **Monitor Locally**: Test error scenarios
5. **Document Common Issues**: Help agent learn patterns

## Troubleshooting

### False Alarms

**Symptoms**: Agent reports incidents for normal conditions

**Solutions**:
- Tune health check timeout
- Add retry logic
- Adjust severity thresholds
- Whitelist expected errors

### Missed Incidents

**Symptoms**: Real issues not detected

**Solutions**:
- Shorten health check interval
- Add more comprehensive health checks
- Enable Railway webhook integration
- Monitor additional signals

### Poor Diagnosis

**Symptoms**: Root cause analysis is incorrect

**Solutions**:
- Ensure Librarian knowledge is current
- Add more context to logs
- Include relevant recent commits
- Update diagnosis prompt

### Auto-Fix Failures

**Symptoms**: Attempted fixes don't resolve issue

**Solutions**:
- Review fix logic
- Disable auto-fix for problematic patterns
- Add verification steps
- Increase escalation threshold

## Advanced Features

### Incident Correlation

Link related incidents:

```yaml
- name: Find similar incidents
  run: |
    # Search for similar errors in history
    grep "$ERROR_PATTERN" .github/agents/knowledge/incident-history.csv
```

### Automated Remediation

Execute fixes automatically:

```yaml
- name: Restart service
  if: steps.diagnosis.outputs.can_auto_fix == 'true'
  run: |
    railway service restart --service=$SERVICE_ID
```

### Incident Postmortems

Generate postmortem templates:

```yaml
- name: Create postmortem
  if: steps.incident.outputs.severity == 'critical'
  run: |
    # Generate postmortem document
    ./scripts/create-postmortem.sh $INCIDENT_ID
```

## Performance Considerations

- **Health Check**: ~2 seconds every 5 minutes
- **Diagnosis Time**: 30-90 seconds
- **API Usage**: 2000-4000 tokens per incident
- **Scalability**: Can handle 1000s of health checks/day

## Related Documentation

- [Security Audit Agent](./security-audit.md) - Security incident prevention
- [Codebase Librarian](./librarian.md) - Code context for diagnosis
- [Code Review Agent](./code-review.md) - Pre-merge issue prevention

// .github/agents/scripts/send-notification.js
// Notification service for agent ecosystem

import { Resend } from 'resend';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendIncidentEmail() {
  // Load diagnosis if available
  let diagnosis = {};
  try {
    const diagnosisFile = process.env.DIAGNOSIS_FILE || 'diagnosis.json';
    if (fs.existsSync(diagnosisFile)) {
      diagnosis = JSON.parse(fs.readFileSync(diagnosisFile, 'utf8'));
    }
  } catch (e) {
    console.log('Could not load diagnosis file:', e.message);
  }
  
  const incidentId = process.env.INCIDENT_ID || 'Unknown';
  const severity = process.env.SEVERITY || 'medium';
  const error = process.env.ERROR || 'Unknown error';
  const rootCause = process.env.ROOT_CAUSE || diagnosis.rootCause || 'Under investigation';
  
  const severityEmoji = {
    'critical': '🔴',
    'high': '🟠',
    'medium': '🟡',
    'low': '🟢'
  };
  
  const severityColor = {
    'critical': '#dc2626',
    'high': '#f59e0b',
    'medium': '#eab308',
    'low': '#22c55e'
  };
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: ${severityColor[severity] || '#f59e0b'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0 0 8px 0; font-size: 20px; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
    .section { margin: 16px 0; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
    .section h3 { margin-top: 0; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .error-box { background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 13px; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
    .action-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; font-weight: 500; }
    .meta { color: rgba(255,255,255,0.9); font-size: 14px; }
    ul { margin: 0; padding-left: 20px; }
    li { margin: 4px 0; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
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
      <div class="error-box">${escapeHtml(error)}</div>
    </div>
    
    <div class="section">
      <h3>Root Cause Analysis</h3>
      <p><strong>${escapeHtml(rootCause)}</strong></p>
      ${diagnosis.analysis ? `<p>${escapeHtml(diagnosis.analysis)}</p>` : ''}
    </div>
    
    ${diagnosis.affectedFiles && diagnosis.affectedFiles.length > 0 ? `
    <div class="section">
      <h3>Affected Files</h3>
      <ul>
        ${diagnosis.affectedFiles.map(f => `<li><code>${escapeHtml(f)}</code></li>`).join('')}
      </ul>
    </div>
    ` : ''}
    
    <div class="section">
      <h3>Recommended Action</h3>
      <p>${escapeHtml(diagnosis.fixDescription || 'Manual investigation required')}</p>
      ${diagnosis.verificationSteps && diagnosis.verificationSteps.length > 0 ? `
      <p><strong>Verification steps:</strong></p>
      <ol>
        ${diagnosis.verificationSteps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
      </ol>
      ` : ''}
    </div>
    
    <a href="https://github.com/${process.env.GITHUB_REPOSITORY || 'owner/repo'}/actions" class="action-button">
      View in GitHub Actions
    </a>
  </div>
</body>
</html>
  `;
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Incident Responder <incidents@yourdomain.com>',
      to: [process.env.RECIPIENT_EMAIL],
      subject: `${severityEmoji[severity] || '⚠️'} [${severity.toUpperCase()}] Production Incident: ${incidentId}`,
      html: html,
    });
    
    if (error) {
      console.error('Failed to send email:', error);
      process.exit(1);
    }
    
    console.log('✅ Incident notification sent:', data?.id);
  } catch (error) {
    console.error('Error sending notification:', error);
    process.exit(1);
  }
}

async function sendDailyDigest() {
  const digestFile = process.env.DIGEST_FILE || 'daily-digest.html';
  
  let digestHtml = '<p>No digest content available</p>';
  try {
    if (fs.existsSync(digestFile)) {
      digestHtml = fs.readFileSync(digestFile, 'utf8');
    }
  } catch (e) {
    console.log('Could not load digest file:', e.message);
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Agent Orchestrator <agents@yourdomain.com>',
      to: [process.env.RECIPIENT_EMAIL],
      subject: `📊 Daily Repository Digest - ${today}`,
      html: digestHtml,
    });
    
    if (error) {
      console.error('Failed to send digest:', error);
      process.exit(1);
    }
    
    console.log('✅ Daily digest sent:', data?.id);
  } catch (error) {
    console.error('Error sending digest:', error);
    process.exit(1);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Route based on notification type
const type = process.env.NOTIFICATION_TYPE;

switch (type) {
  case 'incident-escalation':
    sendIncidentEmail();
    break;
  case 'daily-digest':
    sendDailyDigest();
    break;
  default:
    console.log('Unknown notification type:', type);
    console.log('Available types: incident-escalation, daily-digest');
    process.exit(1);
}

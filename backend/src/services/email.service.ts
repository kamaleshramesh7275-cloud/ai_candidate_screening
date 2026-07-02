import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const APP_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const APP_NAME = 'AI Recruiter';

// ── Shared HTML shell ─────────────────────────────────────────────────────────
function shell(accentColor: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#0f0f17;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f17;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <div style="display:inline-block;background:linear-gradient(135deg,${accentColor},#8b5cf6);border-radius:16px;padding:3px;">
                <div style="background:#0f0f17;border-radius:14px;padding:14px 28px;">
                  <span style="font-size:20px;font-weight:800;letter-spacing:-0.5px;color:#fff;">${APP_NAME}</span>
                </div>
              </div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#16162a;border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px 36px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="color:#4b5563;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
              <p style="color:#374151;font-size:11px;margin:6px 0 0;">You received this because you have an account on ${APP_NAME}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function btn(href: string, label: string, color: string): string {
  return `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,${color},#8b5cf6);color:#fff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:12px;margin-top:24px;">${label} &rarr;</a>`;
}

function heading(text: string, color: string): string {
  return `<h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${color};letter-spacing:-0.5px;">${text}</h1>`;
}

function para(text: string): string {
  return `<p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:12px 0;">${text}</p>`;
}

function divider(): string {
  return `<div style="border-top:1px solid rgba(255,255,255,0.07);margin:24px 0;"></div>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="color:#6b7280;font-size:13px;padding:6px 0;white-space:nowrap;padding-right:16px;">${label}</td>
    <td style="color:#e2e8f0;font-size:13px;padding:6px 0;font-weight:600;">${value}</td>
  </tr>`;
}

// ── 1. Welcome Email (on registration) ────────────────────────────────────────
export async function sendWelcomeEmail(
  to: string,
  name: string,
  role: 'candidate' | 'recruiter'
): Promise<void> {
  const isCandidate = role === 'candidate';
  const accent = isCandidate ? '#2a5bff' : '#ff2a75';
  const roleLabel = isCandidate ? 'Candidate' : 'Recruiter';
  const dashboard = isCandidate ? `${APP_URL}/candidate-dashboard` : `${APP_URL}/recruiter-dashboard`;
  const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

  const body = `
    ${heading(`Welcome, ${name}! 🎉`, accent)}
    ${para(`Your <strong style="color:#fff;">${roleLabel}</strong> account on <strong style="color:#fff;">${APP_NAME}</strong> has been created successfully.`)}
    ${para(isCandidate
      ? 'You can now browse open job listings, apply to roles, and track your applications — all in one place.'
      : 'You can now post job listings, review applications, and manage your hiring pipeline effortlessly.')}
    ${divider()}
    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;">
      <tbody>
        ${infoRow('Account email', to)}
        ${infoRow('Account type', roleLabel)}
        ${infoRow('Registered at', loginTime)}
      </tbody>
    </table>
    <div style="text-align:center;">
      ${btn(dashboard, `Go to your Dashboard`, accent)}
    </div>
    ${divider()}
    ${para(`If you didn&apos;t create this account, please ignore this email.`)}
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Welcome to ${APP_NAME}! Your ${roleLabel} account is ready`,
      html: shell(accent, body),
    });
    console.log(`[Email] Welcome email sent to ${to}`);
  } catch (err) {
    console.error('[Email] Failed to send welcome email:', err);
  }
}

// ── 2. Login Alert Email ──────────────────────────────────────────────────────
export async function sendLoginAlertEmail(
  to: string,
  name: string,
  role: 'candidate' | 'recruiter',
  ip: string
): Promise<void> {
  const isCandidate = role === 'candidate';
  const accent = isCandidate ? '#2a5bff' : '#ff2a75';
  const roleLabel = isCandidate ? 'Candidate' : 'Recruiter';
  const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

  const body = `
    ${heading('New Sign-In Detected 🔐', '#f59e0b')}
    ${para(`Hi <strong style="color:#fff;">${name}</strong>, we noticed a new sign-in to your <strong style="color:#fff;">${roleLabel}</strong> account.`)}
    ${divider()}
    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:16px;">
      <tbody>
        ${infoRow('Time', loginTime)}
        ${infoRow('IP Address', ip || 'Unknown')}
        ${infoRow('Account', to)}
        ${infoRow('Role', roleLabel)}
      </tbody>
    </table>
    ${divider()}
    ${para('If this was you, no action is needed. If you did not sign in, please change your password immediately.')}
    <div style="text-align:center;">
      ${btn(`${APP_URL}/login?role=${role}`, 'Secure My Account', '#f59e0b')}
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `New sign-in to your ${APP_NAME} account`,
      html: shell('#f59e0b', body),
    });
    console.log(`[Email] Login alert sent to ${to}`);
  } catch (err) {
    console.error('[Email] Failed to send login alert:', err);
  }
}

// ── 3. New Job Notification (to all candidates) ───────────────────────────────
export async function sendNewJobEmail(
  candidates: { email: string; name: string }[],
  job: { id: string; title: string; companyName: string; salary: string; domain: string; description: string }
): Promise<void> {
  if (candidates.length === 0) return;
  const accent = '#2a5bff';
  const shortDesc = job.description.length > 200
    ? job.description.slice(0, 200) + '…'
    : job.description;

  for (const candidate of candidates) {
    const body = `
      ${heading('New Job Opening 🚀', accent)}
      ${para(`Hi <strong style="color:#fff;">${candidate.name}</strong>, a new role has just been posted that might be a great fit for you!`)}
      ${divider()}
      <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(42,91,255,0.06);border:1px solid rgba(42,91,255,0.2);border-radius:12px;padding:16px;">
        <tbody>
          ${infoRow('Role', job.title)}
          ${infoRow('Company', job.companyName)}
          ${infoRow('Salary', job.salary)}
          ${infoRow('Domain', job.domain)}
        </tbody>
      </table>
      ${divider()}
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0;">${shortDesc}</p>
      <div style="text-align:center;">
        ${btn(`${APP_URL}/apply?job=${job.id}`, 'View &amp; Apply Now', accent)}
      </div>
      ${divider()}
      ${para('Log in to your dashboard to apply before the position closes.')}
    `;

    try {
      await resend.emails.send({
        from: FROM,
        to: candidate.email,
        subject: `New Job: ${job.title} at ${job.companyName} — ${APP_NAME}`,
        html: shell(accent, body),
      });
      console.log(`[Email] New job notification sent to ${candidate.email}`);
    } catch (err) {
      console.error(`[Email] Failed to send job notification to ${candidate.email}:`, err);
    }
  }
}

// ── 4. Test Result Summary (to recruiter) ────────────────────────────────────
export async function sendTestResultEmail(
  recruiter: { email: string; name: string },
  candidate: { name: string; email: string },
  job: { title: string; companyName: string },
  scores: {
    testScore: number;
    resumeScore: number | null;
    githubScore: number | null;
    overallScore: number;
    cheatStrikes: number;
  }
): Promise<void> {
  const accent = '#ff2a75';
  const scoreColor = (s: number) =>
    s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444';

  const overall = Math.round(scores.overallScore);
  const test = Math.round(scores.testScore);
  const resume = scores.resumeScore !== null ? Math.round(scores.resumeScore) : null;
  const github = scores.githubScore !== null ? Math.round(scores.githubScore) : null;

  const body = `
    ${heading('Test Result Ready 📊', accent)}
    ${para(`Hi <strong style="color:#fff;">${recruiter.name}</strong>, a candidate has just submitted their assessment for a role you posted.`)}
    ${divider()}
    <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(255,42,117,0.06);border:1px solid rgba(255,42,117,0.2);border-radius:12px;padding:16px;">
      <tbody>
        ${infoRow('Candidate', candidate.name)}
        ${infoRow('Email', candidate.email)}
        ${infoRow('Job', job.title)}
        ${infoRow('Company', job.companyName)}
      </tbody>
    </table>
    ${divider()}
    <p style="color:#94a3b8;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Score Breakdown</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-radius:12px;overflow:hidden;">
      <tbody>
        <tr style="background:rgba(255,255,255,0.03);">
          <td style="color:#94a3b8;font-size:13px;padding:10px 16px;">Test Score</td>
          <td style="color:${scoreColor(test)};font-size:20px;font-weight:800;padding:10px 16px;text-align:right;">${test}%</td>
        </tr>
        ${resume !== null ? `<tr><td style="color:#94a3b8;font-size:13px;padding:10px 16px;">Resume Score</td><td style="color:${scoreColor(resume)};font-size:20px;font-weight:800;padding:10px 16px;text-align:right;">${resume}%</td></tr>` : ''}
        ${github !== null ? `<tr style="background:rgba(255,255,255,0.03);"><td style="color:#94a3b8;font-size:13px;padding:10px 16px;">GitHub Score</td><td style="color:${scoreColor(github)};font-size:20px;font-weight:800;padding:10px 16px;text-align:right;">${github}%</td></tr>` : ''}
        <tr style="background:rgba(255,42,117,0.1);border-top:1px solid rgba(255,42,117,0.2);">
          <td style="color:#fff;font-size:14px;font-weight:700;padding:12px 16px;">Overall Score</td>
          <td style="color:${scoreColor(overall)};font-size:24px;font-weight:900;padding:12px 16px;text-align:right;">${overall}%</td>
        </tr>
      </tbody>
    </table>
    ${scores.cheatStrikes > 0 ? `${divider()}<p style="color:#ef4444;font-size:13px;font-weight:600;margin:0;">&#9888; ${scores.cheatStrikes} integrity strike(s) detected. Review the session recording in your dashboard.</p>` : ''}
    <div style="text-align:center;">
      ${btn(`${APP_URL}/recruiter-dashboard`, 'Review in Dashboard', accent)}
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: recruiter.email,
      subject: `Test result: ${candidate.name} for ${job.title} — ${overall}% overall`,
      html: shell(accent, body),
    });
    console.log(`[Email] Test result email sent to ${recruiter.email}`);
  } catch (err) {
    console.error('[Email] Failed to send test result email:', err);
  }
}

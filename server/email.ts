import { runSql } from './db.js';

export interface EmailPayload {
  to: string;
  recipientName: string;
  studentId?: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export function generateEmailHtml(template: string, data: Record<string, any>): string {
  const brandHeader = `
    <div style="background: #0a192f; padding: 24px; text-align: center; border-bottom: 3px solid #0284c7;">
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px; font-family: 'Plus Jakarta Sans', sans-serif;">TECHCLASS</h1>
      <p style="color: #38bdf8; margin: 4px 0 0; font-size: 13px;">A DynoDazzle EdTech Initiative • techclass.dynodazzle.in</p>
    </div>
  `;

  const brandFooter = `
    <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px;">Official Support: <a href="mailto:dynodazzle@gmail.com" style="color: #0284c7;">dynodazzle@gmail.com</a> | Paid WhatsApp: <strong>+91 7770032149</strong></p>
      <p style="margin: 0;">© 2026 TechClass (DynoDazzle). India's Digital Classroom for Government Exam Preparation.</p>
    </div>
  `;

  let bodyContent = '';

  switch (template) {
    case 'welcome':
      bodyContent = `
        <h2 style="color: #0f172a; margin-top: 0;">Welcome to TechClass, ${data.name}!</h2>
        <p style="color: #334155; line-height: 1.6;">Your student registration has been completed successfully. Your unique TechClass Student ID is:</p>
        <div style="background: #f0fdf4; border: 1px dashed #16a34a; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
          <span style="font-size: 13px; color: #166534; display: block; font-weight: 600;">YOUR PERMANENT STUDENT ID</span>
          <strong style="font-size: 24px; color: #15803d; letter-spacing: 2px;">${data.studentId}</strong>
        </div>
        <p style="color: #334155; line-height: 1.6;">You can now start practicing with our free mock tests, reading sample PDFs, and tracking your preparation for <strong>${data.targetExams || 'Competitive Exams'}</strong>.</p>
      `;
      break;

    case 'payment_submitted':
      bodyContent = `
        <h2 style="color: #0f172a; margin-top: 0;">Payment Submitted – Verification Pending</h2>
        <p style="color: #334155; line-height: 1.6;">Hello <strong>${data.name}</strong> (Student ID: <code>${data.studentId}</code>),</p>
        <p style="color: #334155; line-height: 1.6;">We have received your payment details. Your transaction is currently awaiting manual verification by the TechClass administration team.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px; color: #64748b;">UTR / Reference No:</td><td style="padding: 8px; font-weight: bold; color: #0f172a;">${data.utr}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px; color: #64748b;">Amount:</td><td style="padding: 8px; font-weight: bold; color: #0f172a;">₹${data.amount}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px; color: #64748b;">Payment Date:</td><td style="padding: 8px; color: #0f172a;">${data.paymentDate}</td></tr>
          <tr><td style="padding: 8px; color: #64748b;">Current Status:</td><td style="padding: 8px; color: #d97706; font-weight: bold;">PENDING VERIFICATION</td></tr>
        </table>
        <p style="color: #334155; line-height: 1.6;">Our admin team verifies transactions within 2-4 business hours. You will receive an immediate activation email once confirmed.</p>
      `;
      break;

    case 'payment_approved':
      bodyContent = `
        <h2 style="color: #15803d; margin-top: 0;">🎉 TechClass Membership Activated!</h2>
        <p style="color: #334155; line-height: 1.6;">Dear <strong>${data.name}</strong> (Student ID: <code>${data.studentId}</code>),</p>
        <p style="color: #334155; line-height: 1.6;">Your UPI payment of <strong>₹${data.amount}</strong> (UTR: <code>${data.utr}</code>) has been successfully verified and approved!</p>
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 18px; margin: 18px 0;">
          <h3 style="margin: 0 0 10px; color: #065f46;">TechClass Annual Pass Details</h3>
          <p style="margin: 4px 0; color: #047857;"><strong>Membership Status:</strong> ACTIVE</p>
          <p style="margin: 4px 0; color: #047857;"><strong>Valid From:</strong> ${new Date(data.startDate).toLocaleDateString('en-IN')}</p>
          <p style="margin: 4px 0; color: #047857;"><strong>Valid Until:</strong> ${new Date(data.expiryDate).toLocaleDateString('en-IN')}</p>
          <p style="margin: 4px 0; color: #047857;"><strong>Student WhatsApp Support:</strong> +91 7770032149</p>
        </div>
        <p style="color: #334155; line-height: 1.6;">All full-length mock tests, premium digital PDFs, and E-Ink reading mode are now unlocked in your dashboard.</p>
      `;
      break;

    case 'payment_rejected':
      bodyContent = `
        <h2 style="color: #b91c1c; margin-top: 0;">TechClass Payment Verification Update</h2>
        <p style="color: #334155; line-height: 1.6;">Dear <strong>${data.name}</strong> (Student ID: <code>${data.studentId}</code>),</p>
        <p style="color: #334155; line-height: 1.6;">Your submitted payment of <strong>₹${data.amount}</strong> with UTR <code>${data.utr}</code> could not be verified by the admin team.</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <strong style="color: #991b1b; display: block; margin-bottom: 4px;">Reason from Administration:</strong>
          <p style="margin: 0; color: #7f1d1d;">${data.reason || 'Transaction could not be verified in bank records. Please check the UTR reference number.'}</p>
        </div>
        <p style="color: #334155; line-height: 1.6;">You can resubmit the corrected transaction reference number or reach out to support at <a href="mailto:dynodazzle@gmail.com">dynodazzle@gmail.com</a>.</p>
      `;
      break;

    case 'otp_reset':
      bodyContent = `
        <h2 style="color: #0f172a; margin-top: 0;">Password Recovery OTP</h2>
        <p style="color: #334155; line-height: 1.6;">We received a request to reset the password for your TechClass account.</p>
        <div style="background: #f1f5f9; border: 1px dashed #94a3b8; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 13px; color: #475569; display: block; margin-bottom: 6px;">ONE-TIME SECURITY CODE</span>
          <strong style="font-size: 32px; letter-spacing: 6px; color: #0284c7; font-family: monospace;">${data.otp}</strong>
          <span style="font-size: 12px; color: #94a3b8; display: block; margin-top: 6px;">Valid for 15 minutes. Never share this code with anyone.</span>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you did not request this, please ignore this email or notify DynoDazzle security immediately.</p>
      `;
      break;

    default:
      bodyContent = `<p>${data.message || 'Notification from TechClass'}</p>`;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 0; background: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          ${brandHeader}
          <div style="padding: 32px 28px;">
            ${bodyContent}
          </div>
          ${brandFooter}
        </div>
      </body>
    </html>
  `;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; id: string }> {
  const emailId = 'eml_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  const html = generateEmailHtml(payload.template, payload.data);
  const bodyPreview = (payload.data.message || payload.subject).substring(0, 150);

  try {
    runSql(
      `INSERT INTO email_logs (id, recipient_email, recipient_name, subject, template_name, status, body_preview, sent_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        emailId,
        payload.to,
        payload.recipientName,
        payload.subject,
        payload.template,
        'DELIVERED',
        bodyPreview,
        now
      ]
    );

    console.log(`[Email Service] Delivered '${payload.subject}' to ${payload.to} (${payload.recipientName})`);
    return { success: true, id: emailId };
  } catch (err) {
    console.error('[Email Service] Error logging email:', err);
    return { success: false, id: emailId };
  }
}

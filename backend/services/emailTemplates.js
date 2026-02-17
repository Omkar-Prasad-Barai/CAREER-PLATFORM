// ============================================================
//  HTML EMAIL TEMPLATES — Inline CSS only (email client compat)
// ============================================================

const BRAND = {
  bg: '#F5F4F0',
  text: '#1A1D23',
  muted: '#4B5563',
  indigo: '#6366F1',
  teal: '#14B8A6',
  red: '#EF4444',
  border: '#E5E7EB',
  font: "'Helvetica Neue', Arial, sans-serif",
};

/** Shared wrapper for all templates */
const wrap = (bodyContent) => `
<div style="max-width:600px;margin:0 auto;font-family:${BRAND.font};background:${BRAND.bg};border-radius:16px;overflow:hidden;border:1px solid ${BRAND.border};">
  <div style="height:4px;background:${BRAND.indigo};"></div>
  <div style="padding:32px 28px 12px;">
    <p style="font-size:20px;font-weight:700;color:${BRAND.indigo};margin:0 0 24px;">CareerConnect</p>
  </div>
  <div style="padding:0 28px 32px;">
    ${bodyContent}
  </div>
  <div style="padding:20px 28px;border-top:1px solid ${BRAND.border};">
    <p style="color:#9CA3AF;font-size:11px;line-height:1.5;margin:0;">
      &copy; CareerConnect &middot; You're receiving this because you have an account with us.
    </p>
  </div>
</div>
`;

const ctaButton = (label, url, color = BRAND.indigo) => `
<div style="text-align:center;margin:28px 0;">
  <a href="${url}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:600;font-size:15px;">
    ${label}
  </a>
</div>
`;

// ============================================================
//  TEMPLATE 1 — Connection Approved (Seeker)
// ============================================================
export const connectionApprovedSeeker = ({ seekerName, facilitatorName, opportunityTitle, platformUrl }) => {
  return wrap(`
    <h2 style="color:${BRAND.text};font-size:20px;font-weight:700;margin:0 0 16px;">Great News!</h2>
    <p style="color:${BRAND.muted};font-size:14px;line-height:1.7;margin:0 0 8px;">
      Hi ${seekerName},
    </p>
    <p style="color:${BRAND.muted};font-size:14px;line-height:1.7;margin:0 0 20px;">
      Your connection request for <strong style="color:${BRAND.text};">${opportunityTitle}</strong> has been approved by our admin team. You are now connected with <strong style="color:${BRAND.text};">${facilitatorName}</strong>.
    </p>
    ${ctaButton('View Your Connection', `${platformUrl}/dashboard`)}
    <div style="background:#fff;border:1px solid ${BRAND.border};border-radius:12px;padding:20px;margin-top:24px;">
      <p style="color:${BRAND.text};font-size:14px;font-weight:600;margin:0 0 12px;">What's Next?</p>
      <ol style="color:${BRAND.muted};font-size:13px;line-height:1.8;margin:0;padding-left:18px;">
        <li>Log in to your CareerConnect dashboard.</li>
        <li>Navigate to 'My Connections' to message ${facilitatorName} directly.</li>
        <li>Explore more opportunities tailored for you.</li>
      </ol>
    </div>
  `);
};

// ============================================================
//  TEMPLATE 2 — Connection Approved (Facilitator)
// ============================================================
export const connectionApprovedFacilitator = ({ facilitatorName, seekerName, seekerProfile, opportunityTitle, platformUrl }) => {
  return wrap(`
    <h2 style="color:${BRAND.text};font-size:20px;font-weight:700;margin:0 0 16px;">New Connection Approved</h2>
    <p style="color:${BRAND.muted};font-size:14px;line-height:1.7;margin:0 0 8px;">
      Hi ${facilitatorName},
    </p>
    <p style="color:${BRAND.muted};font-size:14px;line-height:1.7;margin:0 0 20px;">
      A connection request for <strong style="color:${BRAND.text};">${opportunityTitle}</strong> from <strong style="color:${BRAND.text};">${seekerName}</strong> has been approved.
    </p>
    ${ctaButton(`View ${seekerName}'s Profile`, `${platformUrl}/profile/${seekerProfile}`)}
    <div style="background:#fff;border:1px solid ${BRAND.border};border-radius:12px;padding:20px;margin-top:24px;">
      <p style="color:${BRAND.text};font-size:14px;font-weight:600;margin:0 0 8px;">Applicant Snapshot</p>
      <p style="color:${BRAND.muted};font-size:13px;line-height:1.6;margin:0;">
        <strong>${seekerName}</strong> has expressed interest in collaborating. Review their full profile on the platform for details.
      </p>
    </div>
  `);
};

// ============================================================
//  TEMPLATE 3 — Application Received (Organization)
// ============================================================
export const applicationReceived = ({ organizationName, applicantName, opportunityTitle, platformUrl }) => {
  return wrap(`
    <h2 style="color:${BRAND.text};font-size:20px;font-weight:700;margin:0 0 16px;">New Application Received</h2>
    <p style="color:${BRAND.muted};font-size:14px;line-height:1.7;margin:0 0 8px;">
      Hi ${organizationName},
    </p>
    <p style="color:${BRAND.muted};font-size:14px;line-height:1.7;margin:0 0 20px;">
      <strong style="color:${BRAND.text};">${applicantName}</strong> has submitted an application for <strong style="color:${BRAND.text};">${opportunityTitle}</strong>.
    </p>
    ${ctaButton('Review Application', `${platformUrl}/dashboard/applications`)}
  `);
};

// ============================================================
//  TEMPLATE 4 — Application Status Update (Applicant)
// ============================================================
export const applicationStatusUpdate = ({ applicantName, opportunityTitle, status, platformUrl }) => {
  const isAccepted = status === 'accepted';
  const color = isAccepted ? BRAND.teal : BRAND.red;
  const heading = isAccepted ? 'Congratulations!' : 'Application Update';
  const message = isAccepted
    ? `We're pleased to inform you that your application for <strong style="color:${BRAND.text};">${opportunityTitle}</strong> has been accepted!`
    : `After careful review, your application for <strong style="color:${BRAND.text};">${opportunityTitle}</strong> was not selected at this time. We encourage you to keep applying — the right opportunity is out there.`;

  return wrap(`
    <h2 style="color:${BRAND.text};font-size:20px;font-weight:700;margin:0 0 16px;">${heading}</h2>
    <p style="color:${BRAND.muted};font-size:14px;line-height:1.7;margin:0 0 8px;">
      Hi ${applicantName},
    </p>
    <p style="color:${BRAND.muted};font-size:14px;line-height:1.7;margin:0 0 20px;">
      ${message}
    </p>
    ${ctaButton('Go to Dashboard', `${platformUrl}/dashboard`, color)}
  `);
};

export default {
  connectionApprovedSeeker,
  connectionApprovedFacilitator,
  applicationReceived,
  applicationStatusUpdate,
};

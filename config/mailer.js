const nodemailer = require('nodemailer');

const getTransporter = () => {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
  });
};

// Send order notification email to admin
const sendOrderEmail = async (order, product) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email not configured — skipping order email');
    return;
  }
  const transporter = getTransporter();
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
      <div style="background:#2C1810;padding:24px;text-align:center">
        <h1 style="color:#FDF6E3;font-family:Georgia,serif;margin:0">🌶️ Cielsko</h1>
        <p style="color:#C9961A;margin:4px 0 0;font-size:13px;letter-spacing:2px">NEW PRODUCT ORDER</p>
      </div>
      <div style="padding:32px">
        <h2 style="color:#2C1810;border-bottom:2px solid #F5EDCF;padding-bottom:12px">Order Details</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <tr><td style="padding:8px 0;color:#666;width:40%"><strong>Product</strong></td><td style="padding:8px 0;color:#333">${order.productName}</td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Quantity</strong></td><td style="padding:8px 0;color:#333">${order.quantity || 'Not specified'}</td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Packaging</strong></td><td style="padding:8px 0;color:#333">${order.packaging || 'Not specified'}</td></tr>
        </table>
        <h2 style="color:#2C1810;border-bottom:2px solid #F5EDCF;padding-bottom:12px">Customer Details</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <tr><td style="padding:8px 0;color:#666;width:40%"><strong>Name</strong></td><td style="padding:8px 0;color:#333">${order.name}</td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Email</strong></td><td style="padding:8px 0;color:#333"><a href="mailto:${order.email}">${order.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Phone</strong></td><td style="padding:8px 0;color:#333">${order.phone || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Company</strong></td><td style="padding:8px 0;color:#333">${order.company || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666"><strong>Country</strong></td><td style="padding:8px 0;color:#333">${order.country || '—'}</td></tr>
        </table>
        ${order.message ? `<h2 style="color:#2C1810;border-bottom:2px solid #F5EDCF;padding-bottom:12px">Message</h2><p style="color:#555;line-height:1.6">${order.message}</p>` : ''}
        <div style="margin-top:28px;padding:16px;background:#FDF6E3;border-radius:6px;text-align:center">
          <a href="${process.env.SITE_URL || 'http://localhost:3000'}/admin/orders"
            style="background:#E8601C;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">
            View in Admin Panel
          </a>
        </div>
      </div>
      <div style="background:#F5EDCF;padding:16px;text-align:center;font-size:12px;color:#888">
        Cielsko Admin Notification · <a href="${process.env.SITE_URL || 'http://localhost:3000'}">cielsko.com</a>
      </div>
    </div>`;

  await transporter.sendMail({
    from:    `"Cielsko Website" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `🌶️ New Order: ${order.productName} from ${order.name} (${order.country || 'Unknown'})`,
    html,
  });
  console.log('📧 Order email sent');
};

// Send contact form email
const sendContactEmail = async (contact) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const transporter = getTransporter();
  await transporter.sendMail({
    from:    `"Cielsko Website" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `📩 New Enquiry from ${contact.name} (${contact.country || 'Unknown'})`,
    html: `<p><strong>Name:</strong> ${contact.name}</p>
           <p><strong>Email:</strong> ${contact.email}</p>
           <p><strong>Phone:</strong> ${contact.phone || '—'}</p>
           <p><strong>Country:</strong> ${contact.country || '—'}</p>
           <p><strong>Subject:</strong> ${contact.subject || '—'}</p>
           <p><strong>Message:</strong> ${contact.message}</p>`,
  });
};

module.exports = { sendOrderEmail, sendContactEmail };

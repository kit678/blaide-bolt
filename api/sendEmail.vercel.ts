import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { getEnvironmentConfig } from '../src/config/environment.ts';

type EmailRequestBody = {
  to: string;
  from_email: string;
  from_name: string;
  division: string;
  subject: string;
  message: string;
  phone?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const config = getEnvironmentConfig();
  const apiKey = config.emailService.resendApiKey;

  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured' });
  }

  try {
    const resend = new Resend(apiKey);
    const body = req.body as EmailRequestBody;

    // Skip Firestore update in Vercel environment
    console.log('Skipping Firestore update in Vercel environment');

    // Send email to admin
    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
      from: config.emailService.from,
      to: config.emailService.adminEmail,
      reply_to: body.from_email,
      subject: `New Contact Form Submission: ${body.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${body.from_name} (${body.from_email})</p>
        <p><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
        <p><strong>Division:</strong> ${body.division}</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
      `,
    });

    if (adminEmailError) {
      console.error('Admin email error:', adminEmailError);
      return res.status(500).json({ error: adminEmailError.message });
    }

    // Send confirmation email to user
    const { error: userEmailError } = await resend.emails.send({
      from: config.emailService.from,
      to: body.from_email,
      subject: 'Thank you for contacting Blaide',
      html: `
        <h1>Thank you for contacting Blaide</h1>
        <p>Dear ${body.from_name},</p>
        <p>Thanks for contacting Blaide. We will get back to you shortly.</p>
        <p>Best regards,<br>The Blaide Team</p>
      `,
    });

    if (userEmailError) {
      console.error('User confirmation email error:', userEmailError);
      // Don't return error here as the main email was sent successfully
    }

    return res.status(200).json({ success: true, id: adminEmailData?.id });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
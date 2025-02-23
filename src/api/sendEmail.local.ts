import { Resend } from 'resend';
import { type Request, type Response } from 'express';
import { getEnvironmentConfig } from '../config/environment.js';

type EmailRequestBody = {
  to: string;
  from_email: string;
  from_name: string;
  division: string;
  subject: string;
  message: string;
  phone?: string;
};

export async function POST(req: Request, res: Response, apiKey: string) {
  const config = getEnvironmentConfig();
  try {
    const resend = new Resend(apiKey);
    const body = req.body as EmailRequestBody;

    // Send email to admin
    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
      from: config.emailService.from,
      to: body.to,
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
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
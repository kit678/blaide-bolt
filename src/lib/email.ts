import { getEnvironmentConfig } from '../config/environment';

interface EmailData {
  to: string;
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  division: string;
  phone?: string;
}

export async function sendEmail(data: EmailData) {
  const config = getEnvironmentConfig();
  try {
    const response = await fetch(`${config.apiBaseUrl}/sendEmail`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

interface EmailData {
  to: string;
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  division: string;
}

export async function sendEmail(data: EmailData) {
  try {
    const response = await fetch('http://localhost:3001/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

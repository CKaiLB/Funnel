// Custom API webhook URL from environment variables
const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;

// PDF file path
const ROADMAP_PDF_URL = '/dist/assets/30-Day-AI-Implementation-Roadmap-Advanced-Version-with-Actionable-Steps-and-Resources.pdf';

// Email validation function
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Send welcome email via custom API webhook
export const sendWelcomeEmail = async (email: string, name: string, funnelType: 'PDF' | 'Training'): Promise<boolean> => {
  if (!isValidEmail(email)) {
    console.error('Invalid email format:', email);
    return false;
  }

  if (!WEBHOOK_URL) {
    console.error('Webhook URL not configured. Please set VITE_FUNNEL_EMAIL_WEBHOOK_URL in your environment variables.');
    return false;
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        funnel_type: funnelType,
        roadmap_pdf_url: ROADMAP_PDF_URL,
        source: 'funnel',
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log(`Welcome email sent successfully via webhook for ${funnelType} funnel`);
      return true;
    } else {
      console.error('Webhook API error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error sending welcome email via webhook:', error);
    return false;
  }
}; 
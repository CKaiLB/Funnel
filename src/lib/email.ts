// Custom API webhook URL from environment variables
const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;

// Debug: Log the webhook URL being used
console.log('🔗 Webhook URL loaded:', WEBHOOK_URL);
console.log('🔗 Environment variable check:', import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL);

// Show alert for immediate debugging
if (typeof window !== 'undefined') {
  console.log('🔗 BROWSER DEBUG - Webhook URL:', WEBHOOK_URL);
}

// PDF file path
const ROADMAP_PDF_URL = '/dist/assets/30-Day-AI-Implementation-Roadmap-Advanced-Version-with-Actionable-Steps-and-Resources.pdf';

// Email validation function
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Send welcome email via custom API webhook
export const sendWelcomeEmail = async (email: string, name: string, phone: string, funnelType: 'PDF' | 'Training' | 'Roadmap' | 'Fitness_Funnel_Playbook' | 'AI_Roadmap' | 'Complete_System'): Promise<boolean> => {
  if (!isValidEmail(email)) {
    console.error('Invalid email format:', email);
    return false;
  }

  if (!WEBHOOK_URL) {
    console.error('Webhook URL not configured');
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
        phone: phone.trim(),
        funnel_type: funnelType,
        source: 'funnel',
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log('✅ Welcome email sent successfully via webhook');
      return true;
    } else {
      console.error('❌ Failed to send welcome email:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
}; 
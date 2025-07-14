# Email Setup Guide

## Overview
The funnel now automatically sends a welcome email with the 30-Day Implementation Roadmap PDF when someone signs up for the newsletter.

## Option 1: EmailJS Setup (Recommended for Client-Side)

### 1. Create EmailJS Account
1. Go to [EmailJS](https://www.emailjs.com/) and create an account
2. Verify your email address

### 2. Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template structure:

```html
Subject: Your FREE 30-Day AI Implementation Roadmap is Here! 🚀

Hi {{to_name}},

Thank you for signing up for our AI Automation Toolkit! 

🎯 Your FREE 30-Day Implementation Roadmap is attached to this email.

This comprehensive guide will show you exactly how to:
• Automate your fitness business operations
• Increase revenue by 40% using AI
• Save 15+ hours per week
• Implement proven AI strategies

📎 Download your roadmap: {{roadmap_pdf_url}}

Best regards,
{{from_name}}
```

### 4. Add Environment Variables
Add these to your `.env` file:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Option 2: Backend API Setup

If you prefer a backend solution, create an API endpoint at `/api/send-welcome-email` that:
1. Receives email, name, and pdfUrl
2. Sends email using your preferred service (SendGrid, AWS SES, etc.)
3. Returns success/failure response

## Option 3: Firebase Functions (Advanced)

You can also use Firebase Functions to send emails server-side:

```javascript
// firebase/functions/index.js
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendWelcomeEmail = functions.firestore
  .document('Emails/{emailId}')
  .onCreate(async (snap, context) => {
    const emailData = snap.data();
    
    // Send email logic here
    // Use nodemailer or other email service
  });
```

## Testing

1. Set up your email service
2. Add environment variables
3. Test the newsletter signup form
4. Check that emails are received with PDF attachment

## PDF File

The roadmap PDF is located at:
`/dist/assets/30-Day-AI-Implementation-Roadmap-Advanced-Version-with-Actionable-Steps-and-Resources.pdf`

Make sure this file is accessible and the URL is correct in your email template. 
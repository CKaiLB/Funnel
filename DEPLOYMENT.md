# Vercel Deployment Guide

## 🚀 **Deployment Steps**

### 1. **Connect to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 2. **Environment Variables**
Set these in your Vercel dashboard:
```
VITE_FUNNEL_EMAIL_WEBHOOK_URL=your_webhook_url_here
```

## 🌐 **Routing Configuration**

### **Available Routes**
All routes are configured to work individually:

- **Home Page**: `/` → `Index.tsx`
- **AI Roadmap**: `/ai-roadmap` → `AIRoadmap.tsx`
- **Sales Funnel Playbook**: `/sales-funnel-playbook` → `SalesFunnelPlaybook.tsx`
- **Complete System**: `/complete-system` → `CompleteSystem.tsx`
- **Congratulations**: `/congratulations` → `Congratulations.tsx`
- **Newsletter**: `/newsletter` → `Newsletter.tsx`
- **Training**: `/training` → `Training.tsx`
- **404 Page**: Any invalid route → `NotFound.tsx`

### **Direct URL Access**
Each page can be accessed directly via its URL:
- `https://yourdomain.vercel.app/ai-roadmap`
- `https://yourdomain.vercel.app/sales-funnel-playbook`
- `https://yourdomain.vercel.app/complete-system`
- `https://yourdomain.vercel.app/congratulations`

## ⚙️ **Configuration Files**

### **vercel.json**
- **Rewrites**: All routes redirect to `index.html` for client-side routing
- **Redirects**: `/roadmap` redirects to `/` (legacy support)
- **Headers**: Security and caching headers configured

### **public/_redirects**
- Fallback for static hosting compatibility
- Ensures all routes resolve to `index.html`

## 🔧 **Troubleshooting**

### **Route Not Working?**
1. Check that `vercel.json` is in the root directory
2. Verify `public/_redirects` exists
3. Ensure build completes successfully
4. Check Vercel deployment logs

### **Build Issues?**
1. Run `npm run build` locally first
2. Check for TypeScript errors
3. Verify all imports are correct
4. Check environment variables

### **Performance Issues?**
1. Assets are cached for 1 year
2. HTML pages are not cached (always fresh)
3. Consider enabling Vercel Analytics

## 📱 **Mobile Optimization**
- All pages are mobile-responsive
- Touch-friendly buttons and forms
- Optimized for mobile networks
- Scroll-to-top functionality on all pages

## 🔒 **Security Features**
- XSS Protection enabled
- Content Type Options secured
- Frame Options denied
- Proper CORS handling

## 📊 **Analytics & Tracking**
- Webhook integration for form submissions
- Firebase integration for data storage
- Stripe integration for payments
- All form fields include: Name, Email, Phone

## 🚨 **Important Notes**
- **Never commit API keys** to the repository
- **Always test routes** after deployment
- **Monitor webhook responses** for form submissions
- **Check Firebase connections** after deployment

## 🔄 **Update Process**
1. Make changes to code
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Deploy with `vercel --prod`
5. Test all routes on live site

## 📞 **Support**
If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test routes individually
4. Check browser console for errors

# Beag Base Frontend

A complete Next.js frontend SaaS boilerplate with dual-view dashboard, integrated with Beag.io authentication and subscription management system.

## 🎯 What This Is

This is a **production-ready frontend template** that provides:
- Complete SaaS user dashboard with subscription management
- Dual-view interface (User + Developer documentation)
- Automatic user creation and authentication flow
- Real-time subscription status from Beag.io
- Copy-paste code examples for developers
- Stripe Customer Portal integration
- Responsive design with modern UI

**Perfect for**: SaaS founders who want to launch quickly with a professional frontend that handles authentication, subscriptions, and user management out of the box.

## ✨ Features

- 🚀 **Next.js 14** with App Router and TypeScript
- 🎨 **Dual-View Dashboard** - Toggle between User and Developer perspectives
- 🔐 **Beag.io Integration** - Complete authentication and subscription management
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 💳 **Stripe Integration** - Customer Portal for subscription management
- 🔄 **Real-time Data** - Subscription status from localStorage (no API calls needed)
- 📋 **Developer Tools** - Copy-to-clipboard code examples and integration guides
- 🛡️ **Protected Routes** - Automatic redirects and authentication guards
- 🎯 **Modern UI** - Professional gradients, animations, and interactive elements

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org))
- **Beag.io Account** with your unique Beag ID
- **Backend API** running (see [backend README](../backend/README.md))

### Step 1: Get Your Project Files

**Option A: Use as Template Repository** ⭐ (Recommended)
```bash
# This repository should be set up as a GitHub template
# Click "Use this template" button on GitHub
# Or clone if template not available:
git clone https://github.com/your-username/beag-base-frontend.git my-saas-frontend
cd my-saas-frontend
```

**Option B: Clone Directly**
```bash
git clone https://github.com/your-username/beag-base-frontend.git
cd beag-base-frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Backend API (update for production)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# App Branding
NEXT_PUBLIC_APP_NAME=My SaaS App

# Beag.io Configuration - CRITICAL: Get this from your Beag dashboard
NEXT_PUBLIC_BEAG_ID=your_beag_id_here

# Stripe Customer Portal - Get this from Stripe dashboard
NEXT_PUBLIC_STRIPE_PORTAL_URL=https://billing.stripe.com/p/login/your_portal_url_here
```

### Step 4: Add Your Beag Script

**Critical Step**: Replace the placeholder script with your actual Beag.js code:

```bash
# Edit this file
nano public/beag.js
# or use any editor
code public/beag.js
```

**Remove ALL placeholder content** and paste your actual Beag script from your Beag.io dashboard. It should look something like:
```javascript
(function() {
  // Your actual Beag.js script code here
  // This is JavaScript code, not a URL
  // Get this from your Beag.io dashboard
})();
```

### Step 5: Start Development Server

```bash
# This script will install dependencies and start the server
./start.sh

# Or run manually:
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your SaaS frontend!

## 📁 Project Architecture

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Beag script integration
│   ├── page.tsx           # Root page (redirects to dashboard after auth)
│   ├── login/            # Self-login page with OTP
│   ├── dashboard/        # Dual-view dashboard (User/Developer)
│   └── billing/          # Stripe Customer Portal integration
├── components/           
│   ├── Layout/           # Shared AppLayout with sidebar
│   │   ├── AppLayout.tsx # Main layout wrapper
│   │   └── Sidebar.tsx   # Navigation sidebar
│   ├── Auth/             # Authentication components
│   └── UI/               # Reusable UI components
├── lib/                  # Utilities and API client
│   ├── api-client.ts     # Backend API integration
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
```

## Key Features

### Beag Script Integration

The Beag script is loaded via standard HTML script tag in the root layout:

```tsx
<script type="module" src="/beag.js" defer></script>
```

**Critical**: Must use standard HTML script tag, not Next.js Script component.

This script provides:
- User authentication with localStorage tokens
- Session management and validation
- Automatic logout functionality

### Dual-View Dashboard

The dashboard features a toggle between User and Developer views:

**User View:**
- Personal subscription information
- Current plan and billing status
- Account details from Beag localStorage

**Developer View:**
- Environment setup validation
- Code examples with copy-to-clipboard
- Integration guides and documentation

### Beag localStorage Integration

After authentication, Beag.io provides these localStorage variables:

```javascript
// Authentication
const accessToken = localStorage.getItem("x_access_token");
const email = localStorage.getItem("x_email");

// Subscription Details  
const planId = localStorage.getItem("x_plan_id");        // Plan ID number
const status = localStorage.getItem("x_status");         // PAID, TRIAL, etc.
const startDate = localStorage.getItem("x_start_date");  // Start date
const endDate = localStorage.getItem("x_end_date");      // End date
```

### Stripe Billing Integration

Integrated Stripe Customer Portal for subscription management:

```typescript
// Opens Stripe Customer Portal in new tab
window.open(process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL, '_blank');
```

### Automatic User Creation

When users log in via Beag, they're automatically created in the backend:

```typescript
const checkAndCreateUser = async () => {
  const email = localStorage.getItem('x_email')
  if (email) {
    // Check if user exists, create if not
    try {
      await apiClient.getUserByEmail(email)
    } catch (error: any) {
      if (error.response?.status === 404) {
        await apiClient.createUser(email)
      }
    }
  }
}
```

## How It Works

### Authentication Flow

1. **User visits the app** → Redirected to dashboard if authenticated, login if not
2. **Login Process**: 
   - User enters email on `/login`
   - OTP sent via Beag API
   - User enters OTP → Beag tokens stored in localStorage
3. **Dashboard Access**: 
   - Beag script validates authentication on every page
   - User data retrieved from localStorage (no API calls needed)
   - Backend creates user record automatically after first login

### Dashboard Navigation

- **Shared Layout**: All pages use AppLayout with consistent sidebar
- **Dual Views**: Toggle between User and Developer perspectives
- **Real-time Data**: Subscription info displayed directly from Beag localStorage
- **Modern UI**: Gradient backgrounds, responsive design, interactive elements

## Deployment

### Production Build

```bash
./start.sh  # For development
# or
npm run build
npm start   # For production
```

### Environment Variables for Production

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_NAME=Your Production App Name

# Beag.io Configuration (use your production Beag ID)
NEXT_PUBLIC_BEAG_ID=your_production_beag_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PORTAL_URL=your_production_stripe_portal_url
```

## Troubleshooting

### Beag Script Issues

**Problem**: Authentication not working or script errors

**Solutions**:
- Ensure script content is actual JavaScript code, not URL
- Verify script is loaded with standard HTML `<script>` tag
- Check browser console for JavaScript errors
- Confirm `NEXT_PUBLIC_BEAG_ID` matches your Beag dashboard

### API Connection Issues  

**Problem**: Cannot connect to backend or CORS errors

**Solutions**:
- Ensure backend is running on correct port (`http://localhost:8000`)
- Check CORS settings in backend configuration
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check network tab in browser devtools for API call errors

### Environment Variables Not Loading

**Problem**: Configuration values not working

**Solutions**:
- Ensure file is named `.env.local` (not `.env`)
- All frontend variables must start with `NEXT_PUBLIC_`
- Restart development server after changing environment variables
- Check that required variables are set in your hosting platform

### Build Issues

**Problem**: Build fails or runtime errors

**Solutions**:
- Clear `.next` directory and rebuild: `rm -rf .next && ./start.sh`
- Check all environment variables are set correctly
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

### Dashboard Not Loading

**Problem**: Blank dashboard or authentication loops

**Solutions**:
- Clear browser localStorage: `localStorage.clear()`
- Check if Beag tokens exist in localStorage (DevTools → Application → Local Storage)
- Verify backend is creating users successfully
- Check browser console for authentication errors

## Development

### Adding New Pages

1. Create page in `src/app/your-page/page.tsx`
2. Use AppLayout for consistent sidebar: `<AppLayout>{content}</AppLayout>`
3. Add navigation links to `src/components/Layout/Sidebar.tsx`
4. Protect routes that require authentication

### Customizing the Dashboard

**User View Customization**:
- Edit `src/app/dashboard/page.tsx`
- Add new subscription info or user data
- Style with Tailwind CSS classes

**Developer View Customization**:
- Add new code examples with copy-to-clipboard
- Include environment validation checks
- Provide integration guides for your specific use case

### API Integration

**Adding New API Calls**:
```typescript
// In src/lib/api-client.ts
export const apiClient = {
  // Add new methods
  getCustomData: async () => {
    const response = await fetch(`${API_BASE}/your-endpoint`)
    return response.json()
  }
}
```

## License

MIT
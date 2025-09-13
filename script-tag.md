# Beag.io Script Tag Integration Guide

This guide explains how to properly integrate the Beag.io script tag into your application for authentication and subscription management.

## 📋 Overview

The Beag script tag is a JavaScript file that handles:
- User authentication validation
- Automatic redirects for unauthenticated users
- Session management and token validation
- Integration with your custom login flow

## 🔧 Getting Your Beag Script

### Step 1: Access Your Beag Dashboard

1. **Login to your Beag.io dashboard**
2. **Navigate to your SaaS app settings**
3. **Find the Script Tag section**
4. **Copy the actual JavaScript code** (not just the HTML script tag)

### Step 2: Identify the Correct Script Content

Your Beag script should look like this:
```javascript
(function(_0x219903,_0x1117db){
  // ... minified JavaScript code ...
  // This is the actual script content you need
})();
```

⚠️ **Important**: You need the actual JavaScript code, not an HTML `<script src="...">` tag.

## 📁 File Placement

### Frontend Integration

Place your Beag script in the correct location:

```
frontend/
└── public/
    └── beag.js    ← Place your script content here
```

### Replace Placeholder Content

1. **Open** `frontend/public/beag.js`
2. **Delete** all existing content
3. **Paste** your actual Beag script code
4. **Save** the file

## 🔗 HTML Integration

### Correct Script Tag Format

In your main layout file (`frontend/src/app/layout.tsx`), use this format:

```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Other head elements */}
        <script type="module" src="/beag.js" defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### Critical Requirements

- ✅ Use standard HTML `<script>` tag
- ✅ Include `type="module"` attribute
- ✅ Include `defer` attribute
- ✅ Place in `<head>` section
- ❌ Do NOT use Next.js `<Script>` component

## ⚙️ Configuration

### Environment Variables

Make sure these are set in your frontend `.env.local`:

```env
# Use your Beag ID (not API key)
NEXT_PUBLIC_BEAG_ID=your_beag_id_here

# Your app configuration
NEXT_PUBLIC_APP_NAME=My SaaS App
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### API Login Mode Settings

In your Beag dashboard:
1. **Enable API Login Mode**
2. **Set Login URL** to your custom login page
3. **Save the configuration**

## 🔄 How It Works

### Authentication Flow

1. **Script Loads**: Beag script loads on every page
2. **Token Check**: Script checks for valid authentication tokens in localStorage
3. **Redirect Logic**: 
   - ✅ **Authenticated**: User stays on current page
   - ❌ **Not Authenticated**: User redirected to your login page

### localStorage Integration

The script manages these localStorage variables:

| Variable | Description |
|----------|-------------|
| `x_access_token` | Authentication token |
| `x_email` | User's email address |
| `x_plan_id` | Subscription plan ID |
| `x_start_date` | Subscription start date |
| `x_end_date` | Subscription end date |
| `x_status` | Subscription status |

### Usage in Your App

Access user data directly from localStorage:

```javascript
// Check authentication status
const isAuthenticated = !!localStorage.getItem('x_access_token');

// Get user information
const userEmail = localStorage.getItem('x_email');
const planId = localStorage.getItem('x_plan_id');
const status = localStorage.getItem('x_status');

// Check if subscription is active
const isActive = ['PAID', 'ACTIVE', 'TRIAL', 'RESUMED'].includes(
  status?.toUpperCase()
);
```

## 🚨 Common Issues

### Script Not Loading

**Problem**: Authentication not working, redirects not happening
**Solutions**:
- Verify script file exists at `frontend/public/beag.js`
- Check script contains actual JavaScript code (not HTML)
- Ensure script tag is in `<head>` with correct attributes
- Check browser console for JavaScript errors

### Wrong Script Format

**Problem**: Getting script tag instead of JavaScript code
**Solutions**:
- Copy the actual JavaScript content from Beag dashboard
- Don't copy the HTML `<script src="...">` tag
- Paste only the JavaScript code into `beag.js` file

### Authentication Loops

**Problem**: Constant redirects between login and app
**Solutions**:
- Verify API Login Mode is enabled in Beag dashboard
- Check login URL matches exactly in Beag settings
- Ensure login page properly stores tokens in localStorage
- Clear browser localStorage and try fresh login

### Next.js Script Component Issues

**Problem**: Using Next.js `<Script>` component instead of HTML
**Solutions**:
- Replace Next.js `<Script>` with standard HTML `<script>` tag
- Ensure proper attributes: `type="module"` and `defer`
- Place in `<head>` section of layout

## 🔍 Debugging

### Browser Developer Tools

1. **Console Tab**: Check for JavaScript errors
2. **Network Tab**: Verify beag.js loads successfully
3. **Application Tab**: Check localStorage for authentication tokens
4. **Elements Tab**: Verify script tag is present in HTML

### Testing Steps

1. **Clear localStorage** in browser
2. **Visit your app** (should redirect to login)
3. **Complete login flow** (should set localStorage tokens)
4. **Return to app** (should stay authenticated)
5. **Refresh page** (should remain authenticated)

### Debug Logs

Add temporary logging to check script behavior:

```javascript
// Check if script is loading
console.log('Beag script loaded:', typeof window.BeagAuth !== 'undefined');

// Check authentication status
console.log('Auth tokens:', {
  token: localStorage.getItem('x_access_token'),
  email: localStorage.getItem('x_email'),
  status: localStorage.getItem('x_status')
});
```

## 🔐 Security Notes

### Best Practices

- ✅ Keep script file updated with latest version from Beag
- ✅ Use HTTPS in production
- ✅ Don't modify the script content
- ✅ Regularly check for script updates in Beag dashboard

### What NOT to Do

- ❌ Don't expose API keys in client-side code
- ❌ Don't modify the minified script content
- ❌ Don't cache the script file with long expiration
- ❌ Don't use the script tag URL as the file content

## 📝 Integration Checklist

- [ ] Beag script content copied from dashboard
- [ ] Script placed in `frontend/public/beag.js`
- [ ] HTML script tag added to layout with correct attributes
- [ ] API Login Mode enabled in Beag dashboard
- [ ] Login URL configured in Beag settings
- [ ] Environment variables configured
- [ ] Authentication flow tested end-to-end
- [ ] localStorage tokens verified in browser
- [ ] Page redirects working correctly
- [ ] No console errors related to script

## 🆘 Support

If you encounter issues:

1. **Check Beag.io documentation** for latest updates
2. **Verify script is the latest version** from your dashboard
3. **Test with browser console** to identify JavaScript errors
4. **Contact Beag.io support** with specific error messages

Remember: The script content is unique to your application and must come directly from your Beag.io dashboard.
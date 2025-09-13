# Beag.io Self-Login Implementation Guide

This guide shows you how to create a custom login page under your own domain while using Beag.io's authentication system.

## 📋 Overview

### What is API Login Mode?

API Login Mode allows you to implement a custom login experience within your application while still using Beag's authentication system. Instead of redirecting users to Beag's hosted login page, you can create your own login interface that matches your app's design.

### How It Works

The API login flow:

1. **Authentication Check**: Beag script checks if user is authenticated
2. **Custom Redirect**: If not authenticated, user is redirected to YOUR custom login page
3. **OTP Request**: Your login page collects email and requests OTP via Beag API
4. **OTP Verification**: User enters OTP, you verify it with Beag API
5. **Token Storage**: On success, authentication tokens are stored in localStorage
6. **App Access**: User is redirected back to your app with valid authentication

## ⚙️ Initial Setup

### Step 1: Enable API Login Mode

1. **Go to your Beag.io dashboard**
2. **Navigate to your SaaS app settings**
3. **Enable "API Login Mode"**
4. **Set Login URL** to your custom login page (e.g., `https://yourapp.com/login`)
5. **Save the settings**

### Step 2: Update Your App Script

Make sure your app includes the Beag script tag which will handle authentication checks and redirects.

## 🔗 API Endpoints

### Base URL
```
https://my-saas-basic-api-d5e3hpgdf0gnh2em.eastus-01.azurewebsites.net
```

### 1. Send OTP

Send a one-time password to the user's email address.

**Endpoint:**
```
POST /auth/api/login
```

**Request Body:**
```json
{
  "my_saas_id": "YOUR_BEAG_API_KEY",
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "OTP sent successfully"
}
```

**Error Response (4xx):**
```json
{
  "status": "error",
  "code": "user_not_found",
  "message": "You are not subscribed to this service"
}
```

### 2. Verify OTP

Verify the OTP and receive authentication tokens.

**Endpoint:**
```
POST /auth/api/verify-otp
```

**Request Body:**
```json
{
  "my_saas_id": "YOUR_BEAG_API_KEY",
  "email": "user@example.com",
  "otp": "ABC123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "token_data": {
    "x_access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "x_email": "user@example.com",
    "x_plan_id": 123,
    "x_start_date": "2023-01-01T00:00:00",
    "x_end_date": "2024-01-01T00:00:00",
    "x_status": "PAID"
  }
}
```

**Error Response (4xx):**
```json
{
  "status": "error",
  "code": "invalid_otp",
  "message": "Invalid OTP"
}
```

## 📋 Error Codes Reference

| Error Code | Description |
|------------|-------------|
| `app_not_found` | Application ID not found |
| `user_not_found` | User not found |
| `not_subscribed` | User is not subscribed to this service |
| `subscription_inactive` | Subscription is not active |
| `subscription_expired` | Subscription has expired |
| `invalid_otp` | The OTP is invalid or expired |
| `server_error` | An unexpected server error occurred |

## 💻 JavaScript Implementation

### Complete Login Implementation

```javascript
// Configuration
const BEAG_API_KEY = 'YOUR_BEAG_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://my-saas-basic-api-d5e3hpgdf0gnh2em.eastus-01.azurewebsites.net';
let userEmail = '';

/**
 * Send OTP to user's email
 */
async function sendOTP() {
  const emailInput = document.getElementById('email');
  const errorEl = document.getElementById('email-error');
  const email = emailInput.value.trim();
  
  // Clear previous errors
  errorEl.textContent = '';
  
  // Validate email
  if (!email) {
    errorEl.textContent = 'Please enter your email address';
    emailInput.focus();
    return;
  }
  
  if (!isValidEmail(email)) {
    errorEl.textContent = 'Please enter a valid email address';
    emailInput.focus();
    return;
  }
  
  // Show loading state
  const submitBtn = document.getElementById('send-otp-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch(`${BASE_URL}/auth/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        my_saas_id: BEAG_API_KEY,
        email: email
      })
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      // Success: Show OTP form
      userEmail = email;
      document.getElementById('user-email').textContent = email;
      document.getElementById('email-form').style.display = 'none';
      document.getElementById('otp-form').style.display = 'block';
      document.getElementById('otp').focus();
    } else {
      // Error: Show user-friendly message
      errorEl.textContent = getUserFriendlyError(result.code, result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
    errorEl.textContent = 'Connection error. Please check your internet connection and try again.';
  } finally {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

/**
 * Verify OTP and authenticate user
 */
async function verifyOTP() {
  const otpInput = document.getElementById('otp');
  const errorEl = document.getElementById('otp-error');
  const otp = otpInput.value.trim();
  
  // Clear previous errors
  errorEl.textContent = '';
  
  // Validate OTP
  if (!otp) {
    errorEl.textContent = 'Please enter the verification code';
    otpInput.focus();
    return;
  }
  
  // Show loading state
  const submitBtn = document.getElementById('verify-otp-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Verifying...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch(`${BASE_URL}/auth/api/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        my_saas_id: BEAG_API_KEY,
        email: userEmail,
        otp: otp
      })
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      // Success: Store authentication tokens
      const { token_data } = result;
      
      // Save all token data to localStorage
      Object.keys(token_data).forEach(key => {
        localStorage.setItem(key, token_data[key]);
      });
      
      // Redirect to app
      window.location.href = '/'; // Update this to your app's main URL
    } else {
      // Error: Show user-friendly message
      errorEl.textContent = getUserFriendlyError(result.code, result.message);
      otpInput.select(); // Select text for easy re-entry
    }
  } catch (error) {
    console.error('Network error:', error);
    errorEl.textContent = 'Connection error. Please check your internet connection and try again.';
  } finally {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

/**
 * Go back to email form
 */
function goBackToEmail() {
  document.getElementById('otp-form').style.display = 'none';
  document.getElementById('email-form').style.display = 'block';
  document.getElementById('email').focus();
  
  // Clear any errors
  document.getElementById('otp-error').textContent = '';
  document.getElementById('otp').value = '';
}

/**
 * Utility Functions
 */

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getUserFriendlyError(code, originalMessage) {
  const errorMessages = {
    'user_not_found': 'No subscription found for this email. Please check your email or contact support.',
    'not_subscribed': 'You don\'t have an active subscription. Please purchase a subscription first.',
    'subscription_expired': 'Your subscription has expired. Please renew to continue using the service.',
    'subscription_inactive': 'Your subscription is currently inactive. Please contact support.',
    'invalid_otp': 'The verification code is incorrect or has expired. Please try again.',
    'app_not_found': 'Service configuration error. Please contact support.',
    'server_error': 'A server error occurred. Please try again in a few moments.'
  };
  
  return errorMessages[code] || originalMessage || 'An unexpected error occurred. Please try again.';
}

// Event listeners for Enter key
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const otpInput = document.getElementById('otp');
  
  if (emailInput) {
    emailInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendOTP();
      }
    });
  }
  
  if (otpInput) {
    otpInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        verifyOTP();
      }
    });
  }
});
```

### HTML Structure Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Your App</title>
    <!-- Your CSS here -->
</head>
<body>
    <div class="login-container">
        <!-- Email Form -->
        <div id="email-form" class="form-section">
            <h1>Welcome Back</h1>
            <p>Enter your email to receive a verification code</p>
            
            <div class="input-group">
                <label for="email">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    placeholder="your@email.com"
                    required 
                    autocomplete="email"
                >
                <div id="email-error" class="error-message"></div>
            </div>
            
            <button id="send-otp-btn" onclick="sendOTP()" class="btn-primary">
                Send Verification Code
            </button>
        </div>
        
        <!-- OTP Form -->
        <div id="otp-form" class="form-section" style="display: none;">
            <h1>Enter Verification Code</h1>
            <p>We sent a code to <span id="user-email"></span></p>
            
            <div class="input-group">
                <label for="otp">Verification Code</label>
                <input 
                    type="text" 
                    id="otp" 
                    placeholder="ABC123"
                    required
                    autocomplete="one-time-code"
                >
                <div id="otp-error" class="error-message"></div>
            </div>
            
            <button id="verify-otp-btn" onclick="verifyOTP()" class="btn-primary">
                Verify & Login
            </button>
            
            <button onclick="goBackToEmail()" class="btn-secondary">
                Change Email
            </button>
        </div>
    </div>
    
    <script>
        // Your JavaScript implementation here
    </script>
</body>
</html>
```

## 🎨 Implementation Steps

### 1. Create Login Page

1. **Create a new page** at the URL you specified in Beag settings
2. **Design the interface** to match your app's style
3. **Include forms** for email entry and OTP verification
4. **Add loading states** and error handling

### 2. Implement JavaScript Logic

1. **Add the JavaScript code** from the example above
2. **Update the BEAG_API_KEY** with your actual API key
3. **Update redirect URL** to your app's main page
4. **Test the login flow** thoroughly

### 3. Test Your Integration

Test these scenarios:
- ✅ New user login (should fail if not subscribed)
- ✅ Existing subscribed user login (should succeed)
- ✅ Expired subscription (should show appropriate message)
- ✅ Invalid OTP (should display clear error)
- ✅ Network errors (should handle gracefully)

## 🔒 Security Considerations

### Client-Side Security
- **Never expose sensitive API keys** in client-side code
- **Validate input** on both client and server side
- **Use HTTPS** for all authentication requests
- **Clear sensitive data** from memory when possible

### Error Handling Best Practices
- **Show user-friendly error messages** instead of technical errors
- **Don't leak sensitive information** in error messages
- **Log detailed errors** server-side for debugging
- **Implement rate limiting** to prevent abuse

## 🐛 Troubleshooting

### Common Issues

**"User not found" error**
- Check if the email is correctly entered
- Verify the user has an active subscription in Beag
- Ensure your Beag API key is correct

**OTP not received**
- Check spam/junk folder
- Verify email address is correct
- Wait a few minutes as emails may be delayed

**"Invalid OTP" error**
- Check if OTP was entered correctly (case-sensitive)
- Verify OTP hasn't expired (usually valid for 10 minutes)
- Try requesting a new OTP

**Authentication not working after login**
- Verify all token data is stored in localStorage
- Check browser console for JavaScript errors
- Ensure Beag script tag is properly loaded

**Integration debugging**
- Check browser console for errors
- Verify API key configuration in Beag dashboard
- Test API endpoints directly with curl/Postman
- Ensure login URL matches Beag settings exactly

### Browser Developer Tools

Use these tools for debugging:
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests and responses  
- **Application**: Verify localStorage tokens are set
- **Elements**: Inspect form elements and styling
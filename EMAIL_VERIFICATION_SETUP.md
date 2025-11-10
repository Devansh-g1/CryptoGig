# Email Verification Setup

Email verification has been implemented to ensure users verify their email addresses before logging in.

## What Changed

### Backend Changes
1. **Registration**: Users now receive a verification email after registration
2. **Login**: Users must verify their email before they can log in
3. **New Endpoints**:
   - `POST /api/auth/verify-email` - Verify email with token
   - `POST /api/auth/resend-verification` - Resend verification email

### Frontend Changes
1. **New Page**: `/verify-email` - Handles email verification from link
2. **Registration Flow**: Shows "check your email" message after registration
3. **Login Error**: Shows clear message if email is not verified

## Email Configuration

### Option 1: Gmail (Recommended for Testing)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. Update `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FRONTEND_URL=http://localhost:3000
```

### Option 2: Other SMTP Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Option 3: Development Mode (No Email)

If you don't configure SMTP credentials, the verification link will be printed to the console:
```
⚠️  Email not configured. Verification link: http://localhost:3000/verify-email?token=...
```

You can copy this link and paste it in your browser to verify.

## Testing the Flow

### 1. Register a New User
```bash
# Start the backend
cd backend
python server.py

# In another terminal, register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

Response:
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "email": "test@example.com",
  "email_verified": false
}
```

### 2. Check Email or Console
- **With SMTP configured**: Check your email inbox
- **Without SMTP**: Check the backend console for the verification link

### 3. Click Verification Link
The link format: `http://localhost:3000/verify-email?token=<uuid>`

### 4. Login
After verification, you can log in normally:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

## Resending Verification Email

If a user didn't receive the email:
```bash
curl -X POST http://localhost:8000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

## Security Features

1. **Token Expiration**: Verification tokens expire after 24 hours
2. **One-Time Use**: Tokens are deleted after successful verification
3. **Password Required**: Resending verification requires password authentication
4. **No Auto-Login**: Users must explicitly verify before accessing the platform

## Troubleshooting

### "Email not verified" error on login
- Check your email for the verification link
- Use the resend verification endpoint
- Check backend console for the verification link (if SMTP not configured)

### Email not received
- Check spam folder
- Verify SMTP credentials in `.env`
- Check backend console for error messages
- Try resending verification email

### Gmail "Less secure app" error
- Don't use your regular Gmail password
- Use an App Password instead (requires 2FA)
- Follow the Gmail setup instructions above

## Production Deployment

For production, use a professional email service:

1. **SendGrid** (Recommended)
   - Free tier: 100 emails/day
   - Sign up at https://sendgrid.com

2. **AWS SES**
   - Very cheap and reliable
   - Requires domain verification

3. **Mailgun**
   - Free tier: 5,000 emails/month

Update your production `.env` with the appropriate SMTP settings.

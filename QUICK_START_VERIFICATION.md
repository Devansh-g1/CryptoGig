# Quick Start: Email Verification

## TL;DR
Email verification is now required. Users must verify their email before logging in.

## For Development (No Email Setup)

1. **Start Backend**
   ```bash
   cd backend
   python server.py
   ```

2. **Register a User** (via frontend or API)
   - Frontend: http://localhost:3000
   - Or use curl:
   ```bash
   curl -X POST http://localhost:8000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
   ```

3. **Get Verification Link**
   - Check backend console output
   - Look for: `⚠️  Email not configured. Verification link: http://...`
   - Copy the full URL

4. **Verify Email**
   - Paste the URL in your browser
   - Or extract the token and use:
   ```bash
   curl -X POST http://localhost:8000/api/auth/verify-email \
     -H "Content-Type: application/json" \
     -d '{"token":"<your-token>"}'
   ```

5. **Login**
   - Now you can login normally
   - Frontend: http://localhost:3000
   - Or use curl:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

## For Production (With Email)

1. **Configure SMTP in `backend/.env`**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   FRONTEND_URL=https://your-domain.com
   ```

2. **For Gmail:**
   - Enable 2FA on your Google account
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use the 16-character password in `SMTP_PASSWORD`

3. **Restart Backend**
   ```bash
   cd backend
   python server.py
   ```

4. **Test**
   - Register a new user
   - Check email inbox
   - Click verification link
   - Login

## Testing Script

Run the automated test:
```bash
python test-email-verification.py
```

## Common Issues

### "Email not verified" on login
✅ **Solution**: Check your email or backend console for verification link

### Email not received
✅ **Solution**: 
- Check spam folder
- Verify SMTP credentials
- Check backend console for errors
- Use console link for development

### Gmail "Less secure app" error
✅ **Solution**: Use App Password, not regular password

## What Changed?

- ✅ Registration no longer auto-logs in users
- ✅ Login checks email verification status
- ✅ New `/verify-email` page for verification
- ✅ Verification emails sent automatically
- ✅ Tokens expire after 24 hours

## Need Help?

See detailed documentation:
- `EMAIL_VERIFICATION_SETUP.md` - Full setup guide
- `VERIFICATION_IMPLEMENTATION.md` - Technical details

# Security Update: Email Privacy

## Changes Made

### Problem
Email was being exposed in the URL query parameter during OTP verification:
```
/otp?email=pauloinigo.bravo.cics%40ust.edu.ph
```

This means:
- ❌ Email visible in browser history
- ❌ Email in browser URL bar
- ❌ Email in server logs (referer headers)
- ❌ Email potentially exposed if URLs are shared

### Solution
Email is now stored **only in Supabase Auth** and temporarily in **sessionStorage** (client-side only):

```
/otp  ← No email in URL
```

## How It Works

### 1. Sign Up Flow
```
User submits form
    ↓
Auth user created in Supabase
    ↓
Email stored in sessionStorage (client-side RAM)
    ↓
Redirect to /otp (no email in URL)
```

### 2. OTP Verification Flow
```
OTP page loads
    ↓
Retrieves email from sessionStorage
    ↓
User enters 6-digit code
    ↓
Verify against Supabase auth
    ↓
Clear sessionStorage
    ↓
Redirect to login
```

## Key Benefits

✅ **Email only in Supabase Auth** - Protected by Supabase's security infrastructure
✅ **No URL exposure** - Not in browser history or logs
✅ **SessionStorage only** - Client-side only, cleared on page close
✅ **No data persistence** - Temporary in-memory storage
✅ **Automatic cleanup** - Cleared after successful verification

## Technical Details

### Files Modified

1. **app/(auth)/signup/page.tsx**
   - After successful signup, stores email in sessionStorage
   - Redirects to `/otp` (no URL params)

2. **app/(auth)/otp/page.tsx**
   - Retrieves email from sessionStorage on page load
   - If no email found, redirects back to signup
   - Clears sessionStorage after OTP verification succeeds
   - Masks email for display: `pa***@ust.edu.ph`

### Code Example

**Signup Page:**
```javascript
// Store email in sessionStorage (client-side only)
if (typeof window !== 'undefined') {
  sessionStorage.setItem('pendingVerificationEmail', email);
}

// Redirect without email in URL
router.push('/otp');
```

**OTP Page:**
```javascript
// Retrieve from sessionStorage
const [email, setEmail] = React.useState('');

React.useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedEmail = sessionStorage.getItem('pendingVerificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push('/signup');
    }
  }
  setEmailLoaded(true);
}, [router]);

// Clear after verification
sessionStorage.removeItem('pendingVerificationEmail');
```

## Data Flow

```
┌─────────────────────────────────────────┐
│ User Signup Form                        │
├─────────────────────────────────────────┤
│ Email: user@example.com                 │
│ Password: ••••••••                      │
│ Name: John Doe                          │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ POST /api/auth/signup                   │
├─────────────────────────────────────────┤
│ ✓ Create Supabase Auth user             │
│ ✓ Create digital_donor_profiles record  │
│ ✓ Return user.id and success            │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ Signup Page (JavaScript)                │
├─────────────────────────────────────────┤
│ ✓ Save email to sessionStorage           │
│ ✓ Redirect to /otp                      │
│   (NO email in URL)                     │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│ OTP Page (/otp)                         │
├─────────────────────────────────────────┤
│ ✓ Load email from sessionStorage        │
│ ✓ Display masked email (pa***@...)      │
│ ✓ User enters 6-digit code              │
│ ✓ Verify with Supabase                  │
│ ✓ Clear sessionStorage                  │
│ ✓ Redirect to /login                    │
└─────────────────────────────────────────┘
```

## Where Email Is Stored

| Location | Storage Type | Visibility | Lifetime |
|----------|--------------|-----------|----------|
| **Supabase Auth** | Secure Database | Protected | Permanent |
| **SessionStorage** | Client RAM | Local only | Session |
| **URL** | Browser | Public | ❌ Removed |
| **Forms** | User input | Local | Single page |

## Fallback Behavior

If user navigates directly to `/otp` without completing signup:
1. SessionStorage is empty (no email)
2. Page redirects back to `/signup`
3. User must complete signup flow again

## Testing the Flow

1. Go to `/signup`
2. Fill form and submit
3. You're redirected to `/otp` (notice: no email in URL)
4. Enter 6-digit OTP code
5. On success, sessionStorage is cleared
6. You're redirected to `/login`

## Browser Support

SessionStorage is supported in all modern browsers:
- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 4+
- ✅ Edge (all versions)
- ✅ Mobile browsers

---

**Status**: ✅ Security improvement implemented
**Impact**: No breaking changes, improved privacy
**Migration**: Automatic - all future signups use new flow

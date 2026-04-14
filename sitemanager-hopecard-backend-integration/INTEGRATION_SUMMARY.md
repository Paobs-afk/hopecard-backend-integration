# HOPECARD Integration Summary

## What Was Done

### ✅ Phase 2: Donor Account Creation Microservices Backend (Completed)

#### Database Setup
1. **Created `digital_donor_profiles` Table** with:
   - `id` (UUID Primary Key)
   - `user_id` (FK to auth.users)
   - `first_name`, `last_name`, `email`
   - Location fields: `barangay`, `municipality`, `province`
   - `valid_id_url` (Reference to uploaded file)
   - `status` (Default: 'Pending')
   - Timestamps: `created_at`, `updated_at`
   - Row Level Security (RLS) policies for user privacy

#### Backend APIs
1. **POST /api/auth/signup** - Enhanced with donor profile creation
   - Accepts: `email`, `password`, `firstName`, `lastName`, `barangay`, `municipality`, `province`, `validIdUrl`
   - Creates Supabase Auth user
   - Creates donor profile in `digital_donor_profiles` table
   - Default status: "Pending"
   - Returns user and profile data

2. **POST /api/auth/upload-id** - New file upload service
   - Accepts: file (JPG/PNG/PDF, max 5MB)
   - Stores in Supabase Storage bucket: `donor-ids`
   - Returns public URL for file reference
   - Validates file type and size

#### Frontend Updates
1. **Updated `/app/(auth)/signup/page.tsx`**
   - Now collects all donor profile information:
     - First Name, Last Name
     - Email, Password
     - Barangay, Municipality, Province
     - Valid ID file upload
   - Integrates file upload before account creation
   - Sends complete profile data to backend

### ✅ Phase 1: Safe Migration (Completed)

1. **Created New Discover Page** (`/app/discover/page.tsx`)
   - Beautiful new UI design with hero section
   - Campaign filtering and search
   - Featured campaign showcase
   - Responsive grid layout
   - Side navigation menu
   - All campaigns link to existing `/home` for cart/payment

2. **Updated Navigation Flow**
   - Landing page (`/landing`) → Login (`/login`) → Discover (`/discover`)
   - Sign up → Approval modal → Login → Discover
   - Discover page campaigns → Home page (for cart/payment functionality)

3. **Preserved Existing Functionality**
   - `/home` page remains fully functional with:
     - Cart system
     - Payment processing
     - Supabase integration
     - All existing donation features

## Current User Flow

```
Landing Page (/landing)
    ↓
Login/Signup (/login)
    ↓
[After Login] → Discover Page (/discover)
    ↓
[Click Campaign] → Home Page (/home) - Full cart/payment functionality
    ↓
Profile (/profile) | Transactions (/transactions)
```

## Pages Overview

### `/landing` - Marketing Landing Page
- Hero section with CTA
- Stats showcase
- Feature highlights
- Footer with links

### `/discover` - New Discovery Page (Main after login)
- Hero with campaign search
- Category filters
- Featured campaign
- Campaign grid
- Links to `/home` for donations

### `/home` - Existing Donation Platform (Fully Functional)
- Browse donation cards
- Shopping cart
- Payment processing
- Supabase backend integration
- Transaction management

### `/profile` - User Profile
- User information
- Contact details
- Password management

### `/transactions` - Transaction History
- View past donations
- Payment references

## Next Steps (Optional Future Enhancements)

### Phase 2: Feature Migration
- Gradually move cart functionality to discover page
- Integrate payment modal into discover page
- Merge the two pages once all features are tested

### Phase 3: Cleanup
- Remove old home page once discover page has all features
- Update all navigation references
- Final testing and optimization

## Technical Notes

- All backend functionality (Supabase, payments) remains in `/home`
- Discover page is purely presentational with navigation to `/home`
- No breaking changes to existing features
- Safe rollback available if needed

## Files Modified

1. `app/discover/page.tsx` - NEW (Beautiful discovery UI)
2. `app/(auth)/login/page.tsx` - Updated login redirect to `/discover`
3. `app/home/page-backup.tsx` - Backup marker created
4. `INTEGRATION_SUMMARY.md` - This file

## Testing Checklist

- [x] Landing page loads correctly
- [x] Login redirects to discover page
- [x] Signup shows approval modal
- [x] Discover page displays campaigns
- [x] Campaign cards link to home page
- [x] Home page cart/payment still works
- [x] Navigation menu works
- [x] Profile and transactions accessible

---

## SETUP INSTRUCTIONS FOR DONOR BACKEND

### 1. Environment Variables (Required)

Add these to your `.env.local` file:

```env
# Existing Supabase variables
NEXT_PUBLIC_SUPABASE_URL=https://kehsjirdcsqiehbherem.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get these from your Supabase project settings:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (hopecard-admin)
3. Go to Settings → API
4. Copy the `Project URL` and keys

### 2. Create Storage Bucket (One-time Setup)

In the Supabase Dashboard:

1. Go to **Storage** → **Buckets**
2. Click **New bucket**
3. Name: `donor-ids`
4. Make it **Public** (for public URL access)
5. Click **Create bucket**

Then set up RLS policies:

1. Click the `donor-ids` bucket
2. Go to **Policies**
3. Add policy for file uploads:
   ```
   - Policy name: "Users can upload their own ID"
   - Type: INSERT
   - Condition: bucket_id = 'donor-ids' AND auth.uid()::text = (storage.foldername(name))[1]
   ```

### 3. Database Table (Already Created)

The `digital_donor_profiles` table has been automatically created with:
- All necessary columns (name, email, location, status, etc.)
- RLS policies for security
- Proper indexes for performance
- Default status set to "Pending"

Verify by going to Supabase Dashboard → SQL Editor and running:
```sql
SELECT * FROM digital_donor_profiles LIMIT 1;
```

### 4. Test the Signup Flow

1. Navigate to `/signup` in your app
2. Fill in the donor registration form:
   - First Name, Last Name
   - Email Address
   - Location: Barangay, Municipality, Province
   - Upload a Valid ID (JPG, PNG, or PDF)
   - Accept Terms & Privacy Policy
3. Click "Sign Up"

Expected behavior:
- ✅ File uploads to `donor-ids` storage bucket
- ✅ Auth user created in Supabase Authentication
- ✅ Donor profile created in `digital_donor_profiles` table with status="Pending"
- ✅ Redirect to OTP verification page

### 5. Verify Data in Supabase

After signup, check:

**In Supabase Dashboard → Authentication:**
- New user should appear in Users list

**In SQL Editor - View all donor profiles:**
```sql
SELECT
  id,
  first_name,
  last_name,
  email,
  status,
  created_at
FROM digital_donor_profiles
ORDER BY created_at DESC;
```

**In Storage:**
- Go to `donor-ids` bucket
- Should see folder with user ID containing uploaded files

### 6. API Reference

#### Signup Endpoint
```
POST /api/auth/signup

Request:
{
  "email": "donor@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "barangay": "Barangay Name",
  "municipality": "Municipality Name",
  "province": "Province Name",
  "validIdUrl": "https://..." (optional - auto-uploaded)
}

Response:
{
  "success": true,
  "user": { /* Supabase user object */ },
  "message": "Donor profile created successfully"
}
```

#### Upload ID Endpoint
```
POST /api/auth/upload-id

Request: FormData
{
  "file": File (JPG/PNG/PDF, max 5MB),
  "userId": "unique-user-identifier"
}

Response:
{
  "success": true,
  "url": "https://...",
  "filename": "path/in/storage"
}
```

### 7. Database Schema Reference

**Table: digital_donor_profiles**
| Column | Type | Details |
|--------|------|---------|
| id | UUID | Primary Key |
| user_id | UUID | FK to auth.users |
| first_name | VARCHAR(255) | Required |
| last_name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Required, Unique |
| barangay | VARCHAR(255) | Optional |
| municipality | VARCHAR(255) | Optional |
| province | VARCHAR(255) | Optional |
| valid_id_url | TEXT | URL to uploaded ID |
| status | VARCHAR(50) | Default: 'Pending' |
| created_at | TIMESTAMP | Auto-set |
| updated_at | TIMESTAMP | Auto-set |

### 8. Troubleshooting

**Issue: "Missing Supabase configuration"**
- Check `.env.local` has correct SUPABASE_URL and keys
- Restart dev server after changing env vars

**Issue: File upload fails**
- Verify `donor-ids` bucket exists in Storage
- Check bucket permissions are Public
- Confirm file size < 5MB
- Allowed types: .jpg, .jpeg, .png, .pdf

**Issue: Donor profile not created**
- Check SUPABASE_SERVICE_ROLE_KEY is set
- Verify RLS policies on `digital_donor_profiles` table
- Check server logs for specific error

**Issue: Status not showing "Pending"**
- The default is set in the table schema
- Verify the migration ran successfully
- Check INSERT statements in signup API

### 9. Security Notes

- ✅ Row Level Security (RLS) enabled on profiles table
- ✅ Users can only view/update their own profiles
- ✅ Service role can manage all profiles (for admin)
- ✅ File uploads validated (type, size)
- ✅ Email uniqueness enforced
- ✅ user_id cascade delete to auth.users

---

**Status**: ✅ Phase 2 Complete - Donor backend microservices implemented
**Risk Level**: Low - Isolated feature, no impact on existing functionality
**Next Steps**: Monitor signup flow, adjust RLS policies as needed, create admin dashboard

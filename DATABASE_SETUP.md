# Database Setup Guide for User Types

## Appwrite Database Configuration

### 1. Create User Profiles Collection

In your Appwrite console, you need to create a new collection for user profiles:

**Collection Name:** `user_profiles`
**Collection ID:** `687140000001234567` (or generate a new one)

### 2. Collection Attributes

Create the following attributes in your `user_profiles` collection:

| Attribute Name | Type | Size | Required | Array | Default |
|---------------|------|------|----------|-------|---------|
| user_id | String | 255 | Yes | No | - |
| user_type | String | 50 | Yes | No | "normal" |
| full_name | String | 255 | Yes | No | - |
| email | String | 255 | Yes | No | - |
| phone | String | 20 | No | No | - |
| location | String | 255 | No | No | - |
| bio | String | 1000 | No | No | - |
| experience_years | Integer | - | No | No | - |
| specializations | String | 100 | No | Yes | - |
| certifications | String | 100 | No | Yes | - |
| verified | Boolean | - | Yes | No | false |
| created_at | DateTime | - | Yes | No | - |
| updated_at | DateTime | - | Yes | No | - |

### 3. Indexes

Create these indexes to improve query performance:

1. **user_id_index**
   - Type: Key
   - Attributes: [user_id]
   - Orders: [ASC]

2. **user_type_index**
   - Type: Key
   - Attributes: [user_type]
   - Orders: [ASC]

3. **verified_index**
   - Type: Key
   - Attributes: [verified]
   - Orders: [ASC]

4. **user_type_verified_index**
   - Type: Key
   - Attributes: [user_type, verified]
   - Orders: [ASC, ASC]

### 4. Permissions

Set up the following permissions for the collection:

**Create:**
- Any authenticated user can create (users creating their own profiles)

**Read:**
- Any authenticated user can read (users can view all profiles)

**Update:**
- Document creator can update their own profile
- Admin users can update any profile (for verification)

**Delete:**
- Document creator can delete their own profile
- Admin users can delete any profile

### 5. Update Collection ID

After creating the collection, update the collection ID in your code:

```typescript
// In lib/userProfileConfig.ts
export const USER_PROFILES_COLLECTION_ID = 'YOUR_ACTUAL_COLLECTION_ID';
```

### 6. Database Migration (Optional)

If you have existing users, you might want to create a migration script to populate the user_profiles collection with data from your existing users.

## Code Changes Summary

The following files have been updated to support user types:

1. **New Files:**
   - `lib/userProfileConfig.ts` - Database configuration for user profiles
   - `store/userProfileStore.ts` - State management for user profiles
   - `components/UserProfileCard.tsx` - Component to display user profiles
   - `app/herbalists.tsx` - Screen to browse herbalists

2. **Updated Files:**
   - `store/authStore.ts` - Added user profile integration
   - `app/(auth)/signup.tsx` - Added user type selection and additional fields
   - `i18n/config.ts` - Added translations for user types

## Testing

After setting up the database:

1. Test user registration with both user types
2. Verify that user profiles are created correctly
3. Test the herbalist directory functionality
4. Verify translations work in both languages

## Next Steps

1. Add user profile editing functionality
2. Implement user verification system for herbalists
3. Add profile images support
4. Create admin panel for user management
5. Add rating/review system for herbalists

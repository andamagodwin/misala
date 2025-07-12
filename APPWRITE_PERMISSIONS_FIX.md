# 🔐 Appwrite Permissions Fix Guide

## Step 1: Reset Blog Likes Collection Permissions

1. Go to Appwrite Console
2. Navigate to Databases → Your Database
3. Click on `blog_likes` collection
4. Go to Settings → Permissions
5. **REMOVE ALL EXISTING PERMISSIONS FIRST**
6. Add these permissions in this exact order:

For `blog_likes` collection:
```
Role: users
Permissions:
✓ Create
✓ Read
✓ Update
✓ Delete

Role: any
Permissions:
✓ Read
```

## Step 2: Document Security Setting

1. In the same Permissions panel
2. Look for "Document Security" toggle
3. Make sure it is **ENABLED**
4. Click "Update" to save changes

## Step 3: Clear App Data and Test

1. On your device/emulator:
   - Clear app data/cache
   - Force stop the app
2. Restart the app
3. Log in again
4. Try to like any blog post

## If Still Not Working

If you still get the error, try these steps:

1. Delete the `blog_likes` collection entirely
2. Create a new `blog_likes` collection with these attributes:
   - blogId (string, required)
   - userId (string, required)
   - createdAt (string)
3. Set the permissions as described in Step 1
4. Enable Document Security
5. Update the collection ID in your code if it changed

## Collection Attributes

Make sure your `blog_likes` collection has these exact attributes:
- `blogId` (string, required)
- `userId` (string, required)
- `createdAt` (string)

## Testing Steps

1. Create a blog post with User A
2. Log out
3. Log in as User B
4. Try to like User A's blog post

The like operation should now work without any permission errors.

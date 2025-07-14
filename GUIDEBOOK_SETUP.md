# Guidebook Upload Feature Setup Guide

This guide will help you set up the Appwrite database collection and storage bucket for the guidebook upload feature.

## Prerequisites
- Appwrite project already configured
- Access to Appwrite console

## Setup Steps

### 1. Create Storage Bucket

1. Go to your Appwrite console
2. Navigate to Storage section
3. Click "Create Bucket"
4. Use the following settings:
   - **Bucket ID**: `guidebooks_bucket`
   - **Name**: "Guidebooks"
   - **Permissions**: 
     - Read: `any`
     - Create: `users`
     - Update: `users`
     - Delete: `users`
   - **File Security**: Enable
   - **Maximum File Size**: 10MB (10485760 bytes)
   - **Allowed File Extensions**: `pdf,doc,docx`
   - **Compression**: Disabled
   - **Encryption**: Enabled (recommended)

### 2. Create Database Collection

1. Go to your Appwrite console
2. Navigate to Databases section
3. Select your existing database (should match `GUIDEBOOK_DATABASE_ID` in code)
4. Click "Create Collection"
5. Use the following settings:
   - **Collection ID**: `guidebooks`
   - **Name**: "Guidebooks"

### 3. Create Collection Attributes

Add the following attributes to the `guidebooks` collection:

| Attribute Key | Type | Size | Required | Default | Array |
|---------------|------|------|----------|---------|-------|
| `title` | String | 100 | Yes | - | No |
| `description` | String | 500 | Yes | - | No |
| `fileName` | String | 255 | Yes | - | No |
| `fileId` | String | 50 | Yes | - | No |
| `fileUrl` | String | 500 | Yes | - | No |
| `fileSize` | Integer | - | Yes | 0 | No |
| `fileType` | String | 50 | Yes | - | No |
| `uploadedBy` | String | 50 | Yes | - | No |
| `uploaderName` | String | 100 | Yes | - | No |
| `category` | String | 50 | Yes | Traditional Medicine | No |
| `tags` | String | 50 | No | - | Yes |
| `downloadCount` | Integer | - | Yes | 0 | No |
| `createdAt` | String | 50 | Yes | - | No |
| `updatedAt` | String | 50 | Yes | - | No |

### 4. Set Collection Permissions

Set the following permissions for the `guidebooks` collection:

**Read Permissions:**
- `any` (anyone can read guidebooks)

**Create Permissions:**
- `users` (authenticated users can create guidebooks)

**Update Permissions:**
- `users` (users can update their own guidebooks)

**Delete Permissions:**
- `users` (users can delete their own guidebooks)

### 5. Create Indexes (Optional but Recommended)

Create the following indexes for better performance:

1. **Search Index**
   - Key: `search`
   - Type: `fulltext`
   - Attributes: `title`, `description`, `category`

2. **Category Index**
   - Key: `category`
   - Type: `key`
   - Attributes: `category`

3. **Uploader Index**
   - Key: `uploader`
   - Type: `key`
   - Attributes: `uploadedBy`

4. **Created Date Index**
   - Key: `created_desc`
   - Type: `key`
   - Attributes: `createdAt`
   - Order: `DESC`

## Environment Variables

Make sure your `.env` file includes:

```
EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_BUNDLE_ID=your_bundle_id
```

## Testing the Feature

1. Login to your app
2. Navigate to the Conservation Hub
3. Switch to the "African Traditional Medicinal Plants Guide Books" tab
4. Click "Upload Guidebook"
5. Fill out the form and select a PDF/DOC file
6. Click "Upload"

## Troubleshooting

### Common Issues:

1. **"Collection not found" error**
   - Make sure the collection ID in the code matches your Appwrite collection ID
   - Check that the database ID is correct

2. **"Bucket not found" error**
   - Verify the bucket ID in the code matches your Appwrite bucket ID
   - Ensure the bucket permissions are set correctly

3. **"Permission denied" error**
   - Check that users have the correct permissions on both collection and bucket
   - Ensure the user is authenticated

4. **"Network request failed" error**
   - Check your internet connection
   - Verify Appwrite endpoint is accessible
   - Ensure the storage bucket exists and has correct ID
   - Check if your Appwrite project is active and not suspended
   - Verify the bucket has correct permissions for file uploads

5. **File upload fails**
   - Check file size limits (max 10MB)
   - Verify allowed file types (PDF, DOC, DOCX)
   - Check network connectivity
   - Ensure file URI is accessible

### Debug Tips:

1. Check the console logs for detailed error messages
2. Verify user authentication status
3. Test with smaller files first
4. Check Appwrite console logs for server-side errors
5. Test the Appwrite endpoint directly in browser
6. Verify your environment variables are correct

### Verification Steps:

**Step 1: Verify Appwrite Connection**
```bash
# Test if your Appwrite endpoint is accessible
curl -X GET "YOUR_APPWRITE_ENDPOINT/health"
```

**Step 2: Check Collection Exists**
1. Go to Appwrite Console > Databases
2. Verify the database ID: `6871206100262eb02793`
3. Check if collection `6874901a000373be1fb7` exists
4. Verify all attributes are created correctly

**Step 3: Check Storage Bucket Exists**
1. Go to Appwrite Console > Storage
2. Verify bucket ID: `68748f42002ef688a621`
3. Check permissions are set correctly
4. Verify file size limits and allowed extensions

**Step 4: Test Permissions**
- Ensure you're logged in as an authenticated user
- Check that the user has `users` role permissions
- Verify bucket allows `users` to create files

### Quick Fix Checklist:

- [ ] Appwrite project is active and accessible
- [ ] Database collection exists with correct ID
- [ ] Storage bucket exists with correct ID
- [ ] User is authenticated (logged in)
- [ ] Bucket permissions allow file creation by users
- [ ] Collection permissions allow document creation by users
- [ ] File size is under 10MB
- [ ] File type is PDF, DOC, or DOCX
- [ ] Network connectivity is stable

## File Upload Flow

1. User selects file using `expo-document-picker`
2. File is validated (size, type)
3. File is uploaded to Appwrite Storage
4. Metadata is saved to Appwrite Database
5. UI is updated with new guidebook
6. Success message is shown

## Download Flow

1. User clicks download button
2. Download count is incremented in database
3. Download URL is generated
4. File opens in device's default app (or browser)

## Features Included

- ✅ File upload with validation
- ✅ Metadata storage
- ✅ Download tracking
- ✅ Category filtering
- ✅ Tag system
- ✅ Search functionality (infrastructure ready)
- ✅ User authentication integration
- ✅ Error handling
- ✅ Loading states
- ✅ File type restrictions
- ✅ File size limits

## Future Enhancements

- Search and filter functionality in UI
- File preview capabilities
- Bulk upload support
- Admin moderation features
- Download analytics
- Rating system
- Comments on guidebooks

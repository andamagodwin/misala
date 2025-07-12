# Appwrite Blog System Setup Guide

## Overview
This guide will help you set up the blog system in Appwrite for your plant health app.

## Prerequisites
- Appwrite account and project already created
- Database already created

## Step 1: Create Collections

### 1. Blogs Collection
**Collection ID**: `blogs`

**Attributes**:
- `title` (String, 100 characters, required)
- `content` (String, 10000 characters, required)
- `author` (String, 100 characters, required)
- `authorId` (String, 50 characters, required)
- `category` (String, 50 characters, required)
- `readTime` (String, 20 characters, required)
- `likesCount` (Integer, required, default: 0)
- `commentsCount` (Integer, required, default: 0)
- `createdAt` (String, 50 characters, required)
- `updatedAt` (String, 50 characters, required)

**Indexes**:
- `title_search` (Key: `title`, Type: `fulltext`)
- `category_index` (Key: `category`, Type: `key`)
- `author_index` (Key: `authorId`, Type: `key`)
- `created_desc` (Key: `createdAt`, Type: `key`, Order: `desc`)

### 2. Blog Likes Collection
**Collection ID**: `blog_likes`

**Attributes**:
- `blogId` (String, 50 characters, required)
- `userId` (String, 50 characters, required)
- `createdAt` (String, 50 characters, required)

**Indexes**:
- `blog_user_index` (Key: `blogId, userId`, Type: `key`)
- `blog_index` (Key: `blogId`, Type: `key`)
- `user_index` (Key: `userId`, Type: `key`)

### 3. Blog Comments Collection
**Collection ID**: `blog_comments`

**Attributes**:
- `blogId` (String, 50 characters, required)
- `userId` (String, 50 characters, required)
- `author` (String, 100 characters, required)
- `content` (String, 1000 characters, required)
- `createdAt` (String, 50 characters, required)

**Indexes**:
- `blog_index` (Key: `blogId`, Type: `key`)
- `blog_created_desc` (Key: `blogId, createdAt`, Type: `key`, Order: `desc`)
- `user_index` (Key: `userId`, Type: `key`)

## Step 2: Set Permissions

### Collection Permissions Setup:

#### 1. Blogs Collection (`blogs`)
**Permissions**:
- **Create**: `users` (Any authenticated user can create blogs)
- **Read**: `any` (Anyone can read blogs)
- **Update**: Leave empty (handled by document-level permissions - only author)
- **Delete**: Leave empty (handled by document-level permissions - only author)

#### 2. Blog Likes Collection (`blog_likes`) 
**Permissions**:
- **Create**: `users` (Any authenticated user can like any blog)
- **Read**: `any` (Anyone can see likes)
- **Update**: `users` (Any authenticated user can update likes)
- **Delete**: `users` (Any authenticated user can delete likes)

#### 3. Blog Comments Collection (`blog_comments`)
**Permissions**:
- **Create**: `users` (Any authenticated user can comment on any blog)
- **Read**: `any` (Anyone can read comments)
- **Update**: Leave empty (handled by document-level permissions - only comment author)
- **Delete**: Leave empty (handled by document-level permissions - only comment author)

### Important Notes:
- **Likes**: Users should be able to like/unlike ANY blog post (not just their own)
- **Comments**: Users should be able to comment on ANY blog post (not just their own)
- **Blog Posts**: Users can only edit/delete their own blog posts
- **Own Comments**: Users can only edit/delete their own comments

### Permission Settings in Appwrite Console:
1. Go to your database in Appwrite Console
2. For each collection, click on "Settings" → "Permissions"
3. Set the permissions as described above:

#### For `blog_likes` collection:
- **Create**: Add "Users" role
- **Read**: Add "Any" role  
- **Update**: Add "Users" role
- **Delete**: Add "Users" role

#### For `blog_comments` collection:
- **Create**: Add "Users" role
- **Read**: Add "Any" role
- **Update**: Leave empty (document-level only)
- **Delete**: Leave empty (document-level only)

#### For `blogs` collection:
- **Create**: Add "Users" role
- **Read**: Add "Any" role
- **Update**: Leave empty (document-level only)
- **Delete**: Leave empty (document-level only)

## Step 3: Update Configuration

Update your `lib/blogConfig.ts` file with your actual database ID:

\`\`\`typescript
// Constants
export const BLOG_DATABASE_ID = 'YOUR_ACTUAL_DATABASE_ID'; // Replace this with your database ID
export const BLOG_COLLECTION_ID = 'blogs';
export const BLOG_LIKES_COLLECTION_ID = 'blog_likes';
export const BLOG_COMMENTS_COLLECTION_ID = 'blog_comments';
\`\`\`

**Note**: The configuration now uses the same database as your existing collections (history, remedies, etc.). You only need to update the `BLOG_DATABASE_ID` constant with your actual database ID.

## Step 4: Test the Setup

1. **Create a test blog post** using the add button
2. **Like the post** to test the like functionality
3. **Add a comment** to test the comment system
4. **Search for posts** using the search bar

## Step 5: Verify Database Structure

Check your Appwrite console to ensure:
- All collections are created with correct attributes
- Indexes are properly set up
- Permissions are configured correctly

## Troubleshooting

### Common Issues:

1. **"Collection not found"** - Check collection IDs match exactly in `lib/blogConfig.ts`
2. **"Permission denied"** - Most common issue. Check the following:
   - ✅ Collection has "Create" permission for "Users" role
   - ✅ Collection has "Read" permission for "Any" role
   - ✅ User is authenticated (check `useAuthStore`)
   - ✅ User session is valid
3. **"Attribute not found"** - Ensure all attributes are created with correct names and types
4. **"Database not found"** - Update `BLOG_DATABASE_ID` with your actual database ID
5. **"Index not found"** - Create the required indexes for search functionality

### Permission Troubleshooting Steps:

If you get "Permission denied" errors:

1. **Check User Authentication**:
   ```typescript
   // In your app, verify user is logged in
   const { user, isAuthenticated } = useAuthStore();
   console.log('User authenticated:', isAuthenticated);
   console.log('User ID:', user?.$id);
   ```

2. **Verify Collection Permissions**:
   - Go to Appwrite Console → Database → Collection → Settings → Permissions
   - Ensure "Create" permission has "Users" role added
   - Ensure "Read" permission has "Any" role added

3. **Check Document Permissions**:
   - The app sets document-level permissions automatically
   - Each user can only modify their own content

4. **Test with Simple Operation**:
   ```typescript
   // Try creating a simple blog post first
   await blogService.createBlog(
     'Test Post', 
     'Test content', 
     'Medicine', 
     'Test Author', 
     'user-id'
   );
   ```

### Required Indexes for Search:
- `title_search` (fulltext) - For searching blog titles
- `created_desc` (key, desc) - For ordering posts by creation date
- `category_index` (key) - For filtering by category

## Security Considerations

1. **User Authentication**: Only authenticated users can create, like, or comment
2. **Data Validation**: All inputs are validated on the client side
3. **Rate Limiting**: Consider implementing rate limiting for blog creation
4. **Content Moderation**: Consider adding content moderation for inappropriate posts

## Performance Optimization

1. **Pagination**: The system loads 50 posts at a time
2. **Lazy Loading**: Comments are loaded only when requested
3. **Search Optimization**: Uses fulltext search for better performance
4. **Caching**: Consider implementing caching for frequently accessed posts

## Next Steps

1. Set up the collections as described above
2. Update the configuration file with your actual IDs
3. Test the functionality in your app
4. Monitor the Appwrite console for any errors
5. Consider adding more advanced features like post categories, tags, or media uploads

## Categories Available

The system supports these blog categories:
- Medicine
- Gardening
- Skincare
- Nutrition
- Research
- DIY
- Tips
- Other

You can modify the categories in `components/AddBlogModal.tsx` if needed.

# Blog Permissions Fix Guide

## 🚨 **Issue**: Can't Like/Comment on Other Users' Blogs

You can like and comment on your own blogs but not on other users' blogs. This is a **collection-level permissions issue** in Appwrite.

## ✅ **Solution**: Update Collection Permissions

### **Step 1: Fix Blog Likes Collection Permissions**

1. Go to **Appwrite Console** → **Database** → **Your Database**
2. Click on **`blog_likes`** collection
3. Go to **"Settings"** → **"Permissions"**
4. Set these permissions:
   - ✅ **Create**: Add **"Users"** role
   - ✅ **Read**: Add **"Any"** role
   - ✅ **Update**: Add **"Users"** role ← **This is KEY**
   - ✅ **Delete**: Add **"Users"** role ← **This is KEY**

### **Step 2: Fix Blog Comments Collection Permissions**

1. Click on **`blog_comments`** collection
2. Go to **"Settings"** → **"Permissions"**
3. Set these permissions:
   - ✅ **Create**: Add **"Users"** role ← **This is KEY**
   - ✅ **Read**: Add **"Any"** role
   - ❌ **Update**: Leave empty (only comment author can update)
   - ❌ **Delete**: Leave empty (only comment author can delete)

### **Step 3: Verify Blog Collection Permissions**

1. Click on **`blogs`** collection
2. Go to **"Settings"** → **"Permissions"**
3. Ensure these permissions:
   - ✅ **Create**: Has **"Users"** role
   - ✅ **Read**: Has **"Any"** role
   - ❌ **Update**: Leave empty (only blog author can update)
   - ❌ **Delete**: Leave empty (only blog author can delete)

## 🔍 **Why This Happens**

- **Your own blogs**: Document-level permissions allow you to interact with your own content
- **Other users' blogs**: Collection-level permissions control if you can create likes/comments on ANY blog
- **Missing collection permissions**: Users can't create likes/comments on other users' blogs

## 🧪 **Test the Fix**

After updating the permissions:

1. **Test Liking**: Try liking a blog post from another user
2. **Test Commenting**: Try commenting on a blog post from another user
3. **Test Your Own**: Ensure you can still like/comment on your own blogs

## 🚀 **Expected Behavior After Fix**

- ✅ **Like any blog** (your own + others)
- ✅ **Comment on any blog** (your own + others)
- ✅ **Unlike your own likes** (on any blog)
- ✅ **Edit/delete only your own comments**
- ✅ **Edit/delete only your own blog posts**

## 📝 **Quick Permission Summary**

| Collection | Create | Read | Update | Delete |
|------------|--------|------|--------|--------|
| `blogs` | Users | Any | Empty | Empty |
| `blog_likes` | Users | Any | **Users** | **Users** |
| `blog_comments` | **Users** | Any | Empty | Empty |

The key changes are:
- **`blog_likes`**: Add Update + Delete permissions for Users
- **`blog_comments`**: Ensure Create permission for Users

This will allow users to like and comment on ANY blog post, not just their own!

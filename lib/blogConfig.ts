import { Databases, ID, Query, Models, Permission, Role } from 'react-native-appwrite';
import { client } from './appwriteConfig';

// Initialize Databases
const databases = new Databases(client);

// Constant
export const BLOG_DATABASE_ID = '6876693e003df851da66'; // Use your actual database ID
// export const BLOG_DATABASE_ID = '6871206100262eb02793'; // Use your actual database ID
export const BLOG_COLLECTION_ID = '687696d80015f027a205';
// export const BLOG_COLLECTION_ID = '68720545003c7f81447c';
export const BLOG_LIKES_COLLECTION_ID = '68769502000f489165ef';
// export const BLOG_LIKES_COLLECTION_ID = '68720a74003763b542e9';
export const BLOG_COMMENTS_COLLECTION_ID = '68766a00002878b51953';
// export const BLOG_COMMENTS_COLLECTION_ID = '68720b9000250e86ca74';

// Blog Document Interface
export interface BlogDocument extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  readTime: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

// Like Document Interface
export interface LikeDocument extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  blogId: string;
  userId: string;
  createdAt: string;
}

// Comment Document Interface
export interface CommentDocument extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  blogId: string;
  userId: string;
  author: string;
  content: string;
  createdAt: string;
}

export const blogService = {
  // Blog operations
  async createBlog(title: string, content: string, category: string, author: string, authorId: string) {
    const readTime = `${Math.ceil(content.split(' ').length / 200)} min read`;
    
    return await databases.createDocument(
      BLOG_DATABASE_ID,
      BLOG_COLLECTION_ID,
      ID.unique(),
      {
        title,
        content,
        author,
        authorId,
        category,
        readTime,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.any()),             // allow everyone to update counts
        Permission.update(Role.user(authorId)),     // author can update content
        Permission.delete(Role.user(authorId)),
      ]
    );
  },

  async fetchBlogs() {
    return await databases.listDocuments(
      BLOG_DATABASE_ID,
      BLOG_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.limit(50)]
    );
  },

  async searchBlogs(query: string) {
    return await databases.listDocuments(
      BLOG_DATABASE_ID,
      BLOG_COLLECTION_ID,
      query.trim() ? [
        Query.search('title', query),
        Query.orderDesc('$createdAt'),
        Query.limit(50)
      ] : [Query.orderDesc('$createdAt'), Query.limit(50)]
    );
  },

  async updateBlog(blogId: string, data: Partial<BlogDocument>) {
    return await databases.updateDocument(
      BLOG_DATABASE_ID,
      BLOG_COLLECTION_ID,
      blogId,
      data
    );
  },

  // Like operations
  async toggleLike(blogId: string, userId: string) {
    // Check if user already liked this blog
    const existingLike = await databases.listDocuments(
      BLOG_DATABASE_ID,
      BLOG_LIKES_COLLECTION_ID,
      [Query.equal('blogId', blogId), Query.equal('userId', userId)]
    );

    if (existingLike.documents.length > 0) {
      // Unlike - remove the like
      await databases.deleteDocument(
        BLOG_DATABASE_ID,
        BLOG_LIKES_COLLECTION_ID,
        existingLike.documents[0].$id
      );
      return false; // unliked
    } else {
      // Like - add the like
      await databases.createDocument(
        BLOG_DATABASE_ID,
        BLOG_LIKES_COLLECTION_ID,
        ID.unique(),
        {
          blogId,
          userId,
          createdAt: new Date().toISOString(),
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      );
      return true; // liked
    }
  },

  async checkUserLike(blogId: string, userId: string) {
    const response = await databases.listDocuments(
      BLOG_DATABASE_ID,
      BLOG_LIKES_COLLECTION_ID,
      [Query.equal('blogId', blogId), Query.equal('userId', userId)]
    );
    
    return response.documents.length > 0;
  },

  async updateLikesCount(blogId: string, increment: boolean) {
    const blog = await databases.getDocument(
      BLOG_DATABASE_ID,
      BLOG_COLLECTION_ID,
      blogId
    ) as BlogDocument;
    
    const newCount = increment 
      ? blog.likesCount + 1 
      : Math.max(0, blog.likesCount - 1);
    
    return await databases.updateDocument(
      BLOG_DATABASE_ID,
      BLOG_COLLECTION_ID,
      blogId,
      { likesCount: newCount }
    );
  },

  // Comment operations
  async addComment(blogId: string, userId: string, author: string, content: string) {
    return await databases.createDocument(
      BLOG_DATABASE_ID,
      BLOG_COMMENTS_COLLECTION_ID,
      ID.unique(),
      {
        blogId,
        userId,
        author,
        content,
        createdAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.any()),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  async fetchComments(blogId: string) {
    return await databases.listDocuments(
      BLOG_DATABASE_ID,
      BLOG_COMMENTS_COLLECTION_ID,
      [Query.equal('blogId', blogId), Query.orderDesc('$createdAt')]
    );
  },

  async updateCommentsCount(blogId: string, increment: boolean) {
    const blog = await databases.getDocument(
      BLOG_DATABASE_ID,
      BLOG_COLLECTION_ID,
      blogId
    ) as BlogDocument;
    
    const newCount = increment 
      ? blog.commentsCount + 1 
      : Math.max(0, blog.commentsCount - 1);
    
    return await databases.updateDocument(
      BLOG_DATABASE_ID,
      BLOG_COLLECTION_ID,
      blogId,
      { commentsCount: newCount }
    );
  },
};

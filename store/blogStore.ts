import { create } from 'zustand';
import { blogService, BlogDocument, CommentDocument } from '../lib/blogConfig';

interface BlogStore {
  blogs: BlogDocument[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  
  // Blog actions
  fetchBlogs: () => Promise<void>;
  searchBlogs: (query: string) => Promise<void>;
  createBlog: (title: string, content: string, category: string, author: string, authorId: string) => Promise<void>;
  
  // Like actions
  toggleLike: (blogId: string, userId: string) => Promise<void>;
  checkUserLike: (blogId: string, userId: string) => Promise<boolean>;
  
  // Comment actions
  addComment: (blogId: string, userId: string, author: string, content: string) => Promise<void>;
  fetchComments: (blogId: string) => Promise<CommentDocument[]>;
  
  // UI state
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  fetchBlogs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await blogService.fetchBlogs();
      set({ blogs: response.documents as BlogDocument[], isLoading: false });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch blogs', 
        isLoading: false 
      });
    }
  },

  searchBlogs: async (query: string) => {
    set({ isLoading: true, error: null, searchQuery: query });
    
    try {
      const response = await blogService.searchBlogs(query);
      set({ blogs: response.documents as BlogDocument[], isLoading: false });
    } catch (error) {
      console.error('Error searching blogs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search blogs', 
        isLoading: false 
      });
    }
  },

  createBlog: async (title: string, content: string, category: string, author: string, authorId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const newBlog = await blogService.createBlog(title, content, category, author, authorId);
      
      // Add to the beginning of the blogs array
      set(state => ({
        blogs: [newBlog as BlogDocument, ...state.blogs],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error creating blog:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create blog', 
        isLoading: false 
      });
    }
  },

  toggleLike: async (blogId: string, userId: string) => {
    try {
      const isLiked = await blogService.toggleLike(blogId, userId);
      
      // Update the likes count
      await blogService.updateLikesCount(blogId, isLiked);
      
      // Refresh blogs to get updated counts
      await get().fetchBlogs();
    } catch (error) {
      console.error('Error toggling like:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to toggle like' });
    }
  },

  checkUserLike: async (blogId: string, userId: string) => {
    try {
      return await blogService.checkUserLike(blogId, userId);
    } catch (error) {
      console.error('Error checking user like:', error);
      return false;
    }
  },

  addComment: async (blogId: string, userId: string, author: string, content: string) => {
    try {
      await blogService.addComment(blogId, userId, author, content);
      
      // Update blog comments count
      await blogService.updateCommentsCount(blogId, true);
      
      // Refresh blogs to get updated counts
      await get().fetchBlogs();
    } catch (error) {
      console.error('Error adding comment:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add comment' });
    }
  },

  fetchComments: async (blogId: string) => {
    try {
      const response = await blogService.fetchComments(blogId);
      return response.documents as CommentDocument[];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));

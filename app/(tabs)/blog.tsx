import { Stack } from 'expo-router';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  RefreshControl, 
  TextInput 
} from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useBlogStore } from '../../store/blogStore';
import { useAuthStore } from '../../store/authStore';
import { AddBlogModal } from '../../components/AddBlogModal';

export default function BlogScreen() {
  const { 
    blogs, 
    isLoading, 
    error, 
    searchQuery, 
    fetchBlogs, 
    searchBlogs, 
    toggleLike, 
    checkUserLike, 
    addComment, 
    fetchComments,
    setSearchQuery,
    clearError 
  } = useBlogStore();
  
  const { user } = useAuthStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userLikes, setUserLikes] = useState<{[key: string]: boolean}>({});
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [blogComments, setBlogComments] = useState<{[key: string]: any[]}>({});
  
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBlogs();
    setRefreshing(false);
  }, [fetchBlogs]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    searchBlogs(query);
  }, [searchBlogs, setSearchQuery]);

  const handleAddBlog = () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please login to create a blog post');
      return;
    }
    setShowAddModal(true);
  };

  const handleLike = async (blogId: string) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please login to like posts');
      return;
    }
    
    await toggleLike(blogId, user.$id);
    
    // Check if user likes this blog
    const isLiked = await checkUserLike(blogId, user.$id);
    setUserLikes(prev => ({
      ...prev,
      [blogId]: isLiked
    }));
  };

  const handleAddComment = async (blogId: string) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please login to comment');
      return;
    }
    
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }
    
    await addComment(blogId, user.$id, user.name || 'Anonymous', commentText);
    setCommentText('');
    
    // Refresh comments for this blog
    const comments = await fetchComments(blogId);
    setBlogComments(prev => ({
      ...prev,
      [blogId]: comments
    }));
  };

  const toggleCommentsView = async (blogId: string) => {
    const isVisible = showComments[blogId];
    
    if (!isVisible) {
      // Load comments when showing
      const comments = await fetchComments(blogId);
      setBlogComments(prev => ({
        ...prev,
        [blogId]: comments
      }));
    }
    
    setShowComments(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'skincare':
        return 'bg-blue-100 text-blue-800';
      case 'gardening':
        return 'bg-green-100 text-green-800';
      case 'medicine':
        return 'bg-purple-100 text-purple-800';
      case 'nutrition':
        return 'bg-orange-100 text-orange-800';
      case 'research':
        return 'bg-red-100 text-red-800';
      case 'diy':
        return 'bg-yellow-100 text-yellow-800';
      case 'tips':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white p-5 pb-3 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-2xl text-gray-800">
                Plant Health Blog
              </Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-1">
                Share knowledge about plants and natural remedies
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleAddBlog}
              className="bg-primary p-3 rounded-full shadow-lg"
            >
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <MaterialIcons name="search" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search blogs..."
              value={searchQuery}
              onChangeText={handleSearch}
              className="flex-1 ml-2 text-base"
              style={{ fontFamily: 'Poppins-Regular' }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <MaterialIcons name="clear" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Loading State */}
        {isLoading && blogs.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#008000" />
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-4">
              Loading blog posts...
            </Text>
          </View>
        )}

        {/* Blog Posts */}
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="p-5">
            {blogs.map((blog) => (
              <View
                key={blog.$id}
                className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Blog Header */}
                <View className="p-4 pb-3">
                  {/* Author & Date */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-3">
                        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-sm">
                          {getInitials(blog.author)}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800">
                          {blog.author}
                        </Text>
                        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-xs">
                          {formatDate(blog.createdAt)}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Category Badge */}
                    <View className={`px-3 py-1 rounded-full ${getCategoryColor(blog.category)}`}>
                      <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-xs">
                        {blog.category}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-xl text-gray-800 mb-2 leading-6">
                    {blog.title}
                  </Text>

                  {/* Content Preview */}
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mb-4 leading-6">
                    {blog.content.length > 150 
                      ? `${blog.content.substring(0, 150)}...` 
                      : blog.content
                    }
                  </Text>

                  {/* Read Time */}
                  <View className="flex-row items-center mb-4">
                    <MaterialIcons name="schedule" size={16} color="#6b7280" />
                    <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-sm ml-1">
                      {blog.readTime}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-100">
                  <TouchableOpacity
                    onPress={() => handleLike(blog.$id)}
                    className="flex-row items-center"
                  >
                    <MaterialIcons 
                      name={userLikes[blog.$id] ? "favorite" : "favorite-border"} 
                      size={20} 
                      color={userLikes[blog.$id] ? "#ef4444" : "#6b7280"} 
                    />
                    <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 ml-2">
                      {blog.likesCount}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => toggleCommentsView(blog.$id)}
                    className="flex-row items-center"
                  >
                    <MaterialIcons name="comment" size={20} color="#6b7280" />
                    <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 ml-2">
                      {blog.commentsCount}
                    </Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity className="flex-row items-center">
                    <MaterialIcons name="share" size={20} color="#6b7280" />
                    <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 ml-2">
                      Share
                    </Text>
                  </TouchableOpacity> */}
                </View>

                {/* Comments Section */}
                {showComments[blog.$id] && (
                  <View className="border-t border-gray-100 p-4">
                    {/* Add Comment */}
                    <View className="flex-row items-center mb-4">
                      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-3">
                        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xs">
                          {getInitials(user?.name || '')}
                        </Text>
                      </View>
                      <View className="flex-1 flex-row items-center">
                        <TextInput
                          placeholder="Add a comment..."
                          value={commentText}
                          onChangeText={setCommentText}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
                          style={{ fontFamily: 'Poppins-Regular' }}
                        />
                        <TouchableOpacity
                          onPress={() => handleAddComment(blog.$id)}
                          className="bg-primary p-2 rounded-lg"
                        >
                          <MaterialIcons name="send" size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Comments List */}
                    {blogComments[blog.$id]?.map((comment, index) => (
                      <View key={index} className="flex-row items-start mb-3">
                        <View className="w-8 h-8 rounded-full bg-gray-400 items-center justify-center mr-3">
                          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xs">
                            {getInitials(comment.author)}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-800 text-sm">
                            {comment.author}
                          </Text>
                          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-sm">
                            {comment.content}
                          </Text>
                          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-xs mt-1">
                            {formatDate(comment.createdAt)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {/* Empty State */}
            {blogs.length === 0 && !isLoading && (
              <View className="flex-1 justify-center items-center py-20">
                <MaterialIcons name="article" size={64} color="#9ca3af" />
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-gray-500 text-xl mt-4">
                  No blog posts yet
                </Text>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-400 text-center mt-2">
                  Be the first to share your plant knowledge!
                </Text>
                <TouchableOpacity
                  onPress={handleAddBlog}
                  className="bg-primary px-6 py-3 rounded-lg mt-6"
                >
                  <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white">
                    Create First Post
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Add Blog Modal */}
        <AddBlogModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </View>
    </>
  );
}

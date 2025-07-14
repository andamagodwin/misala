import { Stack } from 'expo-router';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  RefreshControl, 
  TextInput,
  Linking 
} from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useBlogStore } from '../../store/blogStore';
import { useAuthStore } from '../../store/authStore';
import { useGuidebookStore } from '../../store/guidebookStore';
import TabSwitch from '../../components/TabSwitch';

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

  const {
    guidebooks,
    isLoading: guidebooksLoading,
    isUploading,
    error: guidebookError,
    fetchGuidebooks,
    uploadGuidebook,
    downloadGuidebook,
    clearError: clearGuidebookError
  } = useGuidebookStore();
  
  const { user } = useAuthStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [userLikes, setUserLikes] = useState<{[key: string]: boolean}>({});
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [blogComments, setBlogComments] = useState<{[key: string]: any[]}>({});
  const [activeTab, setActiveTab] = useState<'left' | 'center' | 'right'>('left');
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Medicine');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Guidebook upload state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [guidebookTitle, setGuidebookTitle] = useState('');
  const [guidebookDescription, setGuidebookDescription] = useState('');
  const [guidebookCategory, setGuidebookCategory] = useState('Traditional Medicine');
  const [guidebookTags, setGuidebookTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  
  useEffect(() => {
    fetchBlogs();
    fetchGuidebooks();
  }, [fetchBlogs, fetchGuidebooks]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (guidebookError) {
      Alert.alert('Guidebook Error', guidebookError);
      clearGuidebookError();
    }
  }, [guidebookError, clearGuidebookError]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBlogs();
    if (activeTab === 'center') {
      await fetchGuidebooks();
    }
    setRefreshing(false);
  }, [fetchBlogs, fetchGuidebooks, activeTab]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    searchBlogs(query);
  }, [searchBlogs, setSearchQuery]);

  const handleAddBlog = () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please login to create a blog post');
      return;
    }
    setShowCreateBlog(true);
  };

  const handleTabChange = (tab: 'left' | 'center' | 'right') => {
    setActiveTab(tab);
  };

  const handleSubmitBlog = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to create a blog post');
      return;
    }

    if (!blogTitle.trim() || !blogContent.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    if (blogTitle.length > 100) {
      Alert.alert('Error', 'Title must be 100 characters or less');
      return;
    }

    if (blogContent.length > 5000) {
      Alert.alert('Error', 'Content must be 5000 characters or less');
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the blog store's createBlog function
      await useBlogStore.getState().createBlog(
        blogTitle.trim(),
        blogContent.trim(),
        blogCategory,
        user.name || 'Anonymous',
        user.$id
      );

      // Reset form
      setBlogTitle('');
      setBlogContent('');
      setBlogCategory('Medicine');
      setShowCreateBlog(false);
      
      Alert.alert('Success', 'Blog post created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      Alert.alert('Error', 'Failed to create blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guidebook functions
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        
        // Check file size (limit to 10MB)
        if (file.size && file.size > 10 * 1024 * 1024) {
          Alert.alert('Error', 'File size must be less than 10MB');
          return;
        }

        setSelectedFile(file);
        Alert.alert('File Selected', `Selected: ${file.name}`);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const handleUploadGuidebook = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to upload guidebooks');
      return;
    }

    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    if (!guidebookTitle.trim()) {
      Alert.alert('Error', 'Please enter a title for the guidebook');
      return;
    }

    if (!guidebookDescription.trim()) {
      Alert.alert('Error', 'Please enter a description for the guidebook');
      return;
    }

    try {
      const tags = guidebookTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      await uploadGuidebook(
        selectedFile,
        guidebookTitle.trim(),
        guidebookDescription.trim(),
        guidebookCategory,
        tags,
        user.name || 'Anonymous',
        user.$id
      );

      // Reset form
      setGuidebookTitle('');
      setGuidebookDescription('');
      setGuidebookCategory('Traditional Medicine');
      setGuidebookTags('');
      setSelectedFile(null);
      setShowUploadForm(false);

      Alert.alert('Success', 'Guidebook uploaded successfully!');
    } catch (error) {
      console.error('Error uploading guidebook:', error);
      Alert.alert('Error', 'Failed to upload guidebook. Please try again.');
    }
  };

  const handleDownloadGuidebook = async (guidebookId: string, fileId: string, fileName: string) => {
    try {
      const downloadUrl = await downloadGuidebook(guidebookId, fileId);
      await Linking.openURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading guidebook:', error);
      Alert.alert('Error', 'Failed to download guidebook. Please try again.');
    }
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

  const renderSustainableHarvestingGuides = () => (
    <View className="p-5">
      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-xl text-gray-800 mb-4">
        Sustainable Harvesting Guides
      </Text>
      
      {/* Aloe Vera Guide */}
      <View className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
        <View className="p-4">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="eco" size={24} color="#008000" />
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 ml-2">
              Aloe Vera (Aloe barbadensis)
            </Text>
          </View>
          
          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
            Best Harvesting Time:
          </Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mb-3">
            • Early morning when leaves are full of moisture
            • Plants should be at least 3-4 years old
            • Choose outer, mature leaves
          </Text>
          
          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
            Sustainable Practices:
          </Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mb-3">
            • Never harvest more than 1/3 of the plant at once
            • Allow 6-8 weeks between harvests
            • Cut at the base with a clean, sharp knife
            • Leave the root system intact
          </Text>
          
          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
            Traditional Uses:
          </Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600">
            • Wound healing and burns
            • Digestive health
            • Skin moisturizing
            • Anti-inflammatory treatments
          </Text>
        </View>
      </View>
      
      {/* Add more plants here */}
      <View className="items-center py-8">
        <MaterialIcons name="nature" size={48} color="#9ca3af" />
        <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-500 mt-2">
          More harvesting guides coming soon...
        </Text>
      </View>
    </View>
  );

  const renderGuidebooks = () => (
    <View className="p-5">
      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-xl text-gray-800 mb-4">
        Traditional Medicinal Plants Guidebooks
      </Text>
      
      {/* Upload Form */}
      {showUploadForm && (
        <View className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <View className="p-4 border-b border-gray-200">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800">
              Upload New Guidebook
            </Text>
          </View>
          <View className="p-4">
            {/* File Selection */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Select File (PDF, DOC, DOCX - Max 10MB)
              </Text>
              <TouchableOpacity
                onPress={handlePickFile}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center"
              >
                <MaterialIcons name="cloud-upload" size={32} color="#6b7280" />
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-600 mt-2">
                  {selectedFile ? selectedFile.name : 'Tap to select file'}
                </Text>
                {selectedFile && (
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-sm mt-1">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Title ({guidebookTitle.length}/100)
              </Text>
              <TextInput
                placeholder="Enter guidebook title..."
                value={guidebookTitle}
                onChangeText={setGuidebookTitle}
                maxLength={100}
                className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                style={{ fontFamily: 'Poppins-Regular' }}
              />
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Description ({guidebookDescription.length}/500)
              </Text>
              <TextInput
                placeholder="Describe the guidebook content..."
                value={guidebookDescription}
                onChangeText={setGuidebookDescription}
                maxLength={500}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                style={{ fontFamily: 'Poppins-Regular', height: 80 }}
              />
            </View>

            {/* Category Selection */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                {['Traditional Medicine', 'Herbal Remedies', 'Plant Identification', 'Cultivation', 'Research', 'Other'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setGuidebookCategory(cat)}
                    className={`mr-2 px-4 py-2 rounded-full ${
                      guidebookCategory === cat ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      style={{ fontFamily: 'Poppins-Medium' }}
                      className={`text-sm ${guidebookCategory === cat ? 'text-white' : 'text-gray-700'}`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Tags Input */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Tags (comma-separated)
              </Text>
              <TextInput
                placeholder="e.g. healing, herbs, traditional, africa"
                value={guidebookTags}
                onChangeText={setGuidebookTags}
                className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                style={{ fontFamily: 'Poppins-Regular' }}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setShowUploadForm(false);
                  setGuidebookTitle('');
                  setGuidebookDescription('');
                  setGuidebookCategory('Traditional Medicine');
                  setGuidebookTags('');
                  setSelectedFile(null);
                }}
                className="bg-gray-200 px-6 py-3 rounded-lg mr-3"
                disabled={isUploading}
              >
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleUploadGuidebook}
                className="bg-primary px-6 py-3 rounded-lg flex-row items-center"
                disabled={isUploading || !selectedFile || !guidebookTitle.trim() || !guidebookDescription.trim()}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="cloud-upload" size={16} color="white" />
                )}
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white ml-2">
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Upload Section */}
      {!showUploadForm && (
        <View className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <View className="p-4">
            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-3">
              Share Knowledge
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mb-4">
              Upload guidebooks, research papers, or traditional knowledge documents to help preserve and share African medicinal plant wisdom.
            </Text>
            
            <TouchableOpacity 
              className="bg-primary p-4 rounded-lg items-center"
              onPress={() => {
                if (!user) {
                  Alert.alert('Authentication Required', 'Please login to upload guidebooks');
                  return;
                }
                setShowUploadForm(true);
              }}
            >
              <MaterialIcons name="cloud-upload" size={24} color="white" />
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white mt-2">
                Upload Guidebook
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Loading State */}
      {guidebooksLoading && guidebooks.length === 0 && (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#008000" />
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-4">
            Loading guidebooks...
          </Text>
        </View>
      )}
      
      {/* Guidebooks List */}
      {guidebooks.map((guidebook) => (
        <View key={guidebook.$id} className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <View className="p-4">
            {/* Header */}
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800 mb-1">
                  {guidebook.title}
                </Text>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mb-2">
                  {guidebook.description}
                </Text>
              </View>
              <View className={`px-3 py-1 rounded-full bg-green-100`}>
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-xs text-green-800">
                  {guidebook.category}
                </Text>
              </View>
            </View>

            {/* File Info */}
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="description" size={16} color="#6b7280" />
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-sm ml-1">
                {guidebook.fileName} • {(guidebook.fileSize / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>

            {/* Tags */}
            {guidebook.tags && guidebook.tags.length > 0 && (
              <View className="flex-row flex-wrap mb-3">
                {guidebook.tags.map((tag, index) => (
                  <View key={index} className="bg-gray-100 px-2 py-1 rounded-md mr-2 mb-1">
                    <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-xs">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Metadata */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 text-sm">
                  Uploaded by {guidebook.uploaderName}
                </Text>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-xs">
                  {formatDate(guidebook.createdAt)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons name="download" size={16} color="#6b7280" />
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-500 text-sm ml-1">
                  {guidebook.downloadCount} downloads
                </Text>
              </View>
            </View>

            {/* Download Button */}
            <TouchableOpacity
              onPress={() => handleDownloadGuidebook(guidebook.$id, guidebook.fileId, guidebook.fileName)}
              className="bg-primary p-3 rounded-lg flex-row items-center justify-center"
            >
              <MaterialIcons name="download" size={20} color="white" />
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white ml-2">
                Download Guidebook
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
      {/* Empty State */}
      {guidebooks.length === 0 && !guidebooksLoading && (
        <View className="items-center py-8">
          <MaterialIcons name="library-books" size={48} color="#9ca3af" />
          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-500 mt-2">
            No guidebooks uploaded yet
          </Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-400 text-center mt-1">
            Be the first to share traditional knowledge!
          </Text>
        </View>
      )}
    </View>
  );

  const renderBlogs = () => (
    <View className="p-5">
      {/* Inline Blog Creation Form */}
      {showCreateBlog && (
        <View className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <View className="p-4 border-b border-gray-200">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-lg text-gray-800">
              Create New Blog Post
            </Text>
          </View>
          <View className="p-4">
            {/* Title Input */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Title ({blogTitle.length}/100)
              </Text>
              <TextInput
                placeholder="Enter blog title..."
                value={blogTitle}
                onChangeText={setBlogTitle}
                maxLength={100}
                className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                style={{ fontFamily: 'Poppins-Regular' }}
              />
            </View>

            {/* Category Selection */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                {['Medicine', 'Gardening', 'Skincare', 'Nutrition', 'Research', 'DIY', 'Tips', 'Other'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setBlogCategory(cat)}
                    className={`mr-2 px-4 py-2 rounded-full ${
                      blogCategory === cat ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      style={{ fontFamily: 'Poppins-Medium' }}
                      className={`text-sm ${blogCategory === cat ? 'text-white' : 'text-gray-700'}`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Content Input */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Content ({blogContent.length}/5000)
              </Text>
              <TextInput
                placeholder="Write your blog content..."
                value={blogContent}
                onChangeText={setBlogContent}
                maxLength={5000}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                style={{ fontFamily: 'Poppins-Regular', height: 120 }}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setShowCreateBlog(false);
                  setBlogTitle('');
                  setBlogContent('');
                  setBlogCategory('Medicine');
                }}
                className="bg-gray-200 px-6 py-3 rounded-lg mr-3"
                disabled={isSubmitting}
              >
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSubmitBlog}
                className="bg-primary px-6 py-3 rounded-lg flex-row items-center"
                disabled={isSubmitting || !blogTitle.trim() || !blogContent.trim()}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="send" size={16} color="white" />
                )}
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white ml-2">
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {blogs.map((blog) => (
        <View
          key={blog.$id}
          className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden"
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

      {/* Empty State for Blogs */}
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
  );

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white p-5 pb-3 border-b border-gray-200">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-2xl text-gray-800">
                Conservation Hub
              </Text>
            </View>
            {activeTab === 'right' && (
              <TouchableOpacity
                onPress={handleAddBlog}
                className="bg-primary p-3 rounded-md shadow-lg"
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Tab Switch */}
          <TabSwitch onTabChange={handleTabChange} />
          
          {/* Search Bar - Only show for blogs tab */}
          {activeTab === 'right' && (
            <View className="flex-row items-center bg-white rounded-lg px-3 py-2 mt-3">
              <MaterialIcons name="search" size={28} color="#6b7280" />
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
          )}
        </View>

        {/* Loading State */}
        {isLoading && blogs.length === 0 && activeTab === 'right' && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#008000" />
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 mt-4">
              Loading blog posts...
            </Text>
          </View>
        )}

        {/* Tab Content */}
        <ScrollView
          className="flex-1"
          refreshControl={
            activeTab === 'right' ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : activeTab === 'center' ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
          {activeTab === 'left' && renderSustainableHarvestingGuides()}
          {activeTab === 'center' && renderGuidebooks()}
          {activeTab === 'right' && renderBlogs()}
        </ScrollView>
      </View>
    </>
  );
}

import { Stack } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// Mock blog data - replace with actual API calls later
const mockBlogPosts = [
  {
    id: '1',
    title: 'The Amazing Benefits of Aloe Vera',
    excerpt: 'Discover the incredible healing properties of aloe vera and how it can transform your skincare routine.',
    author: 'Dr. Sarah Johnson',
    date: '2025-01-10',
    readTime: '5 min read',
    category: 'Skincare',
    image: null,
  },
  {
    id: '2',
    title: 'Growing Medicinal Herbs at Home',
    excerpt: 'Learn how to create your own medicinal herb garden with these easy-to-grow plants that offer powerful health benefits.',
    author: 'Mike Green',
    date: '2025-01-08',
    readTime: '7 min read',
    category: 'Gardening',
    image: null,
  },
  {
    id: '3',
    title: 'Traditional Plant Medicine: Ancient Wisdom for Modern Health',
    excerpt: 'Explore how traditional plant medicine practices are being validated by modern science and integrated into healthcare.',
    author: 'Dr. Maria Santos',
    date: '2025-01-05',
    readTime: '10 min read',
    category: 'Medicine',
    image: null,
  },
];

export default function BlogScreen() {
  const [blogPosts] = useState(mockBlogPosts);
  const [isLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePostPress = (postId: string) => {
    // Navigate to blog post detail - implement later
    Alert.alert('Coming Soon', 'Blog post details will be available soon!');
  };

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white p-5 pb-3 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Plant Health Blog</Text>
              <Text className="text-gray-600 mt-1">
                Latest insights on plant medicine and wellness
              </Text>
            </View>
            <TouchableOpacity className="bg-primary p-2 rounded-full">
              <MaterialIcons name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {isLoading && blogPosts.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#6cf16b" />
            <Text className="text-gray-600 mt-4">Loading blog posts...</Text>
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
            {blogPosts.map((post) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => handlePostPress(post.id)}
                className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Featured Image Placeholder */}
                <View className="h-48 bg-gray-200 items-center justify-center">
                  <MaterialIcons name="article" size={40} color="#9ca3af" />
                  <Text className="text-gray-500 mt-2">Featured Image</Text>
                </View>

                {/* Content */}
                <View className="p-4">
                  {/* Category Badge */}
                  <View className="mb-3">
                    <View className={`inline-flex px-2 py-1 rounded-full self-start ${getCategoryColor(post.category)}`}>
                      <Text className="text-xs font-medium">
                        {post.category}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text className="text-xl font-bold text-gray-800 mb-2 leading-6">
                    {post.title}
                  </Text>

                  {/* Excerpt */}
                  <Text className="text-gray-600 mb-4 leading-6">
                    {post.excerpt}
                  </Text>

                  {/* Meta Information */}
                  <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-3">
                        <Text className="text-white font-bold text-sm">
                          {post.author.charAt(0)}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-gray-800 font-medium text-sm">
                          {post.author}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {formatDate(post.date)}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons name="schedule" size={16} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {post.readTime}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Load More Button */}
            <TouchableOpacity className="bg-primary py-3 rounded-lg items-center mt-4 mb-8">
              <Text className="text-white font-semibold">Load More Posts</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

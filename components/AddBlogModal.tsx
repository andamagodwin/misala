import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useBlogStore } from '../store/blogStore';
import { useAuthStore } from '../store/authStore';

interface AddBlogModalProps {
  visible: boolean;
  onClose: () => void;
}

const categories = [
  'Medicine',
  'Gardening', 
  'Skincare',
  'Nutrition',
  'Research',
  'DIY',
  'Tips',
  'Other'
];

export const AddBlogModal: React.FC<AddBlogModalProps> = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Medicine');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createBlog } = useBlogStore();
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter content');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please login to create a blog post');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createBlog(
        title.trim(),
        content.trim(),
        selectedCategory,
        user.name || 'Anonymous',
        user.$id
      );
      
      // Reset form
      setTitle('');
      setContent('');
      setSelectedCategory('Medicine');
      
      Alert.alert('Success', 'Blog post created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating blog:', error);
      Alert.alert('Error', 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    // Reset form when closing
    setTitle('');
    setContent('');
    setSelectedCategory('Medicine');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="bg-primary p-4 pb-6">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg">
                Create Blog Post
              </Text>
              <TouchableOpacity 
                onPress={handleSubmit} 
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-full ${isSubmitting ? 'bg-gray-400' : 'bg-white'}`}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#008000" />
                ) : (
                  <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-primary">
                    Post
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Title Input */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter blog title..."
                className="border border-gray-300 rounded-lg p-3 text-base"
                style={{ fontFamily: 'Poppins-Regular' }}
                multiline
                maxLength={100}
                editable={!isSubmitting}
              />
              <Text className="text-gray-500 text-xs mt-1">
                {title.length}/100 characters
              </Text>
            </View>

            {/* Category Selection */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-full border ${
                        selectedCategory === category
                          ? 'bg-primary border-primary'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <Text
                        style={{ fontFamily: 'Poppins-Medium' }}
                        className={`text-sm ${
                          selectedCategory === category ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Content Input */}
            <View className="mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Content
              </Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Write your blog content here..."
                className="border border-gray-300 rounded-lg p-3 text-base min-h-[200px]"
                style={{ fontFamily: 'Poppins-Regular' }}
                multiline
                textAlignVertical="top"
                maxLength={5000}
                editable={!isSubmitting}
              />
              <Text className="text-gray-500 text-xs mt-1">
                {content.length}/5000 characters
              </Text>
            </View>

            {/* Writing Tips */}
            <View className="bg-gray-50 p-4 rounded-lg mb-4">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-gray-700 mb-2">
                Writing Tips
              </Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600 text-sm">
                • Share your knowledge about plants and natural remedies{'\n'}
                • Include practical tips that readers can apply{'\n'}
                • Keep your content clear and easy to understand{'\n'}
                • Cite sources when sharing scientific information
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

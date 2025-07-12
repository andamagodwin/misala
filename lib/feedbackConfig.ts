import { Databases, ID, Query, Models, Permission, Role } from 'react-native-appwrite';
import { client } from './appwriteConfig';

// Initialize Databases
const databases = new Databases(client);

// Constants
export const FEEDBACK_DATABASE_ID = '6871206100262eb02793'; // Use your existing database ID
export const PREDICTION_FEEDBACK_COLLECTION_ID = '6872abb4003097d4cf84'; // Will need to create this collection

// Prediction Feedback Document Interface
export interface PredictionFeedbackDocument extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  user_id: string;
  user_name: string;
  predicted_class: string;
  confidence_score: number;
  image_uri: string;
  feedback_type: 'incorrect' | 'partially_correct' | 'missing_info';
  suggested_correct_name?: string;
  additional_comments?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  updated_at: string;
}

export const predictionFeedbackService = {
  // Submit feedback for a prediction
  async submitFeedback(feedbackData: {
    user_id: string;
    user_name: string;
    predicted_class: string;
    confidence_score: number;
    image_uri: string;
    feedback_type: 'incorrect' | 'partially_correct' | 'missing_info';
    suggested_correct_name?: string;
    additional_comments?: string;
  }) {
    try {
      const response = await databases.createDocument(
        FEEDBACK_DATABASE_ID,
        PREDICTION_FEEDBACK_COLLECTION_ID,
        ID.unique(),
        {
          ...feedbackData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(feedbackData.user_id)),
          Permission.delete(Role.user(feedbackData.user_id)),
        ]
      );
      
      return response as PredictionFeedbackDocument;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  // Get user's feedback history
  async getUserFeedback(userId: string) {
    try {
      const response = await databases.listDocuments(
        FEEDBACK_DATABASE_ID,
        PREDICTION_FEEDBACK_COLLECTION_ID,
        [
          Query.equal('user_id', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );
      
      return response.documents as PredictionFeedbackDocument[];
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      throw error;
    }
  },

  // Get all pending feedback (for admin)
  async getPendingFeedback() {
    try {
      const response = await databases.listDocuments(
        FEEDBACK_DATABASE_ID,
        PREDICTION_FEEDBACK_COLLECTION_ID,
        [
          Query.equal('status', 'pending'),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      
      return response.documents as PredictionFeedbackDocument[];
    } catch (error) {
      console.error('Error fetching pending feedback:', error);
      throw error;
    }
  },

  // Update feedback status (for admin)
  async updateFeedbackStatus(feedbackId: string, status: 'pending' | 'reviewed' | 'resolved') {
    try {
      const response = await databases.updateDocument(
        FEEDBACK_DATABASE_ID,
        PREDICTION_FEEDBACK_COLLECTION_ID,
        feedbackId,
        {
          status,
          updated_at: new Date().toISOString(),
        }
      );
      
      return response as PredictionFeedbackDocument;
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error;
    }
  },
};

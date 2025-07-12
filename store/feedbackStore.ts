import { create } from 'zustand';
import { predictionFeedbackService, PredictionFeedbackDocument } from '../lib/feedbackConfig';

interface FeedbackStore {
  isSubmitting: boolean;
  error: string | null;
  userFeedback: PredictionFeedbackDocument[];
  
  // Actions
  submitFeedback: (feedbackData: {
    user_id: string;
    user_name: string;
    predicted_class: string;
    confidence_score: number;
    image_uri: string;
    feedback_type: 'incorrect' | 'partially_correct' | 'missing_info';
    suggested_correct_name?: string;
    additional_comments?: string;
  }) => Promise<boolean>;
  getUserFeedback: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  isSubmitting: false,
  error: null,
  userFeedback: [],

  submitFeedback: async (feedbackData) => {
    set({ isSubmitting: true, error: null });
    
    try {
      await predictionFeedbackService.submitFeedback(feedbackData);
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit feedback', 
        isSubmitting: false 
      });
      return false;
    }
  },

  getUserFeedback: async (userId: string) => {
    try {
      const feedback = await predictionFeedbackService.getUserFeedback(userId);
      set({ userFeedback: feedback });
    } catch (error) {
      console.error('Error getting user feedback:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get feedback history'
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

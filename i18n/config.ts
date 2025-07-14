import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      history: 'History',
      conservation: 'Conservation',
      
      // Home Screen
      gallery: 'Gallery',
      camera: 'Camera',
      identify: 'Identify',
      remove: 'Remove',
      predictionResult: 'Prediction Result',
      plant: 'Plant',
      confidence: 'Confidence',
      highConfidence: 'High confidence prediction',
      moderateConfidence: 'Moderate confidence prediction',
      lowConfidence: 'Low confidence prediction',
      learnMore: 'Learn More',
      reportIssue: 'Report Issue',
      chooseImage: 'Choose an image from your gallery or take a photo to get started.',
      greatNowIdentify: 'Great! Now you can identify your selected image.',
      plantIdentified: 'The plant has been identified as {{plant}} with {{confidence}}% confidence.',
      
      // Prediction
      prediction: {
        noImage: {
          title: 'No Image Selected',
          message: 'Please select an image first',
        },
        error: {
          title: 'Prediction Error',
          message: 'Failed to identify the plant. Please try again.',
        },
        result: {
          title: 'Prediction Result',
          plant: 'Plant',
          confidence: 'Confidence',
          highConfidence: 'High confidence prediction',
          moderateConfidence: 'Moderate confidence prediction',
          lowConfidence: 'Low confidence prediction',
          learnMore: 'Learn More',
          reportIssue: 'Report Issue',
        },
        instructions: {
          chooseImage: 'Choose an image from your gallery or take a photo to get started.',
          imageSelected: 'Great! Now you can identify your selected image.',
          plantIdentified: 'The plant has been identified as',
          confidence: 'with',
        },
      },
      
      // History Screen
      plantHistory: 'Plant History',
      clearAll: 'Clear All',
      identification: 'identification',
      identifications: 'identifications',
      noHistory: 'No plant identifications yet',
      startIdentifying: 'Start identifying plants to see your history here',
      loginToView: 'Please login to view your history',
      loadingHistory: 'Loading your history...',
      deleteHistoryItem: 'Delete History Item',
      deleteConfirm: 'Are you sure you want to delete "{{plantName}}" from your history?',
      clearAllHistory: 'Clear All History',
      clearAllConfirm: 'Are you sure you want to clear all your plant identification history? This action cannot be undone.',
      
      // Conservation Screen
      conservationHub: 'Conservation Hub',
      sustainableHarvesting: 'Sustainable Harvesting Guides',
      traditionalMedicine: 'African Traditional Medicinal Plants Guide Books',
      blogs: 'Blogs',
      
      // Authentication
      hello: 'Hello! Register to get started',
      signUpSubtitle: 'Sign up to get started',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account? Sign in',
      welcomeBack: 'Welcome back! Glad to see you again!',
      signIn: 'Sign In',
      dontHaveAccount: "Don't have an account? Sign up",
      
      // Error messages
      fill_all_fields: 'Please fill in all fields',
      passwords_do_not_match: 'Passwords do not match',
      password_min_length: 'Password must be at least 8 characters long',
      signup_failed: 'Signup failed',
      account_already_exists: 'Account with this email already exists',
      signup_error: 'Signup Error',
      account_created_successfully: 'Account created successfully',
      hello_register: 'Hello! Register to get started',
      sign_up_to_get_started: 'Sign up to get started',
      full_name: 'Full Name',
      
      // Blog/Remedy Forms
      shareRemedy: 'Share a Remedy',
      title: 'Title',
      plantName: 'Plant Name',
      description: 'Description',
      ingredients: 'Ingredients',
      preparationMethod: 'Preparation Method',
      usageInstructions: 'Usage Instructions',
      benefits: 'Benefits (Optional)',
      cautions: 'Cautions (Optional)',
      requiredFields: 'Fields marked with * are required',
      
      // Common
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save',
      share: 'Share',
      upload: 'Upload',
      download: 'Download',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      
      // Permissions
      permissions: {
        required: 'Permissions Required',
        message: 'Sorry, we need camera and media library permissions to make this work!',
      },
      
      // Settings
      language: 'Language',
      changeLanguage: 'Change Language',
      english: 'English',
      kiswahili: 'Kiswahili',
    }
  },
  sw: {
    translation: {
      // Navigation
      home: 'Nyumbani',
      history: 'Historia',
      conservation: 'Uhifadhi',
      
      // Home Screen
      gallery: 'Picha',
      camera: 'Kamera',
      identify: 'Tambua',
      remove: 'Ondoa',
      predictionResult: 'Matokeo ya Utabiri',
      plant: 'Mmea',
      confidence: 'Uhakika',
      highConfidence: 'Utabiri wa uhakika wa juu',
      moderateConfidence: 'Utabiri wa uhakika wa kati',
      lowConfidence: 'Utabiri wa uhakika wa chini',
      learnMore: 'Jifunze Zaidi',
      reportIssue: 'Ripoti Tatizo',
      chooseImage: 'Chagua picha kutoka kwenye mkusanyiko wako au piga picha ili kuanza.',
      greatNowIdentify: 'Vizuri! Sasa unaweza kutambua picha uliyochagua.',
      plantIdentified: 'Mmea umetambuliwa kama {{plant}} kwa uhakika wa {{confidence}}%.',
      
      // Prediction
      prediction: {
        noImage: {
          title: 'Hakuna Picha Iliyochaguliwa',
          message: 'Tafadhali chagua picha kwanza',
        },
        error: {
          title: 'Hitilafu ya Utabiri',
          message: 'Kushindwa kutambua mmea. Tafadhali jaribu tena.',
        },
        result: {
          title: 'Matokeo ya Utabiri',
          plant: 'Mmea',
          confidence: 'Uhakika',
          highConfidence: 'Utabiri wa uhakika wa juu',
          moderateConfidence: 'Utabiri wa uhakika wa kati',
          lowConfidence: 'Utabiri wa uhakika wa chini',
          learnMore: 'Jifunze Zaidi',
          reportIssue: 'Ripoti Tatizo',
        },
        instructions: {
          chooseImage: 'Chagua picha kutoka kwenye mkusanyiko wako au piga picha ili kuanza.',
          imageSelected: 'Vizuri! Sasa unaweza kutambua picha uliyochagua.',
          plantIdentified: 'Mmea umetambuliwa kama',
          confidence: 'kwa uhakika wa',
        },
      },

      // History Screen
      plantHistory: 'Historia ya Mimea',
      clearAll: 'Futa Yote',
      identification: 'utambuzi',
      identifications: 'utambuzi',
      noHistory: 'Hakuna utambuzi wa mimea bado',
      startIdentifying: 'Anza kutambua mimea ili kuona historia yako hapa',
      loginToView: 'Tafadhali ingia ili kuona historia yako',
      loadingHistory: 'Inapakia historia yako...',
      deleteHistoryItem: 'Futa Kipengee cha Historia',
      deleteConfirm: 'Una uhakika unataka kufuta "{{plantName}}" kutoka kwenye historia yako?',
      clearAllHistory: 'Futa Historia Yote',
      clearAllConfirm: 'Una uhakika unataka kufuta historia yako yote ya utambuzi wa mimea? Kitendo hiki hakiwezi kutendeka upya.',
      
      // Conservation Screen
      conservationHub: 'Kituo cha Uhifadhi',
      sustainableHarvesting: 'Miongozo ya Uvunaji Endelevu',
      traditionalMedicine: 'Vitabu vya Miongozo ya Mimea ya Dawa za Asili za Kiafrika',
      blogs: 'Blogu',
      
      // Authentication
      hello: 'Hujambo! Jiandikishe ili kuanza',
      signUpSubtitle: 'Jiandikishe ili kuanza',
      fullName: 'Jina Kamili',
      email: 'Barua Pepe',
      password: 'Nywila',
      confirmPassword: 'Thibitisha Nywila',
      createAccount: 'Unda Akaunti',
      alreadyHaveAccount: 'Tayari una akaunti? Ingia',
      welcomeBack: 'Karibu tena! Furaha kukuona tena!',
      signIn: 'Ingia',
      dontHaveAccount: 'Huna akaunti? Jiandikishe',
      
      // Error messages
      fill_all_fields: 'Tafadhali jaza sehemu zote',
      passwords_do_not_match: 'Nywila hazilingani',
      password_min_length: 'Nywila lazima iwe na angalau herufi 8',
      signup_failed: 'Kujiandikisha kumeshindwa',
      account_already_exists: 'Akaunti na barua pepe hii tayari ipo',
      signup_error: 'Hitilafu ya Kujiandikisha',
      account_created_successfully: 'Akaunti imeundwa kwa mafanikio',
      hello_register: 'Hujambo! Jiandikishe ili kuanza',
      sign_up_to_get_started: 'Jiandikishe ili kuanza',
      full_name: 'Jina Kamili',
      
      // Blog/Remedy Forms
      shareRemedy: 'Shiriki Dawa',
      title: 'Kichwa',
      plantName: 'Jina la Mmea',
      description: 'Maelezo',
      ingredients: 'Viungo',
      preparationMethod: 'Njia ya Kuandaa',
      usageInstructions: 'Maelekezo ya Matumizi',
      benefits: 'Faida (Si Lazima)',
      cautions: 'Tahadhari (Si Lazima)',
      requiredFields: 'Sehemu zilizo na * ni za lazima',
      
      // Common
      cancel: 'Ghairi',
      delete: 'Futa',
      save: 'Hifadhi',
      share: 'Shiriki',
      upload: 'Pakia',
      download: 'Pakua',
      loading: 'Inapakia...',
      error: 'Hitilafu',
      success: 'Mafanikio',
      yes: 'Ndiyo',
      no: 'Hapana',
      ok: 'Sawa',
      
      // Permissions
      permissions: {
        required: 'Ruhusa Zinahitajika',
        message: 'Samahani, tunahitaji ruhusa za kamera na maktaba ya media ili hii ifanye kazi!',
      },
      
      // Settings
      language: 'Lugha',
      changeLanguage: 'Badilisha Lugha',
      english: 'Kiingereza',
      kiswahili: 'Kiswahili',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLocales()[0]?.languageCode || 'en', // Use device locale or default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

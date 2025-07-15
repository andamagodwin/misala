import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      community: 'Community',
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
      
      // User Types
      user_type: 'User Type',
      normal_user: 'Normal User',
      herbalist: 'Herbalist',
      phone: 'Phone Number',
      location: 'Location',
      bio: 'Bio',
      min_50_chars: 'minimum 50 characters',
      experience_years: 'Years of Experience',
      specializations_placeholder: 'Specializations (comma-separated)',
      herbalist_fields_required: 'Phone, location, and bio are required for herbalists',
      bio_min_length: 'Bio must be at least 50 characters',
      herbalist_verification_note: 'Herbalist Account Verification',
      herbalist_verification_description: 'Your herbalist account will be reviewed by our team. You can use the app normally while verification is pending.',
      
      // User Profile
      verified: 'Verified',
      years_experience: 'years of experience',
      specializations: 'Specializations',
      joined: 'Joined',
      
      // Herbalist Directory
      herbalist_directory: 'Herbalist Directory',
      search_herbalists: 'Search herbalists...',
      all_herbalists: 'All Herbalists',
      verified_only: 'Verified Only',
      filter_by_specialization: 'Filter by Specialization',
      all: 'All',
      loading_herbalists: 'Loading herbalists...',
      no_herbalists_found: 'No herbalists found',
      try_different_search: 'Try a different search term or filter',
      contact_herbalist: 'Contact Herbalist',
      no_phone_available: 'No phone number available',
      
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
      
      // Community Screen
      communityScreen: {
        title: 'Plant Remedies',
        subtitle: 'remedies shared by the community',
        loading: 'Loading remedies...',
        noRemedies: 'No remedies shared yet',
        firstToShare: 'Be the first to share a plant remedy with the community',
        authRequired: 'Authentication Required',
        loginToSubmit: 'Please login to submit a remedy',
        viewMore: 'View More',
        viewLess: 'View Less',
        tapViewMore: '... tap View More to see full details',
        sections: {
          ingredients: 'Ingredients',
          preparationMethod: 'Preparation Method',
          howToUse: 'How to Use',
          benefits: 'Benefits',
          cautions: 'Cautions',
        },
      },

      // Verification
      verify: 'Verify',
      unverify: 'Unverify',
      unverified: 'Unverified',
      verified_by: 'Verified by',
      verify_remedy: 'Verify Remedy',
      unverify_remedy: 'Unverify Remedy',
      are_you_sure_verify: 'Are you sure you want to verify this remedy?',
      are_you_sure_unverify: 'Are you sure you want to unverify this remedy?',
      
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
      
      // History Screen
      historyScreen: {
        identifications_one: 'identification',
        identifications_other: 'identifications',
        loading: 'Loading your history...',
        confidence: 'Confidence',
        highConfidence: 'High Confidence',
        mediumConfidence: 'Medium Confidence',
        lowConfidence: 'Low Confidence',
        emptyState: {
          title: 'No Plant Identifications Yet',
          message: 'Start identifying plants and they will appear here!',
        },
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
      community: 'Jumuiya',
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

      // User Types
      user_type: 'Aina ya Mtumiaji',
      normal_user: 'Mtumiaji wa Kawaida',
      herbalist: 'Mtabibu wa Mimea',
      phone: 'Nambari ya Simu',
      location: 'Mahali',
      bio: 'Wasifu',
      min_50_chars: 'angalau herufi 50',
      experience_years: 'Miaka ya Uzoefu',
      specializations_placeholder: 'Maalum (tenganishwa na mkato)',
      herbalist_fields_required: 'Simu, mahali, na wasifu vinahitajika kwa watabibu wa mimea',
      bio_min_length: 'Wasifu lazima uwe na angalau herufi 50',
      herbalist_verification_note: 'Uthibitishaji wa Akaunti ya Mtabibu wa Mimea',
      herbalist_verification_description: 'Akaunti yako ya mtabibu wa mimea itapitiwa na timu yetu. Unaweza kutumia programu kwa kawaida wakati uthibitishaji unasubiri.',

      // User Profile
      verified: 'Imethibitishwa',
      years_experience: 'miaka ya uzoefu',
      specializations: 'Maalum',
      joined: 'Alijiunga',

      // Herbalist Directory
      herbalist_directory: 'Orodha ya Watabibu wa Mimea',
      search_herbalists: 'Tafuta watabibu wa mimea...',
      all_herbalists: 'Watabibu Wote wa Mimea',
      verified_only: 'Waliothibitishwa Tu',
      filter_by_specialization: 'Chuja kwa Utaalamu',
      all: 'Wote',
      loading_herbalists: 'Inapakia watabibu wa mimea...',
      no_herbalists_found: 'Hakuna watabibu wa mimea waliopatikana',
      try_different_search: 'Jaribu neno lingine la utaftaji au kichujio',
      contact_herbalist: 'Wasiliana na Mtabibu wa Mimea',
      no_phone_available: 'Hakuna nambari ya simu inayopatikana',
      
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
      
      // Community Screen
      communityScreen: {
        title: 'Dawa za Mimea',
        subtitle: 'dawa zilizoshirikiwa na jamii',
        loading: 'Inapakia dawa...',
        noRemedies: 'Hakuna dawa zilizoshirikiwa bado',
        firstToShare: 'Kuwa wa kwanza kushiriki dawa ya mmea na jamii',
        authRequired: 'Uthibitisho Unahitajika',
        loginToSubmit: 'Tafadhali ingia ili kuwasilisha dawa',
        viewMore: 'Ona Zaidi',
        viewLess: 'Ona Kidogo',
        tapViewMore: '... gusa Ona Zaidi ili kuona maelezo kamili',
        sections: {
          ingredients: 'Viungo',
          preparationMethod: 'Njia ya Kuandaa',
          howToUse: 'Jinsi ya Kutumia',
          benefits: 'Faida',
          cautions: 'Tahadhari',
        },
      },

      // Verification
      verify: 'Thibitisha',
      unverify: 'Ondoa Uthibitisho',
      unverified: 'Haijathibitishwa',
      verified_by: 'Imethibitishwa na',
      verify_remedy: 'Thibitisha Dawa',
      unverify_remedy: 'Ondoa Uthibitisho wa Dawa',
      are_you_sure_verify: 'Una uhakika unataka kuthibitisha dawa hii?',
      are_you_sure_unverify: 'Una uhakika unataka kuondoa uthibitisho wa dawa hii?',
      
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
      
      // History Screen
      historyScreen: {
        identifications_one: 'utambuzi',
        identifications_other: 'utambuzi',
        loading: 'Inapakia historia yako...',
        confidence: 'Uhakika',
        highConfidence: 'Uhakika wa Juu',
        mediumConfidence: 'Uhakika wa Kati',
        lowConfidence: 'Uhakika wa Chini',
        emptyState: {
          title: 'Hakuna Utambuzi wa Mimea Bado',
          message: 'Anza kutambua mimea na itaonekana hapa!',
        },
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

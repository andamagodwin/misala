import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

export default function ChatbotScreen() {
  const router = useRouter();
  const [showWebView, setShowWebView] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const openInBrowser = async () => {
    const url = 'https://cdn.botpress.cloud/webchat/v3.0/shareable.html?configUrl=https://files.bpcontent.cloud/2025/07/03/12/20250703121251-4H17SV03.json';
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Unable to open chat in browser');
    }
  };

  // Simplified HTML that should work better
  const simpleHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                height: 100vh; 
                overflow: hidden;
                background: white;
            }
            iframe { 
                width: 100%; 
                height: 100vh; 
                border: none; 
                display: block;
            }
            .error {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            }
        </style>
    </head>
    <body>
        <iframe 
            src="https://cdn.botpress.cloud/webchat/v3.0/shareable.html?configUrl=https://files.bpcontent.cloud/2025/07/03/12/20250703121251-4H17SV03.json"
            title="Plant AI Assistant"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="eager">
        </iframe>
        
        <script>
            // Fallback if iframe fails to load
            setTimeout(() => {
                const iframe = document.querySelector('iframe');
                if (!iframe.contentDocument && !iframe.contentWindow) {
                    document.body.innerHTML = '<div class="error"><h2>🤖</h2><p>Chat loading...</p><p>If this persists, try refreshing the page.</p></div>';
                }
            }, 10000);
        </script>
    </body>
    </html>
  `;

  const FallbackChat = () => (
    <ScrollView className="flex-1 p-4 pt-20">
      <View className="items-center mb-6">
        <View className="bg-primary/10 p-6 rounded-full mb-4">
          <MaterialIcons name="smart-toy" size={48} color="#008000" />
        </View>
        <Text className="text-xl text-gray-800 text-center mb-2" style={{ fontFamily: 'Poppins-Bold' }}>
          Plant AI Assistant
        </Text>
        <Text className="text-gray-600 text-center" style={{ fontFamily: 'Poppins-Regular' }}>
          Chat temporarily unavailable
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        <TouchableOpacity 
          onPress={openInBrowser}
          className="bg-primary p-4 rounded-lg flex-row items-center justify-center"
        >
          <MaterialIcons name="open-in-browser" size={24} color="white" />
          <Text className="text-white ml-2" style={{ fontFamily: 'Poppins-SemiBold' }}>
            Open Chat in Browser
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {
            setHasError(false);
            setShowWebView(true);
          }}
          className="bg-blue-500 p-4 rounded-lg flex-row items-center justify-center"
        >
          <MaterialIcons name="refresh" size={24} color="white" />
          <Text className="text-white ml-2" style={{ fontFamily: 'Poppins-SemiBold' }}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
        <Text className="text-yellow-800 mb-2" style={{ fontFamily: 'Poppins-SemiBold' }}>
          Chat Options:
        </Text>
        <Text className="text-yellow-700 text-sm" style={{ fontFamily: 'Poppins-Regular' }}>
          • Use &quot;Open in Browser&quot; for full chat experience{'\n'}
          • Try refreshing if the chat doesn&apos;t load{'\n'}
          • Check your internet connection
        </Text>
      </View>
    </ScrollView>
  );

  const handleError = () => {
    setHasError(true);
    setShowWebView(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Custom Header */}
      <View className="bg-primary px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleGoBack}
            className="mr-3 p-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-row items-center">
            <MaterialIcons name="smart-toy" size={28} color="white" />
            <Text className="text-white text-xl ml-2" style={{ fontFamily: 'Poppins-Bold' }}>
              Plant AI Assistant
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-green-400 rounded-full mr-2" />
          <Text className="text-white text-sm" style={{ fontFamily: 'Poppins-Medium' }}>
            Online
          </Text>
        </View>
      </View>

      {/* Chat Content */}
      <View className="flex-1">
        {hasError || !showWebView ? (
          <FallbackChat />
        ) : (
          <WebView
            source={{ html: simpleHtml }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onError={handleError}
            onHttpError={handleError}
            renderLoading={() => (
              <View className="flex-1 justify-center items-center bg-white">
                <MaterialIcons name="smart-toy" size={48} color="#008000" />
                <Text className="text-gray-600 mt-4" style={{ fontFamily: 'Poppins-Medium' }}>
                  Loading Plant AI Assistant...
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

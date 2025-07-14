import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

interface TabSwitchProps {
  onTabChange: (tab: "left" | "center" | "right") => void;
  leftLabel?: string;
  centerLabel?: string;
  rightLabel?: string;
}

const TabSwitch = ({ 
  onTabChange, 
  leftLabel = "Sustainable Harvesting Guides",
  centerLabel = "African Traditional Medicinal Plants Guide Books", 
  rightLabel = "Blogs" 
}: TabSwitchProps) => {
  const [activeTab, setActiveTab] = useState<'left' | 'center' | 'right'>('left');
  const position = useState(new Animated.Value(0))[0];

  const handleTabPress = (tab: 'left' | 'center' | 'right') => {
    if (activeTab === tab) return;

    let toValue = 0;
    if (tab === 'center') toValue = 1;
    if (tab === 'right') toValue = 2;

    Animated.spring(position, {
      toValue,
      useNativeDriver: false,
    }).start();

    setActiveTab(tab);
    onTabChange(tab);
  };

  const leftPosition = position.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0%', '33.33%', '66.66%'],
  });

  return (
    <View className="items-center justify-center mb-4">
      <View className="rounded-full bg-white shadow-lg p-2 w-full max-w-[400px]">
        <View className="relative flex-row h-12">
          <Animated.View
            style={{
              position: 'absolute',
              width: '33.33%',
              top: 0,
              height: '100%',
              borderRadius: 27.5,
              backgroundColor: '#008000',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 15,
              elevation: 2,
              left: leftPosition,
            }}
          />
          <TouchableOpacity
            className="flex-1 items-center justify-center z-10 px-2"
            onPress={() => handleTabPress('left')}
          >
            <Text 
              className={`font-bold text-xs text-center ${activeTab === 'left' ? 'text-white' : 'text-[#008000]'}`}
              style={{ fontFamily: 'Poppins-Bold' }}
              numberOfLines={2}
            >
              {leftLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 items-center justify-center z-10 px-2"
            onPress={() => handleTabPress('center')}
          >
            <Text 
              className={`font-bold text-xs text-center ${activeTab === 'center' ? 'text-white' : 'text-[#008000]'}`}
              style={{ fontFamily: 'Poppins-Bold' }}
              numberOfLines={2}
            >
              {centerLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 items-center justify-center z-10 px-2"
            onPress={() => handleTabPress('right')}
          >
            <Text 
              className={`font-bold text-xs text-center ${activeTab === 'right' ? 'text-white' : 'text-[#008000]'}`}
              style={{ fontFamily: 'Poppins-Bold' }}
              numberOfLines={2}
            >
              {rightLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TabSwitch;

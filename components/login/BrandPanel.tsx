import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { Text, View } from 'react-native';

const BrandPanel = () => {
  return (
    <View
      className="w-full md:w-[480px] h-full p-16 flex-col justify-center items-start"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      <View
        className="flex-row items-center flex-none"
        style={{
          width: '100%',
          height: 40,
          gap: 12,
          marginBottom: 48,
        }}
      >
        <View className="w-10 h-10 items-center justify-center">
          <SvgLoader svgFilePath="loginLogo" width={40} height={40} />
        </View>
        <Text
          className="text-white text-[20px] leading-[24px]"
          style={{
            fontFamily: 'Montserrat_700Bold',
            includeFontPadding: false,
            textAlignVertical: 'center',
          }}
        >
          Super Slate
        </Text>
      </View>

      <View
        className="flex-none"
        style={{
          width: 376,
          height: 434,
          padding: 0,
          gap: 16,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 48,
          overflow: 'hidden',
        }}
      >
        <View className="flex-none" style={{ width: 176, height: 176, overflow: 'visible' }}>
          <SvgLoader svgFilePath="loginIcon" width={176} height={176} />
        </View>
        <Text
          style={{
            width: '100%',
            fontFamily: 'Montserrat_700Bold',
            fontSize: 28,
            lineHeight: 36,
            color: '#FFFFFF',
          }}
        >
          Every class, prepared in{'\n'}minutes.
        </Text>
        <Text
          style={{
            width: '100%',
            height: 72,
            fontFamily: 'Inter_400Regular',
            fontSize: 16,
            lineHeight: 24,
            color: '#C8C6BE',
          }}
        >
          Your lessons, quizzes, and checks — ready before the bell, tuned to how your last class actually went.
        </Text>
      </View>

      <View
        className="flex-none justify-center"
        style={{
          width: '100%',
          height: 40,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            lineHeight: 17,
            color: '#E0DEDA',
          }}
        >
          Keshava Reddy International School
        </Text>
      </View>
    </View>
  );
};

export default BrandPanel;

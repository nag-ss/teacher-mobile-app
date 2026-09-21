import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { Text, View } from 'react-native';

const BrandPanel = () => {
  return (
    <View
      className="w-full md:w-[480px] h-full p-16 flex-col justify-center items-start gap-12"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      <View className="flex-row items-center gap-[12px] h-10">
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

      <View className="w-[176px] h-[176px] flex-none self-center" style={{ overflow: 'visible' }}>
        <SvgLoader svgFilePath="loginIcon" width={176} height={176} />
      </View>

      <View className="gap-[16px]">
        <Text
          className="w-full text-[28px] leading-[36px] text-white"
          style={{ fontFamily: 'Montserrat_700Bold' }}
        >
          Every class, prepared in{'\n'}minutes.
        </Text>
        <Text
          className="w-[352px] h-[72px] text-[16px] leading-[24px] text-[#C8C6BE] flex-none self-stretch"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          Your lessons, quizzes, and checks — ready before the bell, tuned to how your last class actually went.
        </Text>
      </View>

      <View className="h-[40px] flex-none justify-center">
        <Text
          className="text-[14px] leading-[17px] text-[#E0DEDA]"
          numberOfLines={1}
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          Keshava Reddy International School
        </Text>
      </View>
    </View>
  );
};

export default BrandPanel;

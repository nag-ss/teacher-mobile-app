import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type ResetPasswordProps = {
  showResetSent: boolean;
  resetEmail: string;
  resetEmailFocused: boolean;
  showResetEmailError: boolean;
  onResetEmailChange: (text: string) => void;
  onFocusEmail: () => void;
  onBlurEmail: () => void;
  onSendResetLink: () => void;
  onBackToSignIn: () => void;
};

const ResetPassword = ({
  showResetSent,
  resetEmail,
  resetEmailFocused,
  showResetEmailError,
  onResetEmailChange,
  onFocusEmail,
  onBlurEmail,
  onSendResetLink,
  onBackToSignIn,
}: ResetPasswordProps) => {
  const canSendReset = resetEmail.trim().length > 0;

  if (showResetSent) {
    return (
      <View>
        <View
          className="flex-row items-center justify-center mb-[32px]"
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#EFFBF5',
            padding: 0,
          }}
        >
          <View className="w-6 h-6 flex-none items-center justify-center">
            <SvgLoader svgFilePath="loginEmail" width={24} height={24} />
          </View>
        </View>

        <View className="gap-[8px] mb-[32px]">
          <Text
            className="w-full text-[24px] leading-[32px] text-[#1A1A1A]"
            style={{ fontFamily: 'Montserrat_700Bold' }}
          >
            Check your email
          </Text>
          <Text
            className="w-full text-[16px] leading-[24px] text-[#6B6960]"
            style={{ fontFamily: 'Inter_400Regular' }}
          >
            We've sent a reset link to {resetEmail.trim()}. It expires in 30 minutes.
          </Text>
        </View>

        <TouchableOpacity
          className="items-center justify-center"
          style={{
            width: 420,
            maxWidth: '100%',
            height: 48,
            borderRadius: 8,
            backgroundColor: '#21C17C',
          }}
          onPress={onBackToSignIn}
          activeOpacity={0.8}
        >
          <Text
            className="h-5 text-[16px] leading-5 text-white"
            style={{ fontFamily: 'Montserrat_600SemiBold' }}
          >
            Back to sign in
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center gap-2 mb-[32px]"
        onPress={onBackToSignIn}
        activeOpacity={0.7}
      >
        <View className="w-[7px] h-[22px] flex-none items-center justify-center">
          <SvgLoader svgFilePath="loginLeftArrow" width={7} height={22} />
        </View>
        <Text
          className="text-[14px] leading-[17px] text-[#6B6960] flex-none"
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          Back to sign in
        </Text>
      </TouchableOpacity>

      <View className="gap-[8px] mb-[32px]">
        <Text
          className="w-full text-[24px] leading-[32px] text-[#1A1A1A]"
          style={{ fontFamily: 'Montserrat_700Bold' }}
        >
          Reset your password
        </Text>
        <Text
          className="w-full text-[16px] leading-[24px] text-[#6B6960]"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          Enter your school email and we'll send you a reset link.
        </Text>
      </View>

      <View className="mb-[24px]">
        <Text
          className="h-[17px] text-[14px] leading-[17px] text-[#6B6960] mb-2"
          style={{ fontFamily: 'Inter_600SemiBold' }}
        >
          Email
        </Text>
        <View
          className="flex-row items-center"
          style={{
            width: 420,
            maxWidth: '100%',
            height: 48,
            borderRadius: 8,
            backgroundColor: showResetEmailError ? '#FDF2F1' : '#FFFFFF',
            borderWidth: 1,
            borderColor: showResetEmailError
              ? '#D65B44'
              : resetEmailFocused
                ? '#21C17C'
                : '#C8C6BE',
            paddingLeft: 16,
            paddingRight: 8,
          }}
        >
          <TextInput
            className="flex-1 text-[16px] leading-[19px] text-[#1A1A1A] p-0"
            style={{
              fontFamily: 'Inter_400Regular',
              color: '#1A1A1A',
              outlineStyle: 'none',
            } as any}
            value={resetEmail}
            placeholder="you@school.edu"
            placeholderTextColor="#A9A7A0"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={onResetEmailChange}
            onFocus={onFocusEmail}
            onBlur={onBlurEmail}
            underlineColorAndroid="transparent"
            selectionColor="#21C17C"
            cursorColor="#21C17C"
          />
        </View>
        {showResetEmailError ? (
          <View className="flex-row items-center mt-2 gap-2 h-6" style={{ width: 420, maxWidth: '100%' }}>
            <View className="w-6 h-6 flex-none items-center justify-center">
              <SvgLoader svgFilePath="loginError" width={24} height={24} />
            </View>
            <Text
              className="text-[14px] leading-[17px] text-[#D65B44] flex-none"
              numberOfLines={1}
              style={{
                fontFamily: 'Inter_400Regular',
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}
            >
              Incorrect email. Please try again.
            </Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        className="items-center justify-center"
        style={{
          width: 420,
          maxWidth: '100%',
          height: 48,
          borderRadius: 8,
          backgroundColor: canSendReset ? '#21C17C' : '#E5E5E5',
        }}
        onPress={onSendResetLink}
        disabled={!canSendReset}
        activeOpacity={0.8}
      >
        <Text
          className={`h-5 text-[16px] leading-5 ${
            canSendReset ? 'text-white' : 'text-[#A9A7A0]'
          }`}
          style={{ fontFamily: 'Montserrat_600SemiBold' }}
        >
          Send reset link
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

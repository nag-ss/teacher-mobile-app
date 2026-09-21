import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const FORM_WIDTH = 384;

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
      <View
        className="flex-col items-start flex-none"
        style={{
          width: FORM_WIDTH,
          height: 260,
          padding: 0,
        }}
      >
        <View style={{ width: FORM_WIDTH, marginBottom: 32 }}>
          <View
            className="flex-row items-center justify-center flex-none"
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#EFFBF5',
              padding: 0,
            }}
          >
            <View className="flex-none" style={{ width: 24, height: 24 }}>
              <SvgLoader svgFilePath="loginEmail" width={24} height={24} />
            </View>
          </View>
        </View>

        <View style={{ width: FORM_WIDTH, gap: 8, marginBottom: 32 }}>
          <Text
            style={{
              width: FORM_WIDTH,
              fontFamily: 'Montserrat_700Bold',
              fontSize: 24,
              lineHeight: 32,
              color: '#1A1A1A',
            }}
          >
            Check your email
          </Text>
          <Text
            style={{
              width: FORM_WIDTH,
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
              lineHeight: 24,
              color: '#6B6960',
            }}
          >
            We've sent a reset link to {resetEmail.trim()}. It expires in 30 minutes.
          </Text>
        </View>

        <View style={{ width: FORM_WIDTH }}>
          <TouchableOpacity
            className="items-center justify-center"
            style={{
              width: FORM_WIDTH,
              height: 48,
              borderRadius: 8,
              backgroundColor: '#21C17C',
            }}
            onPress={onBackToSignIn}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontFamily: 'Montserrat_600SemiBold',
                fontSize: 16,
                lineHeight: 20,
                color: '#FFFFFF',
              }}
            >
              Back to sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-col items-start flex-none"
      style={{
        width: FORM_WIDTH,
        height: 299,
        padding: 0,
      }}
    >
      <View style={{ width: FORM_WIDTH, marginBottom: 32 }}>
        <TouchableOpacity
          className="flex-row items-center"
          style={{ gap: 8 }}
          onPress={onBackToSignIn}
          activeOpacity={0.7}
        >
          <View className="flex-none items-center justify-center" style={{ width: 7, height: 22 }}>
            <SvgLoader svgFilePath="loginLeftArrow" width={7} height={22} />
          </View>
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 14,
              lineHeight: 17,
              color: '#6B6960',
            }}
          >
            Back to sign in
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: FORM_WIDTH, gap: 8, marginBottom: 32 }}>
        <Text
          style={{
            width: FORM_WIDTH,
            fontFamily: 'Montserrat_700Bold',
            fontSize: 24,
            lineHeight: 32,
            color: '#1A1A1A',
          }}
        >
          Reset your password
        </Text>
        <Text
          style={{
            width: FORM_WIDTH,
            fontFamily: 'Inter_400Regular',
            fontSize: 16,
            lineHeight: 24,
            color: '#6B6960',
          }}
        >
          Enter your school email and we'll send you a reset link.
        </Text>
      </View>

      <View style={{ width: FORM_WIDTH, marginBottom: 24 }}>
        <Text
          style={{
            width: FORM_WIDTH,
            height: 17,
            fontFamily: 'Inter_600SemiBold',
            fontSize: 14,
            lineHeight: 17,
            color: '#6B6960',
            marginBottom: 8,
          }}
        >
          Email
        </Text>
        <View
          className="flex-row items-center"
          style={{
            width: FORM_WIDTH,
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
            className="flex-1 p-0"
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
              lineHeight: 19,
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
          <View
            className="flex-row items-center"
            style={{ width: FORM_WIDTH, height: 24, marginTop: 8, gap: 8 }}
          >
            <View className="w-6 h-6 flex-none items-center justify-center">
              <SvgLoader svgFilePath="loginError" width={24} height={24} />
            </View>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                lineHeight: 17,
                color: '#D65B44',
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}
            >
              Incorrect email. Please try again.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={{ width: FORM_WIDTH }}>
        <TouchableOpacity
          className="items-center justify-center"
          style={{
            width: FORM_WIDTH,
            height: 48,
            borderRadius: 8,
            backgroundColor: canSendReset ? '#21C17C' : '#E5E5E5',
          }}
          onPress={onSendResetLink}
          disabled={!canSendReset}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontFamily: 'Montserrat_600SemiBold',
              fontSize: 16,
              lineHeight: 20,
              color: canSendReset ? '#FFFFFF' : '#A9A7A0',
            }}
          >
            Send reset link
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPassword;

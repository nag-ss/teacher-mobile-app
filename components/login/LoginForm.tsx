import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type LoginFormProps = {
  username: string;
  password: string;
  showPassword: boolean;
  keepSignedIn: boolean;
  activeBox: 'email' | 'password' | null;
  showAuthError: boolean;
  loading: boolean;
  onUsernameChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onTogglePassword: () => void;
  onToggleKeepSignedIn: () => void;
  onFocusBox: (box: 'email' | 'password') => void;
  onBlurBox: () => void;
  onLogin: () => void;
  onForgotPassword: () => void;
};

const LoginForm = ({
  username,
  password,
  showPassword,
  keepSignedIn,
  activeBox,
  showAuthError,
  loading,
  onUsernameChange,
  onPasswordChange,
  onTogglePassword,
  onToggleKeepSignedIn,
  onFocusBox,
  onBlurBox,
  onLogin,
  onForgotPassword,
}: LoginFormProps) => {
  const keepForgotBelow =
    showAuthError ||
    activeBox !== null ||
    username.trim().length > 0 ||
    password.length > 0 ||
    keepSignedIn;
  const canSubmit = username.trim().length > 0 && password.length > 0 && !loading;

  return (
    <>
      <View className="gap-[8px] mb-[32px]">
        <Text
          className="w-full text-[24px] leading-[32px] text-[#1A1A1A]"
          style={{ fontFamily: 'Montserrat_700Bold' }}
        >
          Welcome back
        </Text>
        <Text
          className="w-full text-[16px] leading-[24px] text-[#6B6960]"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          Sign in with the email and password provided by your school admin.
        </Text>
      </View>

      <View className={`gap-[24px] ${keepForgotBelow ? '' : 'mb-[24px]'}`}>
        <View>
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
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: activeBox === 'email' ? '#21C17C' : '#C8C6BE',
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
              value={username}
              placeholder="you@school.edu"
              placeholderTextColor="#A9A7A0"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={onUsernameChange}
              onFocus={() => onFocusBox('email')}
              onBlur={onBlurBox}
              underlineColorAndroid="transparent"
              selectionColor="#21C17C"
              cursorColor="#21C17C"
            />
          </View>
        </View>

        <View>
          <Text
            className="h-[17px] text-[14px] leading-[17px] text-[#6B6960] mb-2"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            Password
          </Text>
          <View
            className="flex-row items-center"
            style={{
              width: 420,
              maxWidth: '100%',
              height: 48,
              borderRadius: 8,
              backgroundColor: showAuthError ? '#FDF2F1' : '#FFFFFF',
              borderWidth: 1,
              borderColor: showAuthError
                ? '#D65B44'
                : activeBox === 'password'
                  ? '#21C17C'
                  : '#C8C6BE',
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            <TextInput
              className="flex-1 text-[16px] leading-[19px] text-[#1A1A1A] p-0"
              style={{
                fontFamily: 'Inter_400Regular',
                color: '#1A1A1A',
                outlineStyle: 'none',
              } as any}
              placeholder="••••••••"
              placeholderTextColor="#A9A7A0"
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              onFocus={() => onFocusBox('password')}
              onBlur={onBlurBox}
              underlineColorAndroid="transparent"
              selectionColor="#21C17C"
              cursorColor="#21C17C"
            />
            <TouchableOpacity className="h-12 justify-center" onPress={onTogglePassword}>
              <Text
                className="text-[14px] leading-[17px] text-[#6B6960]"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          {showAuthError ? (
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
                Incorrect email or password. Please try again.
              </Text>
            </View>
          ) : null}
          {keepForgotBelow ? (
            <TouchableOpacity
              className="mt-[24px] items-center self-stretch"
              style={{ marginBottom: 24 }}
              onPress={onForgotPassword}
            >
              <Text
                className="w-full text-[14px] leading-[20px] text-center text-[#6B6960]"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        className="flex-row items-center mb-5"
        onPress={onToggleKeepSignedIn}
        activeOpacity={0.7}
      >
        <View
          className="w-6 h-6 rounded-[6px] border-2 p-0 flex-none items-center justify-center mr-3"
          style={{
            backgroundColor: keepSignedIn ? '#21C17C' : '#FFFFFF',
            borderColor: keepSignedIn ? '#21C17C' : '#C8C6BE',
          }}
        >
          {keepSignedIn ? (
            <Text className="text-white text-xs font-bold">✓</Text>
          ) : null}
        </View>
        <Text
          className="flex-1 text-[14px] leading-[20px] text-[#1A1A1A]"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          Keep me signed in on this device
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center justify-center"
        style={{
          width: 420,
          maxWidth: '100%',
          height: 48,
          borderRadius: 8,
          backgroundColor: canSubmit ? '#21C17C' : '#E5E5E5',
        }}
        onPress={onLogin}
        disabled={!canSubmit}
        activeOpacity={0.8}
      >
        <Text
          className={`h-5 text-[16px] leading-5 ${
            canSubmit ? 'text-white' : 'text-[#A9A7A0]'
          }`}
          style={{ fontFamily: 'Montserrat_600SemiBold' }}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </Text>
      </TouchableOpacity>

      {!keepForgotBelow ? (
        <TouchableOpacity
          className="mt-[24px] items-center self-stretch"
          onPress={onForgotPassword}
        >
          <Text
            className="w-full text-[14px] leading-[20px] text-center text-[#6B6960]"
            style={{ fontFamily: 'Inter_600SemiBold' }}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default LoginForm;

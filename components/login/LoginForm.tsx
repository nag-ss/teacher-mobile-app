import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const FORM_WIDTH = 384;

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
    <View
      className="flex-col items-start flex-none"
      style={{
        width: FORM_WIDTH,
        height: 451,
        padding: 0,
      }}
    >
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
          Welcome back
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
          Sign in with the email and password provided by your school admin.
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
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: activeBox === 'email' ? '#21C17C' : '#C8C6BE',
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

      <View style={{ width: FORM_WIDTH, marginBottom: keepForgotBelow ? 0 : 24 }}>
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
          Password
        </Text>
        <View
          className="flex-row items-center"
          style={{
            width: FORM_WIDTH,
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
            className="flex-1 p-0"
            style={{
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
              lineHeight: 19,
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
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 14,
                lineHeight: 17,
                color: '#6B6960',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        {showAuthError ? (
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
              Incorrect email or password. Please try again.
            </Text>
          </View>
        ) : null}
      </View>

      {keepForgotBelow ? (
        <View style={{ width: FORM_WIDTH, marginTop: 24, marginBottom: 24 }}>
          <TouchableOpacity className="items-center" onPress={onForgotPassword}>
            <Text
              style={{
                width: FORM_WIDTH,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 14,
                lineHeight: 20,
                color: '#6B6960',
                textAlign: 'center',
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={{ width: FORM_WIDTH, marginBottom: 20 }}>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onToggleKeepSignedIn}
          activeOpacity={0.7}
        >
          <View
            className="flex-none items-center justify-center"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              borderWidth: 2,
              marginRight: 12,
              backgroundColor: keepSignedIn ? '#21C17C' : '#FFFFFF',
              borderColor: keepSignedIn ? '#21C17C' : '#C8C6BE',
            }}
          >
            {keepSignedIn ? (
              <Text className="text-white text-xs font-bold">✓</Text>
            ) : null}
          </View>
          <Text
            style={{
              flex: 1,
              fontFamily: 'Inter_400Regular',
              fontSize: 14,
              lineHeight: 20,
              color: '#1A1A1A',
            }}
          >
            Keep me signed in on this device
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: FORM_WIDTH }}>
        <TouchableOpacity
          className="items-center justify-center"
          style={{
            width: FORM_WIDTH,
            height: 48,
            borderRadius: 8,
            backgroundColor: canSubmit ? '#21C17C' : '#E5E5E5',
          }}
          onPress={onLogin}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontFamily: 'Montserrat_600SemiBold',
              fontSize: 16,
              lineHeight: 20,
              color: canSubmit ? '#FFFFFF' : '#A9A7A0',
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Text>
        </TouchableOpacity>
      </View>

      {!keepForgotBelow ? (
        <View style={{ width: FORM_WIDTH, marginTop: 24 }}>
          <TouchableOpacity className="items-center" onPress={onForgotPassword}>
            <Text
              style={{
                width: FORM_WIDTH,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 14,
                lineHeight: 20,
                color: '#6B6960',
                textAlign: 'center',
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default LoginForm;

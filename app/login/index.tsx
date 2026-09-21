import { userDetails, userLogin } from '@/store/authSlice';
import SvgLoader from '@/utils/SvgLoader';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch<any>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [activeBox, setActiveBox] = useState<'email' | 'password' | null>(null);
  const [showAuthError, setShowAuthError] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailFocused, setResetEmailFocused] = useState(false);
  const [showResetEmailError, setShowResetEmailError] = useState(false);
  const [showResetSent, setShowResetSent] = useState(false);
  const { userToken, error, loading } = useSelector((state: any) => state.user);

  const keepForgotBelow =
    showAuthError ||
    activeBox !== null ||
    username.trim().length > 0 ||
    password.length > 0 ||
    keepSignedIn;

  const canSendReset = resetEmail.trim().length > 0;
  const canSubmit = username.trim().length > 0 && password.length > 0 && !loading;

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const sendResetLink = () => {
    if (!canSendReset) return;
    if (!isValidEmail(resetEmail)) {
      setShowResetEmailError(true);
      return;
    }
    setShowResetEmailError(false);
    setShowResetSent(true);
  };

  const backToSignIn = () => {
    setShowResetEmailError(false);
    setShowResetSent(false);
    setShowResetPassword(false);
  };

  const openResetPassword = () => {
    setResetEmail(username);
    setShowResetEmailError(false);
    setShowResetSent(false);
    setShowResetPassword(true);
  };

  const loginAction = async () => {
    if (!canSubmit) return;
    const loginReqObj: any = {
      grant_type: 'password',
      username,
      password,
    };
    await dispatch(userLogin(loginReqObj));
  };

  const getTeacherDetails = async () => {
    await dispatch(userDetails(userToken));
  };

  useEffect(() => {
    if (error) {
      setShowAuthError(true);
    }
  }, [error]);

  useEffect(() => {
    if (userToken) {
      getTeacherDetails();
    }
  }, [userToken]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 flex-col md:flex-row">
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

        <View className="flex-1 flex-row justify-center items-center bg-white p-16">
          <ScrollView
            className="w-full"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View className="w-full max-w-[420px]">
            {showResetSent ? (
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
                  onPress={backToSignIn}
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
            ) : showResetPassword ? (
              <View>
                <TouchableOpacity
                  className="flex-row items-center gap-2 mb-[32px]"
                  onPress={backToSignIn}
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
                      onChangeText={(text) => {
                        setShowResetEmailError(false);
                        setResetEmail(text);
                      }}
                      onFocus={() => setResetEmailFocused(true)}
                      onBlur={() => setResetEmailFocused(false)}
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
                  onPress={sendResetLink}
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
            ) : (
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
                    onChangeText={(text) => {
                      setShowAuthError(false);
                      setUsername(text);
                    }}
                    onFocus={() => setActiveBox('email')}
                    onBlur={() => setActiveBox(null)}
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
                    onChangeText={(text) => {
                      setShowAuthError(false);
                      setPassword(text);
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setActiveBox('password')}
                    onBlur={() => setActiveBox(null)}
                    underlineColorAndroid="transparent"
                    selectionColor="#21C17C"
                    cursorColor="#21C17C"
                  />
                  <TouchableOpacity
                    className="h-12 justify-center"
                    onPress={() => setShowPassword(!showPassword)}
                  >
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
                    onPress={openResetPassword}
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
              onPress={() => setKeepSignedIn(!keepSignedIn)}
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
              onPress={loginAction}
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
                onPress={openResetPassword}
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
            )}
          </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

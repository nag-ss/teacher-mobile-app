import BrandPanel from '@/components/login/BrandPanel';
import LoginForm from '@/components/login/LoginForm';
import ResetPassword from '@/components/login/ResetPassword';
import { clearError, userDetails, userLogin } from '@/store/authSlice';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
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
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setKeepSignedIn(false);
    setActiveBox(null);
    setShowAuthError(false);
    setResetEmail('');
    setResetEmailFocused(false);
    setShowResetEmailError(false);
    setShowResetSent(false);
    setShowResetPassword(false);
    dispatch(clearError());
  };

  const openResetPassword = () => {
    setResetEmail('');
    setResetEmailFocused(false);
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
        <BrandPanel />

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
            <View className="flex-col items-start flex-none">
              {showResetPassword ? (
                <ResetPassword
                  showResetSent={showResetSent}
                  resetEmail={resetEmail}
                  resetEmailFocused={resetEmailFocused}
                  showResetEmailError={showResetEmailError}
                  onResetEmailChange={(text) => {
                    setShowResetEmailError(false);
                    setResetEmail(text);
                  }}
                  onFocusEmail={() => setResetEmailFocused(true)}
                  onBlurEmail={() => setResetEmailFocused(false)}
                  onSendResetLink={sendResetLink}
                  onBackToSignIn={backToSignIn}
                />
              ) : (
                <LoginForm
                  username={username}
                  password={password}
                  showPassword={showPassword}
                  keepSignedIn={keepSignedIn}
                  activeBox={activeBox}
                  showAuthError={showAuthError}
                  loading={loading}
                  onUsernameChange={(text) => {
                    setShowAuthError(false);
                    setUsername(text);
                  }}
                  onPasswordChange={(text) => {
                    setShowAuthError(false);
                    setPassword(text);
                  }}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onToggleKeepSignedIn={() => setKeepSignedIn(!keepSignedIn)}
                  onFocusBox={setActiveBox}
                  onBlurBox={() => setActiveBox(null)}
                  onLogin={loginAction}
                  onForgotPassword={openResetPassword}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

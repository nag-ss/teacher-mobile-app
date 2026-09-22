import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.form}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in with the email and password provided by your school admin.
        </Text>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Email</Text>
        <View
          style={[
            styles.inputBox,
            styles.inputBoxEmail,
            { borderColor: activeBox === 'email' ? '#21C17C' : '#C8C6BE' },
          ]}
        >
          <TextInput
            style={styles.input}
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

      <View style={[styles.fieldBlock, { marginBottom: keepForgotBelow ? 0 : 24 }]}>
        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.inputBox,
            styles.inputBoxPassword,
            {
              backgroundColor: showAuthError ? '#FDF2F1' : '#FFFFFF',
              borderColor: showAuthError
                ? '#D65B44'
                : activeBox === 'password'
                  ? '#21C17C'
                  : '#C8C6BE',
            },
          ]}
        >
          <TextInput
            style={styles.input}
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
          <TouchableOpacity style={styles.showBtn} onPress={onTogglePassword}>
            <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {showAuthError ? (
          <View style={styles.errorRow}>
            <View style={styles.errorIcon}>
              <SvgLoader svgFilePath="loginError" width={24} height={24} />
            </View>
            <Text numberOfLines={1} style={styles.errorText}>
              Incorrect email or password. Please try again.
            </Text>
          </View>
        ) : null}
      </View>

      {keepForgotBelow ? (
        <View style={styles.forgotWrapBelow}>
          <TouchableOpacity style={styles.forgotBtn} onPress={onForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.checkboxWrap}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={onToggleKeepSignedIn}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              keepSignedIn ? styles.checkboxOn : styles.checkboxOff,
            ]}
          >
            {keepSignedIn ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>Keep me signed in on this device</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fullWidth}>
        <TouchableOpacity
          style={[styles.primaryBtn, canSubmit ? styles.primaryBtnOn : styles.primaryBtnOff]}
          onPress={onLogin}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryBtnText, { color: canSubmit ? '#FFFFFF' : '#A9A7A0' }]}>
            {loading ? 'Logging in...' : 'Log in'}
          </Text>
        </TouchableOpacity>
      </View>

      {!keepForgotBelow ? (
        <View style={styles.forgotWrapBottom}>
          <TouchableOpacity style={styles.forgotBtn} onPress={onForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: 384,
    maxWidth: '100%',
    minWidth: 280,
    minHeight: 451,
    padding: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  header: {
    width: '100%',
    gap: 8,
    marginBottom: 32,
  },
  title: {
    width: '100%',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    lineHeight: 32,
    color: '#1A1A1A',
  },
  subtitle: {
    width: '100%',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#6B6960',
  },
  fieldBlock: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    width: '100%',
    height: 17,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#6B6960',
    marginBottom: 8,
  },
  inputBox: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBoxEmail: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  inputBoxPassword: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 19,
    color: '#1A1A1A',
    outlineStyle: 'none',
  } as any,
  showBtn: {
    height: 48,
    justifyContent: 'center',
  },
  showText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#6B6960',
  },
  errorRow: {
    width: '100%',
    height: 24,
    marginTop: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#D65B44',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  forgotWrapBelow: {
    width: '100%',
    marginTop: 24,
    marginBottom: 24,
  },
  forgotWrapBottom: {
    width: '100%',
    marginTop: 24,
  },
  forgotBtn: {
    alignItems: 'center',
  },
  forgotText: {
    width: '100%',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: '#6B6960',
    textAlign: 'center',
  },
  checkboxWrap: {
    width: '100%',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: '#21C17C',
    borderColor: '#21C17C',
  },
  checkboxOff: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C8C6BE',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1A1A',
  },
  fullWidth: {
    width: '100%',
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnOn: {
    backgroundColor: '#21C17C',
  },
  primaryBtnOff: {
    backgroundColor: '#E5E5E5',
  },
  primaryBtnText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    lineHeight: 20,
  },
});

export default LoginForm;

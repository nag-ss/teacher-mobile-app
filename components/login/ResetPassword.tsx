import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
      <View style={styles.confirmBox}>
        <View style={styles.block32}>
          <View style={styles.emailCircle}>
            <View style={styles.emailIcon}>
              <SvgLoader svgFilePath="loginEmail" width={24} height={24} />
            </View>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We've sent a reset link to {resetEmail.trim()}. It expires in 30 minutes.
          </Text>
        </View>

        <View style={styles.fullWidth}>
          <TouchableOpacity
            style={[styles.primaryBtn, styles.primaryBtnOn]}
            onPress={onBackToSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnTextOn}>Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.resetBox}>
      <View style={styles.block32}>
        <TouchableOpacity style={styles.backRow} onPress={onBackToSignIn} activeOpacity={0.7}>
          <View style={styles.backArrow}>
            <SvgLoader svgFilePath="loginLeftArrow" width={7} height={22} />
          </View>
          <Text style={styles.backText}>Back to sign in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          Enter your school email and we'll send you a reset link.
        </Text>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Email</Text>
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: showResetEmailError ? '#FDF2F1' : '#FFFFFF',
              borderColor: showResetEmailError
                ? '#D65B44'
                : resetEmailFocused
                  ? '#21C17C'
                  : '#C8C6BE',
            },
          ]}
        >
          <TextInput
            style={styles.input}
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
          <View style={styles.errorRow}>
            <View style={styles.errorIcon}>
              <SvgLoader svgFilePath="loginError" width={24} height={24} />
            </View>
            <Text numberOfLines={1} style={styles.errorText}>
              Incorrect email. Please try again.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.fullWidth}>
        <TouchableOpacity
          style={[styles.primaryBtn, canSendReset ? styles.primaryBtnOn : styles.primaryBtnOff]}
          onPress={onSendResetLink}
          disabled={!canSendReset}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryBtnText, { color: canSendReset ? '#FFFFFF' : '#A9A7A0' }]}>
            Send reset link
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resetBox: {
    width: 384,
    maxWidth: '100%',
    minWidth: 280,
    minHeight: 299,
    padding: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  confirmBox: {
    width: 384,
    maxWidth: '100%',
    minWidth: 280,
    minHeight: 260,
    padding: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  block32: {
    width: '100%',
    marginBottom: 32,
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backArrow: {
    width: 7,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#6B6960',
  },
  emailCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFFBF5',
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailIcon: {
    width: 24,
    height: 24,
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
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
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
  primaryBtnTextOn: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
});

export default ResetPassword;

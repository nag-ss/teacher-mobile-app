import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  onRetry?: () => void;
  /** No extra padding — for cards that already match live-card height. */
  compact?: boolean;
};

const CouldNotLoadState = ({ onRetry, compact }: Props) => {
  return (
    <View style={[styles.root, compact && styles.rootCompact]}>
      <Text style={styles.title}>Couldn't load this</Text>
      <Text style={styles.subtitle}>Check your connection and try again.</Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText} numberOfLines={1}>
          Try again
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  rootCompact: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  title: {
    width: 136,
    height: 24,
    fontSize: 16,
    lineHeight: 24,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    textAlign: 'center',
  },
  subtitle: {
    width: 248,
    height: 20,
    fontSize: 14,
    lineHeight: 20,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
    minWidth: 97,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECEAE4',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  buttonPressed: {
    backgroundColor: '#F1EFEA',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    textAlign: 'center',
    flexShrink: 0,
  },
});

export default CouldNotLoadState;

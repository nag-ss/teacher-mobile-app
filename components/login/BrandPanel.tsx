import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BrandPanelProps = {
  compact?: boolean;
  panelWidth?: number;
  artHeight?: number;
  iconSize?: number;
  padding?: number;
  sectionGap?: number;
  headlineSize?: number;
  bodySize?: number;
};

const BrandPanel = ({
  compact = false,
  panelWidth = 480,
  artHeight = 434,
  iconSize = 176,
  padding = 64,
  sectionGap = 48,
  headlineSize = 28,
  bodySize = 16,
}: BrandPanelProps) => {
  if (compact) {
    return (
      <View
        style={[
          styles.compactPanel,
          { paddingHorizontal: padding, paddingVertical: 24 },
        ]}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <SvgLoader svgFilePath="loginLogo" width={40} height={40} />
          </View>
          <Text style={styles.logoText}>Super Slate</Text>
        </View>
        <Text style={styles.compactTagline}>
          Every class, prepared in minutes.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.panel, { width: panelWidth, padding }]}>
      <View style={[styles.logoRow, { marginBottom: sectionGap }]}>
        <View style={styles.logoIcon}>
          <SvgLoader svgFilePath="loginLogo" width={40} height={40} />
        </View>
        <Text style={styles.logoText}>Super Slate</Text>
      </View>

      <View
        style={[
          styles.middle,
          { height: artHeight, minHeight: artHeight, marginBottom: sectionGap },
        ]}
      >
        <View style={[styles.illustration, { width: iconSize, height: iconSize }]}>
          <SvgLoader
            svgFilePath="loginIcon"
            width={iconSize}
            height={iconSize}
          />
        </View>
        <Text
          style={[
            styles.headline,
            { fontSize: headlineSize, lineHeight: headlineSize + 8 },
          ]}
        >
          Every class, prepared in minutes.
        </Text>
        <Text
          style={[
            styles.body,
            { fontSize: bodySize, lineHeight: bodySize + 8 },
          ]}
        >
          Your lessons, quizzes, and checks — ready before the bell, tuned to
          how your last class actually went.
        </Text>
      </View>

      <View style={styles.schoolRow}>
        <Text numberOfLines={1} style={styles.school}>
          Keshava Reddy International School
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    minWidth: 280,
    flexGrow: 0,
    flexShrink: 1,
    height: '100%',
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  compactPanel: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    gap: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  compactTagline: {
    width: '100%',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#C8C6BE',
  },
  middle: {
    width: '100%',
    maxWidth: 376,
    padding: 0,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  illustration: {
    overflow: 'visible',
  },
  headline: {
    width: '100%',
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
  },
  body: {
    width: '100%',
    minHeight: 72,
    fontFamily: 'Inter_400Regular',
    color: '#C8C6BE',
  },
  schoolRow: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  school: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#E0DEDA',
  },
});

export default BrandPanel;

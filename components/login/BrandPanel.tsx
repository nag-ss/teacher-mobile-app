import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BrandPanelProps = {
  panelWidth?: number;
  artHeight?: number;
  padding?: number;
  sectionGap?: number;
};

const BrandPanel = ({
  panelWidth = 480,
  artHeight = 434,
  padding = 64,
  sectionGap = 48,
}: BrandPanelProps) => {
  return (
    <View style={[styles.panel, { width: panelWidth, padding }]}>
      <View style={[styles.logoRow, { marginBottom: sectionGap }]}>
        <View style={styles.logoIcon}>
          <SvgLoader svgFilePath="loginLogo" width={40} height={40} />
        </View>
        <Text style={styles.logoText}>Super Slate</Text>
      </View>

      <View style={[styles.middle, { height: artHeight, minHeight: artHeight, marginBottom: sectionGap }]}>
        <View style={styles.illustration}>
          <SvgLoader svgFilePath="loginIcon" width={176} height={176} />
        </View>
        <Text style={styles.headline}>Every class, prepared in minutes.</Text>
        <Text style={styles.body}>
          Your lessons, quizzes, and checks — ready before the bell, tuned to how your last class actually went.
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
    width: 480,
    minWidth: 320,
    flexGrow: 0,
    flexShrink: 1,
    height: '100%',
    padding: 64,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    width: 176,
    height: 176,
    overflow: 'visible',
  },
  headline: {
    width: '100%',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: '#FFFFFF',
  },
  body: {
    width: '100%',
    minHeight: 72,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
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

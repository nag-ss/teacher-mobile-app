import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BrandPanelProps = {
  isSplit?: boolean;
};

const BrandPanel = ({ isSplit = false }: BrandPanelProps) => {
  return (
    <View style={[styles.panel, isSplit ? styles.panelSplit : styles.panelStacked]}>
      <View style={styles.logoRow}>
        <View style={styles.logoIcon}>
          <SvgLoader svgFilePath="loginLogo" width={40} height={40} />
        </View>
        <Text style={styles.logoText}>Super Slate</Text>
      </View>

      <View style={styles.middle}>
        <View style={styles.illustration}>
          <SvgLoader svgFilePath="loginIcon" width={176} height={176} />
        </View>
        <Text style={styles.headline}>Every class, prepared in{'\n'}minutes.</Text>
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
    height: '100%',
    padding: 64,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  panelSplit: {
    width: 480,
  },
  panelStacked: {
    width: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    gap: 12,
    marginBottom: 48,
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
    width: 376,
    height: 434,
    padding: 0,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
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
    height: 72,
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

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface KeyHighlightCardProps {
  title: string;
  value: string;
  description: string;
  icon?: any;
  circularProgress?: {
    percent: number;
  };
  progress?: {
    current: number;
    total: number;
  };
}

const KeyHighlightCard = ({
  title,
  value,
  description,
  icon,
  circularProgress,
  progress,
}: KeyHighlightCardProps) => {
  const circlePct = circularProgress ? Math.max(0, Math.min(100, circularProgress.percent)) : 0;
  const progressPct =
    progress && progress.total > 0 ? Math.max(0, Math.min(1, progress.current / progress.total)) : 0;

  const ringSize = 44;
  const ringStroke = 6;
  const ringStrokeTrack = 3;
  const ringRadius = (ringSize - Math.max(ringStroke, ringStrokeTrack)) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - circlePct / 100);

  return (
    <View style={styles.khCard}>
      <View style={styles.khBody}>
        <Text style={styles.khTitle} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.khDesc}>{description}</Text>
      </View>
      <View style={[styles.khValueSlot, progress ? styles.khValueSlotBar : null]}>
        {circularProgress ? (
          <View style={styles.khRingWrap}>
            <Svg width={ringSize} height={ringSize}>
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                stroke="#D1D5DB"
                strokeWidth={ringStrokeTrack}
                fill="none"
              />
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={ringRadius}
                stroke="#10B981"
                strokeWidth={ringStroke}
                fill="none"
                strokeDasharray={`${ringCircumference} ${ringCircumference}`}
                strokeDashoffset={ringDashOffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
              />
            </Svg>
            <View style={styles.khRingCenter}>
              <Text style={styles.khRingLabel}>{`${Math.round(circlePct)}%`}</Text>
            </View>
          </View>
        ) : progress ? (
          <View style={styles.khBarWrap}>
            <View style={styles.khBarTrack}>
              <View style={[styles.khBarFill, { width: `${progressPct * 100}%` }]} />
            </View>
            <Text style={styles.khBarCaption}>{`${progress.current}/${progress.total}`}</Text>
          </View>
        ) : icon ? (
          <Image source={icon} style={styles.khIcon} resizeMode="contain" />
        ) : (
          <Text style={styles.khPlainValue}>{value}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  khCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    minWidth: 200,
    margin: 6,
  },
  khIcon: { width: 28, height: 28 },
  khTitle: { fontFamily: 'Montserrat_500Medium', fontSize: 12, marginBottom: 4 },
  khPlainValue: { fontSize: 18, fontWeight: 'bold', color: '#228B22' },
  khDesc: { fontFamily: 'Roboto_400Regular', fontSize: 8, color: '#555' },
  khValueSlot: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  khValueSlotBar: {
    alignItems: 'flex-end',
  },
  khBody: {
    flex: 0.8,
    paddingRight: 12,
  },
  khBarWrap: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
  },
  khBarTrack: {
    width: 55,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: 2,
  },
  khBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  khBarCaption: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 8,
    color: '#111827',
    width: 55,
    textAlign: 'left',
  },
  khRingWrap: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  khRingCenter: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  khRingLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 8,
    color: '#111827',
    textAlign: 'center',
  },
});

export default KeyHighlightCard;

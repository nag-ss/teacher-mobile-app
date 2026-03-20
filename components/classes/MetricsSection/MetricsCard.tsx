import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface MetricsCardProps {
  title: string;
  value: string;
  description: string;
  icon?: any;
  circularProgress?: {
    percent: number; // 0-100
  };
  progress?: {
    current: number;
    total: number;
  };
}

const MetricsCard = ({ title, value, description, icon, circularProgress, progress }: MetricsCardProps) => {
  const circlePct =
    circularProgress ? Math.max(0, Math.min(100, circularProgress.percent)) : 0;
  const progressPct =
    progress && progress.total > 0
      ? Math.max(0, Math.min(1, progress.current / progress.total))
      : 0;

  const ringSize = 44;
  const ringStroke = 6; // green stroke
  const ringStrokeTrack = 3; // gray track stroke
  const ringRadius = (ringSize - Math.max(ringStroke, ringStrokeTrack)) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference * (1 - circlePct / 100);
  return (
    <View style={styles.card}>
        <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={styles.desc}>{description}</Text>
        </View>
        <View
          style={[
            styles.contentValue,
            progress ? styles.contentValueProgress : null,
          ]}
        >
            {circularProgress ? (
              <View style={styles.ringWrap}>
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
                <View style={styles.ringCenter}>
                  <Text style={styles.ringText}>{`${Math.round(circlePct)}%`}</Text>
                </View>
              </View>
            ) : progress ? (
              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
                </View>
                <Text style={styles.progressLabel}>{`${progress.current}/${progress.total}`}</Text>
              </View>
            ) : icon ? (
              <Image source={icon} style={styles.metricIcon} resizeMode="contain" />
            ) : (
              <Text style={styles.value}>{value}</Text>
            )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    minWidth: 200,
    // maxWidth: 200,
    margin: 6,
    // width: 200
  },
  icon: { width: 24, height: 24, marginBottom: 6 },
  metricIcon: { width: 28, height: 28 },
  title: { fontFamily: 'Montserrat_500Medium', fontSize: 12, marginBottom: 4 },
  value: { fontSize: 18, fontWeight: 'bold', color: '#228B22' },
  desc: { fontFamily: 'Roboto_400Regular', fontSize: 8, color: '#555' },
  contentValue: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentValueProgress: {
    alignItems: 'flex-end',
  },
  content: {
    flex: 0.8,
    paddingRight: 12,
  },
  progressWrap: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
  },
  progressTrack: {
    width: 55,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 8,
    color: '#111827',
    width: 55,
    textAlign: 'left',
  },
  ringWrap: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCenter: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 8,
    color: '#111827',
    textAlign: 'center',
  },
});

export default MetricsCard;

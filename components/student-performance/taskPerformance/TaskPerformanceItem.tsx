import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type TaskPerformanceStatus = 'Submitted' | 'Graded' | 'Pending';

export type TaskPerformanceTrend = 'up' | 'down' | 'flat' | 'na';

export type TaskPerformanceItem = {
  id: string;
  title: string;
  taskType: string;
  dueDate: string;
  score: string;
  scoreTrend: TaskPerformanceTrend;
  classAverage: string;
  status: TaskPerformanceStatus;
};

type Props = {
  item: TaskPerformanceItem;
};

const TaskPerformanceItemRow = ({ item }: Props) => {
  const statusStyle = useMemo(() => {
    if (item.status === 'Pending') return { pill: styles.tpCapsulePending, text: styles.tpCapsulePendingInk };
    return { pill: styles.tpCapsuleSubmitted, text: styles.tpCapsuleSubmittedInk };
  }, [item.status]);

  return (
    <View style={styles.tpRow}>
      <Text style={[styles.tpBaseText, styles.tpFlexSerial, styles.tpSerialTypography]}>{item.id}</Text>
      <Text style={[styles.tpBaseText, styles.tpFlexAssignment, styles.tpAssignmentTypography]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.tpBaseText, styles.tpFlexType, styles.tpTypeTypography]} numberOfLines={1}>
        {item.taskType}
      </Text>
      <Text style={[styles.tpBaseText, styles.tpFlexDueDate, styles.tpDueTypography]} numberOfLines={1}>
        {item.dueDate}
      </Text>
      <View style={styles.tpFlexScore}>
        <View style={styles.tpScoreWrap}>
          {item.scoreTrend === 'up' ? (
            <Image source={require('@/assets/images/arrow_circle_up.png')} style={styles.tpScoreTrendIcon} />
          ) : item.scoreTrend === 'down' ? (
            <Image source={require('@/assets/images/arrow_circle_down.png')} style={styles.tpScoreTrendIcon} />
          ) : item.scoreTrend === 'flat' ? (
            <Image source={require('@/assets/images/do_not_disturb_on.png')} style={styles.tpScoreTrendIcon} />
          ) : (
            <Image source={require('@/assets/images/close.png')} style={styles.tpScoreNaIcon} />
          )}
          <Text style={[styles.tpBaseText, styles.tpScoreTypography]} numberOfLines={1}>
            {item.score}
          </Text>
        </View>
      </View>
      <Text style={[styles.tpBaseText, styles.tpFlexClassAvg, styles.tpClassAvgTypography]} numberOfLines={1}>
        {item.classAverage}
      </Text>
      <View style={[styles.tpFlexStatus, styles.tpStatusColumn]}>
        <View style={[styles.tpStatusCapsule, statusStyle.pill]}>
          <Text style={[styles.tpStatusCapsuleLabel, statusStyle.text]} numberOfLines={1}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={[styles.tpFlexAction, styles.tpActionsRow]}>
        <View style={styles.tpIconButton}>
          <Image source={require('@/assets/images/sms.png')} style={styles.tpSmsImage} />
        </View>
        <View style={styles.tpIconButton}>
          <MaterialIcons name="chevron-right" size={16} color="#111827" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  tpBaseText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#111827',
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  tpFlexSerial: { flex: 0.55, textAlign: 'center', paddingLeft: 0 },
  tpFlexAssignment: { flex: 1.35, textAlign: 'center' },
  tpFlexType: { flex: 0.7, textAlign: 'center' },
  tpFlexDueDate: { flex: 0.75, textAlign: 'center' },
  tpFlexScore: { flex: 0.85, textAlign: 'center', justifyContent: 'center' },
  tpFlexClassAvg: { flex: 0.75, textAlign: 'center' },
  tpFlexStatus: { flex: 1.0, paddingRight: 12 },
  tpFlexAction: { flex: 0.65 },
  tpSerialTypography: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
  },
  tpAssignmentTypography: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
  },
  tpTypeTypography: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
  },
  tpDueTypography: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
  },
  tpScoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tpScoreTrendIcon: {
    width: 12,
    height: 12,
  },
  tpScoreNaIcon: {
    width: 8,
    height: 8,
  },
  tpScoreTypography: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
    paddingHorizontal: 0,
  },
  tpClassAvgTypography: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
  },
  tpStatusColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tpStatusCapsule: {
    minWidth: 76,
    maxWidth: '100%',
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tpStatusCapsuleLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 9,
  },
  tpCapsuleSubmitted: {
    backgroundColor: '#19B56B',
  },
  tpCapsuleSubmittedInk: {
    color: '#0B2F1D',
  },
  tpCapsulePending: {
    backgroundColor: '#FDE2E2',
  },
  tpCapsulePendingInk: {
    color: '#7C2D12',
  },
  tpActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingRight: 0,
  },
  tpIconButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tpSmsImage: {
    width: 12,
    height: 12,
    tintColor: '#111827',
  },
});

export default TaskPerformanceItemRow;

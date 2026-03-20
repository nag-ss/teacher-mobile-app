import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type StudentItem = {
  id: string;
  name: string;
  grade: string;
  progress: string;
  attendance: string;
  engagement: string;
  quiz: string;
};

type Props = {
  item: StudentItem;
};

const StudentTableRow = ({ item }: Props) => {
  const trimmed = (item.progress ?? '').trim();
  const progressValue = Number.parseInt(trimmed.replace('%', ''), 10);
  const isPositiveProgress = Number.isFinite(progressValue) && progressValue > 0;
  const isNegativeProgress = Number.isFinite(progressValue) && progressValue < 0;
  const isZeroProgress = Number.isFinite(progressValue) && progressValue === 0;

  return (
    <View style={styles.dataRow}>
      <Text style={[styles.cell, styles.colRn, styles.rnNumber]}>{item.id}</Text>
      <Text style={[styles.cell, styles.colName, styles.nameCell]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.cell, styles.colGrade, styles.gradeCell]} numberOfLines={1}>
        {item.grade}
      </Text>
      <View style={styles.colProgress}>
        <View style={styles.progressWrap}>
          {isPositiveProgress ? (
            <Image source={require('@/assets/images/arrow_circle_up.png')} style={styles.progressIcon} />
          ) : isNegativeProgress ? (
            <Image source={require('@/assets/images/arrow_circle_down.png')} style={styles.progressIcon} />
          ) : isZeroProgress ? (
            <Image source={require('@/assets/images/do_not_disturb_on.png')} style={styles.progressIcon} />
          ) : null}
          <Text style={[styles.cell, styles.progressCell]}>{trimmed}</Text>
        </View>
      </View>
      <Text style={[styles.cell, styles.colAttendance, styles.attendanceCell]}>{item.attendance}</Text>
      <Text style={[styles.cell, styles.colEngagement, styles.engagementCell]}>{item.engagement}</Text>
      <Text style={[styles.cell, styles.colQuiz, styles.quizCell]}>{item.quiz}</Text>
      <View style={[styles.colAction, styles.actionCell]}>
        <View style={styles.actionIconCircle}>
          <Image source={require('@/assets/images/sms.png')} style={styles.smsIcon} />
        </View>
        <View style={styles.actionIconCircle}>
          <MaterialIcons name="chevron-right" size={16} color="#111827" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colRn: { flex: 0.6, textAlign: 'center' },
  colName: { flex: 1.6, textAlign: 'center' },
  colGrade: { flex: 1.2, textAlign: 'center' },
  colProgress: { flex: 1.0, textAlign: 'center' },
  colAttendance: { flex: 1.0, textAlign: 'center' },
  colEngagement: { flex: 1.0, textAlign: 'center' },
  colQuiz: { flex: 1.0, textAlign: 'center' },
  colAction: { flex: 0.7, textAlign: 'center' },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  cell: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#111827',
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  nameCell: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
  },
  gradeCell: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
  },
  progressCell: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  progressIcon: {
    width: 12,
    height: 12,
  },
  attendanceCell: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
  },
  engagementCell: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
  },
  quizCell: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
  },
  actionCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smsIcon: {
    width: 12,
    height: 12,
  },
  rnNumber: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
  },
});

export default StudentTableRow;


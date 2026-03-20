import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type AssignmentStatus = 'Closed' | 'In Progress' | 'Low Participation';

export type AssignmentItem = {
  id: string;
  title: string;
  dueDate: string;
  stats: string;
  status: AssignmentStatus;
};

type Props = {
  item: AssignmentItem;
};

const AssignmentItem = ({ item }: Props) => {
  const s = useMemo(() => {
    if (item.status === 'Closed') return { pill: styles.pillClosed, text: styles.pillTextClosed };
    if (item.status === 'Low Participation') return { pill: styles.pillLow, text: styles.pillTextLow };
    return { pill: styles.pillInProgress, text: styles.pillTextInProgress };
  }, [item.status]);

  return (
    <View style={styles.dataRow}>
      <Text style={[styles.cell, styles.colSno, styles.snoCell]}>{item.id}</Text>
      <Text style={[styles.cell, styles.colTitle, styles.titleCell]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.cell, styles.colDue, styles.dueCell]}>{item.dueDate}</Text>
      <Text style={[styles.cell, styles.colStats, styles.statsCell]}>{item.stats}</Text>
      <View style={[styles.colStatus, styles.statusCell]}>
        <View style={[styles.statusPill, s.pill]}>
          <Text style={[styles.statusText, s.text]} numberOfLines={1}>
            {item.status}
          </Text>
        </View>
      </View>
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
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  cell: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#111827',
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  colSno: { flex: 0.6, textAlign: 'center' },
  colTitle: { flex: 1.7, textAlign: 'center' },
  colDue: { flex: 0.9, textAlign: 'center' },
  colStats: { flex: 1.0, textAlign: 'center' },
  colStatus: { flex: 1.0 },
  colAction: { flex: 0.7 },
  titleCell: {
    fontFamily: 'Montserrat_600SemiBold',
  },
  dueCell: {
    fontFamily: 'Roboto_400Regular',
  },
  snoCell: {
    fontFamily: 'Montserrat_400Regular',
  },
  statsCell: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
  },
  statusCell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  statusPill: {
    minWidth: 104,
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
  },
  pillClosed: {
    backgroundColor: '#19B56B',
  },
  pillTextClosed: {
    color: '#0B2F1D',
  },
  pillInProgress: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#9FD5C2',
  },
  pillTextInProgress: {
    color: '#111827',
  },
  pillLow: {
    backgroundColor: '#FDE2E2',
  },
  pillTextLow: {
    color: '#7C2D12',
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingRight: 0,
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
    tintColor: '#111827',
  },
});

export default AssignmentItem;


import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import LiveClassCard from '@/components/dashboard/LiveClassCard';
import Timeline from '@/components/dashboard/Timeline';
import ClassProgress from '@/components/dashboard/ClassProgress';
import ImportantAlerts from '@/components/dashboard/ImportantAlerts';
import UpcomingTopics from '@/components/dashboard/UpcomingTopics';
import { useSelector } from 'react-redux';
import PerformanceSummary from '@/components/dashboard/PerformanceSummary';
import TeacherTodos from '@/components/dashboard/Todos';
import { MaterialIcons } from '@expo/vector-icons';
import SvgLoader from '@/utils/SvgLoader';

const DAY_LABELS = ['Yesterday', 'Today', 'Tomorrow'] as const;

const DashboardScreen = () => {
  const { user } = useSelector((state: any) => state.user);
  const [expanded, setExpanded] = useState(false);
  const [dayIndex, setDayIndex] = useState(1); // Today
  const hasNotifications = false;
  const actions = [
    { label: 'Upload Materials', icon: 'file-upload' },
    { label: 'Assignment Generator', icon: 'assignment' },
    { label: 'Auto Test Generator', icon: 'quiz' },
  ];
  const dayLabel = DAY_LABELS[dayIndex];

  return (
    <SafeAreaView style={{ marginLeft: 13.7, height: '100%', marginTop: 13.7 }}>
      <View style={styles.headerContainer}>
        <View style={styles.headerActions}>
          <View style={styles.dayPill}>
            <TouchableOpacity
              style={styles.dayArrow}
              onPress={() => setDayIndex((prev) => Math.max(0, prev - 1))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <SvgLoader svgFilePath="notificationLeftArrow" width={7} height={10} />
            </TouchableOpacity>
            <View style={styles.dayLabelBox}>
              <Text style={styles.dayLabel}>{dayLabel}</Text>
            </View>
            <TouchableOpacity
              style={styles.dayArrow}
              onPress={() => setDayIndex((prev) => Math.min(2, prev + 1))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <SvgLoader svgFilePath="notificationRightArrow" width={7} height={10} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <View style={styles.notificationIconBox}>
              <SvgLoader
                svgFilePath={hasNotifications ? 'notificationActive' : 'notificationInactive'}
                width={20}
                height={20}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.leftColumn}>
            <View style={styles.liveCardContainer}>
              <View style={styles.teacherNameSection}>
                <Text style={styles.title}>Welcome {`${user.first_name} ${user.last_name}`}</Text>
                <Text style={styles.subTitle}>
                  Welcome back! Let’s make today a meaningful day of learning.
                </Text>
              </View>

              <LiveClassCard />
            </View>

            <Timeline />
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.classProgressContainer}>
              <ClassProgress />
              <UpcomingTopics />
            </View>

            <PerformanceSummary />
            <TeacherTodos />
            <ImportantAlerts />
          </View>
        </View>
        <View style={styles.actionsContainer}>
          {expanded &&
            actions.map((action: any) => (
              <View key={action.label} style={styles.menuRow}>
                <View style={styles.menuCard}>
                  <Text style={styles.menuLabel}>{action.label}</Text>
                </View>
                <View style={styles.menuIcon}>
                  <MaterialIcons name={action.icon} size={24} color="#444" />
                </View>
              </View>
            ))}
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.7}
            onPress={() => setExpanded(!expanded)}
          >
            <MaterialIcons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '95%',
  },
  container: {
    flexDirection: 'row',
    marginTop: 13.7,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 40,
    marginRight: 13.7,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: 252,
    padding: 0,
    gap: 8,
    flexGrow: 0,
    flexShrink: 0,
  },
  dayPill: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 12,
    flexGrow: 1,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOpacity: 0.0196078,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  dayArrow: {
    width: 16,
    height: 16,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  dayLabelBox: {
    height: 20,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 14,
    lineHeight: 17,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    textAlign: 'center',
  },
  notificationButton: {
    width: 44,
    height: 44,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 12,
    flexGrow: 0,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOpacity: 0.0196078,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  notificationIconBox: {
    width: 20,
    height: 20,
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftColumn: {
    width: 450.28,
    marginRight: 13.7,
  },
  rightColumn: {
    width: 270,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  liveCardContainer: {
    backgroundColor: '#fff',
    padding: 18.28,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subTitle: {
    marginTop: 9.14,
  },
  teacherNameSection: {
    marginBottom: 9.14,
  },
  classProgressContainer: {
    backgroundColor: '#fff',
    padding: 13.7,
    borderRadius: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    marginBottom: 5,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 30,
    right: 100,
    alignItems: 'flex-end',
    zIndex: 99,
  },
  fab: {
    backgroundColor: '#20C997',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  menuCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginRight: 10,
  },
  menuLabel: {
    fontSize: 15,
    color: '#222',
  },
  menuIcon: {
    backgroundColor: '#fff',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
});

export default DashboardScreen;

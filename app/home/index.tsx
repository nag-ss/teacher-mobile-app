import React, { useCallback, useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import LiveClassCard from '@/components/dashboard/LiveClassCard';
import Timeline from '@/components/dashboard/Timeline';
import HomeSidePanels from '@/components/dashboard/HomeSidePanels';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getScheduleClasses } from '@/store/classSlice';
import SvgLoader from '@/utils/SvgLoader';
import moment from 'moment';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const DAY_LABELS = ['Yesterday', 'Today', 'Tomorrow'] as const;

const DashboardScreen = () => {
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: any) => state.user);
  const [dayIndex, setDayIndex] = useState(1); // Today
  const hasNotifications = false;
  const dayLabel = DAY_LABELS[dayIndex];
  const greetingName = user?.first_name || 'Teacher';
  // dayIndex 0/1/2 → yesterday / today / tomorrow
  const selectedDate = moment().add(dayIndex - 1, 'days').format('YYYY-MM-DD');
  const dateLabel = moment(selectedDate).format('dddd, D MMMM');

  // Prefetch the day-pill window into scheduleByDate so switches are instant.
  useFocusEffect(
    useCallback(() => {
      [-1, 0, 1].forEach((offset) => {
        const date = moment().add(offset, 'days').format('YYYY-MM-DD');
        dispatch(getScheduleClasses({ date } as any));
      });
    }, [dispatch])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAF8' }}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.mainContent}>
            <View style={styles.pageHeader}>
              <View style={styles.greetingBlock}>
                <View style={styles.greetingBox}>
                  <Text style={styles.title}>
                    {getGreeting()}, {greetingName}
                  </Text>
                </View>
                <View style={styles.dateBox}>
                  <Text style={styles.subTitle}>{dateLabel}</Text>
                </View>
              </View>
            </View>

            <LiveClassCard selectedDate={selectedDate} />
            <View style={styles.timelineWrap}>
              <Timeline selectedDate={selectedDate} />
            </View>
          </View>

          <View style={styles.rightSidebar}>
            <View style={styles.rightHeader}>
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

            <HomeSidePanels dayLabel={dayLabel} selectedDate={selectedDate} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FAFAF8',
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
  mainContent: {
    width: 636,
    flexGrow: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 24,
    paddingHorizontal: 32,
    paddingBottom: 32,
    gap: 24,
    backgroundColor: '#FAFAF8',
  },
  rightSidebar: {
    width: 300,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 20,
    flexGrow: 0,
    flexShrink: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#D9D6CF',
    backgroundColor: '#FAFAF8',
  },
  rightHeader: {
    height: 61,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 19,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  pageHeader: {
    width: 572,
    minHeight: 61,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 0,
    flexGrow: 0,
    flexShrink: 0,
  },
  greetingBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  greetingBox: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  dateBox: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  timelineWrap: {
    width: '100%',
    flex: 1,
  },
});

export default DashboardScreen;

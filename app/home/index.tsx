import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import LiveClassCard from '@/components/dashboard/LiveClassCard';
import ActionRequiredPanel from '@/components/dashboard/ActionRequiredPanel';
import Timeline from '@/components/dashboard/Timeline';
import NotificationPanel from '@/components/dashboard/NotificationPanel';
import SvgLoader from '@/utils/SvgLoader';
import moment from 'moment';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const parseTime = (value?: string) => {
  if (!value) return null;
  const parsed = moment(value, ['HH:mm:ss', 'HH:mm', 'h:mm A', 'h:mm a'], true);
  return parsed.isValid() ? parsed : null;
};

/** timelinePanel paddingTop + topActions (-14 + 44 + 26) + timelineCard height */
const TIMELINE_CARD_BOTTOM = 24 + 56 + 652;

const DashboardScreen = () => {
  const { user } = useSelector((state: any) => state.user);
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [columnHeight, setColumnHeight] = useState(0);
  const hasNotifications = false;
  const mainBottomPad = Math.max(0, columnHeight - TIMELINE_CARD_BOTTOM);
  const greetingName = user?.first_name || 'Teacher';
  const selectedDate = moment().format('YYYY-MM-DD');
  const dateLabel = moment(selectedDate).format('dddd, D MMMM');

  const dayProgressLabel = useMemo(() => {
    const schedule = (classTimeline || []).filter(
      (item: any) => !item?.date || item.date === selectedDate
    );
    const total = schedule.length;
    if (total === 0) return dateLabel;

    const now = moment();
    const done = schedule.filter((item: any) => {
      const end = parseTime(item?.end_time);
      if (!end) return false;
      return moment(
        `${selectedDate} ${end.format('HH:mm:ss')}`,
        'YYYY-MM-DD HH:mm:ss'
      ).isBefore(now);
    }).length;

    return `${dateLabel} · ${done} of ${total} classes done`;
  }, [classTimeline, dateLabel, selectedDate]);

  return (
    <View style={styles.screen}>
      <View
        style={styles.container}
        onLayout={(e) => setColumnHeight(e.nativeEvent.layout.height)}
      >
        <View style={[styles.mainContent, { paddingBottom: mainBottomPad }]}>
          <View style={styles.pageHeader}>
            <View style={styles.greetingBlock}>
              <View style={styles.greetingBox}>
                <Text style={styles.title}>
                  {getGreeting()}, {greetingName}
                </Text>
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.subTitle}>{dayProgressLabel}</Text>
              </View>
            </View>
          </View>

          <LiveClassCard selectedDate={selectedDate} />
          <ActionRequiredPanel />
        </View>

        <View style={styles.timelinePanel}>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => {}}
            >
              <View style={styles.actionIconBox}>
                <SvgLoader svgFilePath="refreshIcon" width={20} height={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => setNotificationsOpen(true)}
            >
              <View style={styles.actionIconBox}>
                <SvgLoader
                  svgFilePath={hasNotifications ? 'notificationActive' : 'notificationInactive'}
                  width={20}
                  height={20}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.timelineCard}>
            <View style={styles.timelineMargin}>
              <Timeline />
            </View>
          </View>
        </View>
      </View>

      <NotificationPanel
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E4E2DC',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E4E2DC',
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 24,
    /** Match timelinePanel paddingRight so left/right outer margins are even. */
    paddingHorizontal: 24,
    /** Bottom pad is set to align ActionRequiredPanel with timeline card bottom. */
    gap: 12,
    backgroundColor: '#E4E2DC',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    width: '100%',
    height: 44,
    padding: 0,
    flexGrow: 0,
    flexShrink: 0,
    overflow: 'visible',
  },
  greetingBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: -14,
  },
  greetingBox: {
    height: 32,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBox: {
    height: 16,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    height: 32,
    fontSize: 24,
    lineHeight: 32,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
  },
  subTitle: {
    height: 16,
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    gap: 16,
    marginTop: -4,
    marginBottom: 16,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    shadowColor: '#000',
    shadowOpacity: 0.0196078,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  actionIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelinePanel: {
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 24,
    paddingRight: 24,
    backgroundColor: '#E4E2DC',
  },
  timelineCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    width: 476,
    height: 652,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 16,
    flexGrow: 0,
    overflow: 'hidden',
  },
  timelineMargin: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    width: 440,
    height: 572,
    alignSelf: 'stretch',
    flexGrow: 0,
  },
});

export default DashboardScreen;

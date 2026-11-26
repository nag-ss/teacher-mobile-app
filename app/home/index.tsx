import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, Pressable, DeviceEventEmitter } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import LiveClassCard from '@/components/dashboard/LiveClassCard';
import ActionRequiredPanel from '@/components/dashboard/ActionRequiredPanel';
import Timeline from '@/components/dashboard/Timeline';
import NotificationPanel from '@/components/dashboard/NotificationPanel';
import SvgLoader from '@/utils/SvgLoader';
import { CLOSE_NOTIFICATIONS } from '@/utils/notificationEvents';
import { useIsOffline } from '@/hooks/useIsOffline';
import moment from 'moment';

/** From assets/beta_images/offline.svg — SvgXml keeps stroke color reliable. */
const OFFLINE_ICON_XML = `
<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.583984 0.582031L12.2507 12.2487M4.37565 9.04036C4.92086 8.50595 5.65387 8.20661 6.41732 8.20661C7.18076 8.20661 7.91377 8.50595 8.45898 9.04036M2.33398 6.9987C3.12605 6.18137 4.13991 5.61361 5.25065 5.36536M10.5007 6.9987C10.1534 6.63886 9.76127 6.32518 9.33398 6.06536M6.41732 11.082H6.42315" stroke="#87590A" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

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
const TIMELINE_CARD_BOTTOM = 24 + 56 + 650;

const DashboardScreen = () => {
  const { user } = useSelector((state: any) => state.user);
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const isOffline = useIsOffline();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [columnHeight, setColumnHeight] = useState(0);
  const hasNotifications = false;

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(CLOSE_NOTIFICATIONS, () => {
      setNotificationsOpen(false);
    });
    return () => sub.remove();
  }, []);

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
              <View style={styles.metaRow}>
                <Text style={styles.subTitle} numberOfLines={1}>
                  {dayProgressLabel}
                </Text>
                {isOffline ? (
                  <View style={styles.offlineBadge}>
                    <View style={styles.offlineIcon}>
                      <SvgXml xml={OFFLINE_ICON_XML} width={14} height={14} />
                    </View>
                    <Text style={styles.offlineText} numberOfLines={1}>
                      Offline
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          <LiveClassCard selectedDate={selectedDate} />
          <ActionRequiredPanel />
        </View>

        <View style={styles.timelinePanel}>
          <View style={styles.topActions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}
              onPress={() => {}}
            >
              <View style={styles.actionIconBox}>
                <SvgLoader svgFilePath="refreshIcon" width={20} height={20} />
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.actionButtonPressed,
              ]}
              onPress={() => setNotificationsOpen(true)}
            >
              <View style={styles.actionIconBox}>
                <SvgLoader
                  svgFilePath={hasNotifications ? 'notificationActive' : 'notificationInactive'}
                  width={20}
                  height={20}
                />
              </View>
            </Pressable>
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
    /** Share row with timeline (~Figma 664:476) so both cards grow. */
    flex: 664,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 24,
    /** Equal left / center / right gutters. */
    paddingLeft: 16,
    paddingRight: 16,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    minHeight: 16,
    flexGrow: 0,
    flexShrink: 1,
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
    flexShrink: 1,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexGrow: 0,
    flexShrink: 0,
  },
  offlineIcon: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    height: 16,
    fontSize: 12,
    lineHeight: 16,
    color: '#87590A',
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    gap: 12,
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
  },
  actionButtonPressed: {
    backgroundColor: '#F1EFEA',
  },
  actionIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelinePanel: {
    flex: 476,
    minWidth: 0,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 24,
    paddingRight: 16,
    backgroundColor: '#E4E2DC',
  },
  timelineCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    /** Align "Your day" with live card time row. */
    paddingTop: 14,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    width: '100%',
    minHeight: 0,
    maxHeight: 650,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 20,
    overflow: 'hidden',
  },
  timelineMargin: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    width: '100%',
    minHeight: 0,
    alignSelf: 'stretch',
  },
});

export default DashboardScreen;

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  DeviceEventEmitter,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import LiveClassCard from '@/components/dashboard/LiveClassCard';
import ActionRequiredPanel from '@/components/dashboard/ActionRequiredPanel';
import Timeline from '@/components/dashboard/Timeline';
import NotificationPanel from '@/components/dashboard/NotificationPanel';
import SvgLoader from '@/utils/SvgLoader';
import { CLOSE_NOTIFICATIONS } from '@/utils/notificationEvents';
import { useHomeResponsive } from '@/hooks/responsive/homeResponsive';
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

const DashboardScreen = () => {
  const layout = useHomeResponsive();
  const { user } = useSelector((state: any) => state.user);
  const classTimeline = useSelector((state: any) => state.classes.classTimeline);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const hasNotifications = false;

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(CLOSE_NOTIFICATIONS, () => {
      setNotificationsOpen(false);
    });
    return () => sub.remove();
  }, []);

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

  const body = (
    <View
      style={[
        styles.container,
        layout.isCompact && styles.containerCompact,
      ]}
    >
      <View
        style={[
          styles.mainContent,
          {
            flex: layout.mainFlex,
            gap: layout.gap,
            paddingTop: layout.paddingTop,
            paddingBottom: layout.paddingBottom,
            paddingLeft: layout.paddingHorizontal,
            paddingRight: layout.paddingHorizontal,
          },
          layout.isCompact && styles.mainContentCompact,
        ]}
      >
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
        <ActionRequiredPanel minHeight={layout.actionMinHeight} />
      </View>

      <View
        style={[
          styles.timelinePanel,
          {
            flex: layout.timelineFlex,
            paddingTop: layout.paddingTop,
            paddingBottom: layout.paddingBottom,
            paddingRight: layout.paddingRight,
            paddingLeft: layout.isCompact ? layout.paddingHorizontal : 0,
          },
          layout.isCompact && styles.timelinePanelCompact,
        ]}
      >
        <View
          style={[
            styles.topActions,
            { marginBottom: layout.topActionsMarginBottom },
          ]}
        >
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

        <View
          style={[
            styles.timelineCard,
            layout.isCompact && { minHeight: layout.timelineMinHeight },
          ]}
        >
          <View style={styles.timelineMargin}>
            <Timeline />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {layout.isCompact ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E4E2DC',
  },
  containerCompact: {
    flexDirection: 'column',
  },
  mainContent: {
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#E4E2DC',
  },
  mainContentCompact: {
    flexGrow: 0,
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
    gap: 12,
    marginTop: -4,
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
    minWidth: 0,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#E4E2DC',
  },
  timelinePanelCompact: {
    flexGrow: 0,
  },
  timelineCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 14,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    width: '100%',
    minHeight: 0,
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
    width: '100%',
    minHeight: 0,
    alignSelf: 'stretch',
  },
});

export default DashboardScreen;

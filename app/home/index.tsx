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
        <View style={[styles.pageHeader, { height: layout.headerHeight }]}>
          <View style={styles.greetingBlock}>
            <View style={[styles.greetingBox, { height: layout.titleLineHeight }]}>
              <Text
                style={[
                  styles.title,
                  {
                    height: layout.titleLineHeight,
                    fontSize: layout.titleSize,
                    lineHeight: layout.titleLineHeight,
                  },
                ]}
              >
                {getGreeting()}, {greetingName}
              </Text>
            </View>
            <View style={[styles.dateBox, { height: layout.subtitleSize + 4 }]}>
              <Text
                style={[
                  styles.subTitle,
                  {
                    height: layout.subtitleSize + 4,
                    fontSize: layout.subtitleSize,
                    lineHeight: layout.subtitleSize + 4,
                  },
                ]}
              >
                {dayProgressLabel}
              </Text>
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
            {
              marginBottom: layout.topActionsMarginBottom,
              gap: layout.actionButtonGap,
            },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                width: layout.actionButtonSize,
                height: layout.actionButtonSize,
                borderRadius: Math.round(layout.actionButtonSize * 0.27),
              },
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => {}}
          >
            <View
              style={[
                styles.actionIconBox,
                {
                  width: layout.actionIconSize,
                  height: layout.actionIconSize,
                },
              ]}
            >
              <SvgLoader
                svgFilePath="refreshIcon"
                width={layout.actionIconSize}
                height={layout.actionIconSize}
              />
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                width: layout.actionButtonSize,
                height: layout.actionButtonSize,
                borderRadius: Math.round(layout.actionButtonSize * 0.27),
              },
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => setNotificationsOpen(true)}
          >
            <View
              style={[
                styles.actionIconBox,
                {
                  width: layout.actionIconSize,
                  height: layout.actionIconSize,
                },
              ]}
            >
              <SvgLoader
                svgFilePath={hasNotifications ? 'notificationActive' : 'notificationInactive'}
                width={layout.actionIconSize}
                height={layout.actionIconSize}
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
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBox: {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
  },
  subTitle: {
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
    marginTop: -4,
  },
  actionButton: {
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

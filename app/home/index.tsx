import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

const DashboardScreen = () => {
  const layout = useHomeResponsive();
  const { user } = useSelector((state: any) => state.user);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const hasNotifications = false;
  const selectedDate = moment().format('YYYY-MM-DD');
  const greetingName = user?.first_name || 'Teacher';
  const dateLabel = moment(selectedDate).format('dddd, D MMMM');

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(CLOSE_NOTIFICATIONS, () => {
      setNotificationsOpen(false);
    });
    return () => sub.remove();
  }, []);

  const body = (
    <>
      <View
        style={[
          styles.header,
          {
            height: layout.headerHeight,
            marginBottom: layout.topActionsMarginBottom,
          },
        ]}
      >
        <View style={styles.greetingWrap}>
          <View style={[styles.greetingBox, { height: layout.titleLineHeight }]}>
            <Text
              style={[
                styles.greetingText,
                {
                  fontSize: layout.titleSize,
                  lineHeight: layout.titleLineHeight,
                },
              ]}
            >
              {getGreeting()}, {greetingName}
            </Text>
          </View>
          <View
            style={[
              styles.subGreetingBox,
              { height: layout.subtitleSize + 4 },
            ]}
          >
            <Text
              style={[
                styles.subGreetingText,
                {
                  fontSize: layout.subtitleSize,
                  lineHeight: layout.subtitleSize + 4,
                },
              ]}
            >
              {dateLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.headerRight, { gap: layout.actionButtonGap }]}>
          <Pressable
            style={({ pressed }) => [
              styles.headerAction,
              {
                width: layout.actionButtonSize,
                height: layout.actionButtonSize,
                borderRadius: Math.round(layout.actionButtonSize * 0.3),
              },
              pressed && styles.headerActionPressed,
            ]}
            onPress={() => {}}
          >
            <View
              style={[
                styles.headerActionIcon,
                {
                  width: layout.actionIconSize + 4,
                  height: layout.actionIconSize + 4,
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
              styles.headerAction,
              {
                width: layout.actionButtonSize,
                height: layout.actionButtonSize,
                borderRadius: Math.round(layout.actionButtonSize * 0.3),
              },
              pressed && styles.headerActionPressed,
            ]}
            onPress={() => setNotificationsOpen(true)}
          >
            <View
              style={[
                styles.headerActionIcon,
                {
                  width: layout.actionIconSize + 4,
                  height: layout.actionIconSize + 4,
                },
              ]}
            >
              <SvgLoader
                svgFilePath={
                  hasNotifications ? 'notificationActive' : 'notificationInactive'
                }
                width={layout.actionIconSize}
                height={layout.actionIconSize}
              />
            </View>
          </Pressable>
        </View>
      </View>

      <View
        style={[
          styles.contentBox,
          {
            gap: layout.gap,
            flexDirection: layout.isCompact ? 'column' : 'row',
          },
        ]}
      >
        <View
          style={[
            styles.mainContent,
            {
              flex: layout.mainFlex,
              gap: layout.gap,
            },
            layout.isCompact && styles.mainContentCompact,
          ]}
        >
          <LiveClassCard selectedDate={selectedDate} />
          <ActionRequiredPanel />
        </View>

        <View
          style={[
            styles.timelinePanel,
            {
              flex: layout.timelineFlex,
            },
            layout.isCompact && {
              ...styles.timelinePanelCompact,
              minHeight: layout.timelineMinHeight,
            },
          ]}
        >
          <Timeline />
        </View>
      </View>
    </>
  );

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: layout.paddingTop,
          paddingBottom: layout.paddingBottom,
          paddingLeft: layout.paddingHorizontal,
          paddingRight: layout.paddingRight,
        },
      ]}
    >
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
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  greetingWrap: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  greetingBox: {
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionPressed: {
    backgroundColor: '#F1EFEA',
  },
  headerActionIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  subGreetingBox: {
    justifyContent: 'center',
  },
  subGreetingText: {
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  contentBox: {
    flex: 1,
    minHeight: 0,
    alignSelf: 'stretch',
  },
  mainContent: {
    minWidth: 0,
    minHeight: 0,
    flexDirection: 'column',
  },
  mainContentCompact: {
    flexGrow: 0,
  },
  timelinePanel: {
    minWidth: 0,
    minHeight: 0,
  },
  timelinePanelCompact: {
    flexGrow: 0,
  },
});

export default DashboardScreen;

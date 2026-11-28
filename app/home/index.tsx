import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, DeviceEventEmitter } from 'react-native';
import { useSelector } from 'react-redux';
import LiveClassCard from '@/components/dashboard/LiveClassCard';
import ActionRequiredPanel from '@/components/dashboard/ActionRequiredPanel';
import Timeline from '@/components/dashboard/Timeline';
import NotificationPanel from '@/components/dashboard/NotificationPanel';
import SvgLoader from '@/utils/SvgLoader';
import { CLOSE_NOTIFICATIONS } from '@/utils/notificationEvents';
import moment from 'moment';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const DashboardScreen = () => {
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

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.greetingWrap}>
          <View style={styles.greetingBox}>
            <Text style={styles.greetingText}>
              {getGreeting()}, {greetingName}
            </Text>
          </View>
          <View style={styles.subGreetingBox}>
            <Text style={styles.subGreetingText}>{dateLabel}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            style={({ pressed }) => [
              styles.headerAction,
              pressed && styles.headerActionPressed,
            ]}
            onPress={() => {}}
          >
            <View style={styles.headerActionIcon}>
              <SvgLoader svgFilePath="refreshIcon" width={18} height={18} />
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.headerAction,
              pressed && styles.headerActionPressed,
            ]}
            onPress={() => setNotificationsOpen(true)}
          >
            <View style={styles.headerActionIcon}>
              <SvgLoader
                svgFilePath={
                  hasNotifications ? 'notificationActive' : 'notificationInactive'
                }
                width={18}
                height={18}
              />
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.contentBox}>
        <View style={styles.mainContent}>
          <LiveClassCard selectedDate={selectedDate} />
          <ActionRequiredPanel />
        </View>

        <View style={styles.timelinePanel}>
          <Timeline />
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
    padding: 24,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  greetingWrap: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
  },
  greetingBox: {
    height: 32,
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAction: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionPressed: {
    backgroundColor: '#F1EFEA',
  },
  headerActionIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 24,
    lineHeight: 32,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  subGreetingBox: {
    height: 16,
    justifyContent: 'center',
  },
  subGreetingText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  contentBox: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
    gap: 16,
    alignSelf: 'stretch',
  },
  mainContent: {
    flex: 676,
    minWidth: 0,
    minHeight: 0,
    flexDirection: 'column',
    gap: 16,
  },
  timelinePanel: {
    flex: 476,
    minWidth: 0,
    minHeight: 0,
  },
});

export default DashboardScreen;

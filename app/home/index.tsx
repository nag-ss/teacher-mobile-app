import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Timeline from '@/components/dashboard/Timeline';
import NotificationPanel from '@/components/dashboard/NotificationPanel';
import SvgLoader from '@/utils/SvgLoader';

const DashboardScreen = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const hasNotifications = false;

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.mainContent} />

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
    backgroundColor: '#FAFAF8',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FAFAF8',
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FAFAF8',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    gap: 16,
    marginBottom: 12,
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
    backgroundColor: '#FAFAF8',
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
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
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

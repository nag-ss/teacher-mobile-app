import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SvgLoader from '@/utils/SvgLoader';

const PANEL_WIDTH = 470;
const DISMISS_DISTANCE = PANEL_WIDTH * 0.28;
const DISMISS_VELOCITY = 800;
const OPEN_MS = 280;
const CLOSE_MS = 240;

type NotificationIcon =
  | 'notificationAlert'
  | 'notificationClock'
  | 'notificationTest'
  | 'notificationCheckbox'
  | 'notificationForward';

type TextPart = { text: string; bold?: boolean };

type NotificationItem = {
  id: string;
  icon: NotificationIcon;
  iconBg: string;
  unread?: boolean;
  time: string;
  parts: TextPart[];
};

const TODAY_ITEMS: NotificationItem[] = [
  {
    id: '1',
    icon: 'notificationAlert',
    iconBg: '#FDF2F1',
    unread: true,
    time: '20 min ago',
    parts: [
      { text: '3 students', bold: true },
      { text: " scored below 50% in yesterday's Algebra Quiz" },
    ],
  },
  {
    id: '2',
    icon: 'notificationClock',
    iconBg: '#FEF6E9',
    unread: true,
    time: '1 hour ago',
    parts: [
      { text: 'Prep your ' },
      { text: '11:00 Quadratic Equations class — starts in 1h 48m', bold: true },
    ],
  },
  {
    id: '3',
    icon: 'notificationTest',
    iconBg: '#F2F1EC',
    time: '2 hours ago',
    parts: [
      { text: '2 assignments', bold: true },
      { text: ' submitted in Grade VIII · Section A' },
    ],
  },
];

const EARLIER_ITEMS: NotificationItem[] = [
  {
    id: '4',
    icon: 'notificationCheckbox',
    iconBg: '#FEF6E9',
    time: 'Yesterday',
    parts: [
      { text: '5 quizzes', bold: true },
      { text: ' pending evaluation — due in 2 days' },
    ],
  },
  {
    id: '5',
    icon: 'notificationForward',
    iconBg: '#F2F1EC',
    time: 'Yesterday',
    parts: [
      { text: 'Parent-teacher meeting scheduled for ' },
      { text: 'Friday, 4:00 PM', bold: true },
    ],
  },
];

type NotificationPanelProps = {
  visible: boolean;
  onClose: () => void;
};

const NotificationRow = ({ item }: { item: NotificationItem }) => (
  <View style={[styles.item, item.unread && styles.itemUnread]}>
    <View style={styles.iconWrap}>
      {item.unread ? <View style={styles.unreadDot} /> : null}
      <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
        <SvgLoader svgFilePath={item.icon} width={20} height={20} />
      </View>
    </View>

    <View style={styles.itemContent}>
      <Text style={styles.itemText}>
        {item.parts.map((part, index) => (
          <Text key={`${item.id}-${index}`} style={part.bold ? styles.itemTextBold : undefined}>
            {part.text}
          </Text>
        ))}
      </Text>
      <Text style={styles.itemTime}>{item.time}</Text>
    </View>
  </View>
);

const NotificationPanel = ({ visible, onClose }: NotificationPanelProps) => {
  const [mounted, setMounted] = useState(false);
  const translateX = useSharedValue(PANEL_WIDTH);
  const backdrop = useSharedValue(0);

  const handleClosed = useCallback(() => {
    setMounted(false);
    onClose();
  }, [onClose]);

  const animateClose = useCallback(() => {
    translateX.value = withTiming(
      PANEL_WIDTH,
      { duration: CLOSE_MS, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(handleClosed)();
      }
    );
    backdrop.value = withTiming(0, {
      duration: CLOSE_MS,
      easing: Easing.in(Easing.cubic),
    });
  }, [backdrop, handleClosed, translateX]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.value = PANEL_WIDTH;
      backdrop.value = 0;
      translateX.value = withTiming(0, {
        duration: OPEN_MS,
        easing: Easing.out(Easing.cubic),
      });
      backdrop.value = withTiming(1, {
        duration: OPEN_MS,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (mounted) {
      animateClose();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const pan = Gesture.Pan()
    .activeOffsetX(12)
    .failOffsetY([-24, 24])
    .onUpdate((event) => {
      const x = Math.max(0, event.translationX);
      translateX.value = x;
      backdrop.value = 1 - Math.min(1, x / PANEL_WIDTH);
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationX > DISMISS_DISTANCE || event.velocityX > DISMISS_VELOCITY;

      if (shouldClose) {
        translateX.value = withTiming(
          PANEL_WIDTH,
          { duration: CLOSE_MS, easing: Easing.in(Easing.cubic) },
          (finished) => {
            if (finished) runOnJS(handleClosed)();
          }
        );
        backdrop.value = withTiming(0, {
          duration: CLOSE_MS,
          easing: Easing.in(Easing.cubic),
        });
      } else {
        translateX.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
        backdrop.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={animateClose}
    >
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.overlay}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={animateClose} />
          </Animated.View>

          <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
            <GestureDetector gesture={pan}>
              <Animated.View style={[styles.panel, panelStyle]}>
                <View style={styles.header}>
                  <Text style={styles.title}>Notifications</Text>

                  <View style={styles.headerActions}>
                    <TouchableOpacity activeOpacity={0.7} hitSlop={8}>
                      <Text style={styles.markAllRead}>Mark all read</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.closeButton}
                      activeOpacity={0.7}
                      onPress={animateClose}
                      hitSlop={8}
                    >
                      <SvgLoader svgFilePath="notificationClose" width={16} height={16} />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView
                  style={styles.body}
                  contentContainerStyle={styles.bodyContent}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <View style={styles.bodyInner}>
                    <View style={styles.section}>
                      <View style={styles.groupLabelContainer}>
                        <Text style={styles.groupLabel}>TODAY</Text>
                      </View>
                      {TODAY_ITEMS.map((item) => (
                        <NotificationRow key={item.id} item={item} />
                      ))}
                    </View>

                    <View style={styles.section}>
                      <View style={styles.groupLabelContainer}>
                        <Text style={styles.groupLabel}>EARLIER</Text>
                      </View>
                      {EARLIER_ITEMS.map((item) => (
                        <NotificationRow key={item.id} item={item} />
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </Animated.View>
            </GestureDetector>
          </SafeAreaView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 30, 28, 0.24)',
  },
  safeArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  panel: {
    width: PANEL_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -8, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  header: {
    alignSelf: 'stretch',
    minHeight: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D6CF',
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllRead: {
    fontSize: 14,
    lineHeight: 17,
    color: '#0D8A57',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F1EC',
    borderRadius: 8,
  },
  body: {
    flex: 1,
    alignSelf: 'stretch',
  },
  bodyContent: {
    flexGrow: 1,
  },
  bodyInner: {
    alignSelf: 'stretch',
    paddingVertical: 8,
  },
  section: {
    alignSelf: 'stretch',
  },
  groupLabelContainer: {
    alignSelf: 'stretch',
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  groupLabel: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    textTransform: 'uppercase',
  },
  item: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  itemUnread: {
    backgroundColor: '#F6FBF9',
  },
  unreadDot: {
    position: 'absolute',
    left: -16,
    top: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#21C17C',
  },
  iconWrap: {
    width: 40,
    height: 40,
  },
  iconBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  itemText: {
    alignSelf: 'stretch',
    fontSize: 14,
    lineHeight: 20,
    color: '#1F1E1C',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  itemTextBold: {
    fontFamily: 'Inter_600SemiBold',
    color: '#1F1E1C',
  },
  itemTime: {
    fontSize: 14,
    lineHeight: 17,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
});

export default NotificationPanel;

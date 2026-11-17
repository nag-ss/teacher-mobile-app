import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
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

const PANEL_WIDTH = 520;
const DISMISS_DISTANCE = PANEL_WIDTH * 0.28;
const DISMISS_VELOCITY = 800;
const OPEN_MS = 280;
const CLOSE_MS = 240;

type NotificationIcon =
  | 'notificationIconClock'
  | 'notificationIconSparkle'
  | 'notificationIconPeople'
  | 'notificationIconCalendar';

type TextPart = { text: string; bold?: boolean };

type NotificationItem = {
  id: string;
  icon: NotificationIcon;
  parts: TextPart[];
  meta: string;
  unread?: boolean;
};

const TODAY_ITEMS: NotificationItem[] = [
  {
    id: '1',
    icon: 'notificationIconClock',
    unread: true,
    parts: [
      { text: 'Reminder', bold: true },
      { text: " · Trigonometry VII-A at 9:10 isn't prepped" },
    ],
    meta: '8:40 · 30 min before',
  },
  {
    id: '2',
    icon: 'notificationIconSparkle',
    unread: true,
    parts: [
      { text: 'Quadratic Equations VIII-A', bold: true },
      { text: ' plan is ready' },
    ],
    meta: '9:58',
  },
  {
    id: '3',
    icon: 'notificationIconPeople',
    parts: [
      { text: 'Dev Patel', bold: true },
      { text: ' missed his third Notebook Check' },
    ],
    meta: '9:40 · VIII-B',
  },
  {
    id: '4',
    icon: 'notificationIconCalendar',
    parts: [
      { text: 'Dept meeting', bold: true },
      { text: ' moved to 2:30' },
    ],
    meta: '8:30',
  },
];

const YESTERDAY_ITEMS: NotificationItem[] = [
  {
    id: '5',
    icon: 'notificationIconClock',
    parts: [
      { text: 'Reminder', bold: true },
      { text: " · tomorrow's Trigonometry VII-A isn't prepped" },
    ],
    meta: 'Mon 6:00 pm · the evening before',
  },
];

type NotificationPanelProps = {
  visible: boolean;
  onClose: () => void;
};

const NotificationRow = ({ item }: { item: NotificationItem }) => (
  <View style={styles.item}>
    <View style={styles.iconBox}>
      {item.unread ? <View style={styles.unreadDot} /> : null}
      <SvgLoader svgFilePath={item.icon} width={16} height={16} />
    </View>

    <View style={styles.itemContent}>
      <Text style={styles.itemText}>
        {item.parts.map((part, index) => (
          <Text
            key={`${item.id}-${index}`}
            style={part.bold ? styles.itemTextBold : undefined}
          >
            {part.text}
          </Text>
        ))}
      </Text>
      <Text style={styles.itemMeta}>{item.meta}</Text>
    </View>
  </View>
);

const NotificationSection = ({
  title,
  items,
  spaced,
}: {
  title: string;
  items: NotificationItem[];
  spaced?: boolean;
}) => (
  <View style={spaced ? styles.sectionSpaced : undefined}>
    <Text style={styles.groupLabel}>{title}</Text>
    <View style={styles.divider} />
    {items.map((item, index) => (
      <View key={item.id}>
        {index > 0 ? <View style={styles.divider} /> : null}
        <NotificationRow item={item} />
      </View>
    ))}
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

    if (mounted) animateClose();
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
        runOnJS(animateClose)();
        return;
      }

      translateX.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
      backdrop.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
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
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={animateClose} />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.panel, panelStyle]}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>Today and yesterday</Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.7}
                onPress={animateClose}
                hitSlop={8}
              >
                <SvgLoader
                  svgFilePath="timelinePopupClose"
                  width={14}
                  height={14}
                  color="#8A8880"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <NotificationSection title="TODAY" items={TODAY_ITEMS} />
              <NotificationSection title="YESTERDAY" items={YESTERDAY_ITEMS} spaced />
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 30, 28, 0.24)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  closeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  groupLabel: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    color: '#8A8880',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    marginBottom: 8,
  },
  sectionSpaced: {
    marginTop: 28,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  unreadDot: {
    position: 'absolute',
    left: -16,
    top: 18,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1F1E1C',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EDEBE6',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1EFEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1F1E1C',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  itemTextBold: {
    fontFamily: 'Inter_700Bold',
  },
  itemMeta: {
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
});

export default NotificationPanel;

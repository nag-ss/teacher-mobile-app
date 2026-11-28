import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SvgLoader from '@/utils/SvgLoader';
import {
  FORCE_NOTIFICATION_UI,
  DEMO_NOTIFICATION_TODAY,
  DEMO_NOTIFICATION_YESTERDAY,
  type NotificationDemoItem,
} from '@/demoData/demoData';
import NotificationSwipeRow from '@/components/dashboard/NotificationSwipeRow';

const PANEL_WIDTH = 500;
const OPEN_MS = 280;
const CLOSE_MS = 240;

const INK = '#1F1E1C';
const MUTED = '#8A8880';

const ICONS = {
  reminder: 'notificationIconClock',
  plan_ready: 'notificationIconSparkle',
  student_alert: 'notificationIconPeople',
  meeting: 'notificationIconCalendar',
} as const;

const SECTIONS = [
  { title: 'TODAY', items: DEMO_NOTIFICATION_TODAY },
  { title: 'YESTERDAY', items: DEMO_NOTIFICATION_YESTERDAY },
];

const ease = (ms: number, easing = Easing.out(Easing.cubic)) => ({ duration: ms, easing });

type RowProps = {
  item: NotificationDemoItem;
  expanded: boolean;
  onToggle: () => void;
  onMarkRead: () => void;
};

const NotificationRow = ({ item, expanded, onToggle, onMarkRead }: RowProps) => (
  <View>
    <NotificationSwipeRow unread={item.unread} onMarkRead={onMarkRead}>
      {(dotStyle) => (
        <View style={styles.item}>
          <View style={styles.leading}>
            {item.unread ? <Animated.View style={[styles.unreadDot, dotStyle]} /> : null}
            <View style={styles.iconBox}>
              <SvgLoader svgFilePath={ICONS[item.type]} width={16} height={16} />
            </View>
          </View>

          <View style={styles.itemContent}>
            <Text style={styles.itemText}>
              {item.parts.map((p, i) => (
                <Text key={i} style={p.bold ? styles.itemTextBold : undefined}>
                  {p.text}
                </Text>
              ))}
            </Text>
            <Text style={styles.itemMeta}>{item.meta}</Text>
          </View>

          {item.detail ? (
            <TouchableOpacity
              style={expanded ? styles.arrowOpen : styles.arrowClosed}
              activeOpacity={0.7}
              onPress={onToggle}
              hitSlop={8}
            >
              <SvgLoader svgFilePath="betaRightArrow" width={6} height={10} color={INK} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </NotificationSwipeRow>

    {expanded && item.detail ? (
      <View style={styles.detail}>
        <Text style={styles.detailSummary}>{item.detail.summary}</Text>
        <Text style={styles.detailLabel}>LATELY</Text>
        {item.detail.lately.map((s) => (
          <View key={s.label}>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailRowLabel}>{s.label}</Text>
              <Text style={styles.detailRowValue}>{s.value}</Text>
            </View>
          </View>
        ))}
      </View>
    ) : null}
  </View>
);

type Props = { visible: boolean; onClose: () => void };

const NotificationPanel = ({ visible, onClose }: Props) => {
  const [active, setActive] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<string[]>([]);
  const translateX = useSharedValue(PANEL_WIDTH);

  const toggle = (id: string) => setExpandedId((p) => (p === id ? null : id));
  const markRead = (id: string) => setReadIds((p) => [...p, id]);

  const finishClose = useCallback(() => {
    setActive(false);
    setExpandedId(null);
    onClose();
  }, [onClose]);

  const animateClose = useCallback(() => {
    translateX.value = withTiming(
      PANEL_WIDTH,
      ease(CLOSE_MS, Easing.in(Easing.cubic)),
      (done) => {
        if (done) runOnJS(finishClose)();
      }
    );
  }, [finishClose, translateX]);

  // No Modal remount — overlay stays in the tree, so the slide starts on tap.
  useLayoutEffect(() => {
    if (visible) {
      setActive(true);
      translateX.value = withTiming(0, ease(OPEN_MS));
      return;
    }
    // Parent closed (e.g. logout) — unmount immediately so GH can't block the Modal.
    if (active) {
      translateX.value = PANEL_WIDTH;
      setActive(false);
      setExpandedId(null);
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - Math.min(1, translateX.value / PANEL_WIDTH),
  }));

  // Keep the host mounted for instant open, but unmount when fully closed.
  if (!active && !visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={animateClose} />
        </Animated.View>

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
              <SvgLoader svgFilePath="timelinePopupClose" width={14} height={14} color={MUTED} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {SECTIONS.map(({ title, items }, s) => (
              <View key={title} style={s > 0 ? styles.sectionSpaced : undefined}>
                <Text style={styles.groupLabel}>{title}</Text>
                {(FORCE_NOTIFICATION_UI ? items : []).map((raw) => {
                  const item = { ...raw, unread: raw.unread && !readIds.includes(raw.id) };
                  return (
                    <View key={item.id}>
                      <View style={styles.divider} />
                      <NotificationRow
                        item={item}
                        expanded={expandedId === item.id}
                        onToggle={() => toggle(item.id)}
                        onMarkRead={() => markRead(item.id)}
                      />
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
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
    paddingTop: 18,
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
    color: INK,
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: MUTED,
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
    color: MUTED,
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
    paddingHorizontal: 24,
    gap: 12,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -16,
    marginRight: 8,
    backgroundColor: INK,
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
    color: INK,
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  itemTextBold: {
    fontFamily: 'Inter_700Bold',
  },
  itemMeta: {
    fontSize: 12,
    lineHeight: 16,
    color: MUTED,
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  arrowClosed: {
    transform: [{ rotate: '90deg' }],
  },
  arrowOpen: {
    transform: [{ rotate: '270deg' }],
  },
  detail: {
    paddingLeft: 56,
    paddingBottom: 8,
  },
  detailLabel: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    color: MUTED,
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  detailSummary: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 20,
    color: INK,
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  detailRowLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
    fontFamily: 'Inter_400Regular',
    includeFontPadding: false,
  },
  detailRowValue: {
    flexShrink: 0,
    fontSize: 14,
    lineHeight: 20,
    color: INK,
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
});

export default NotificationPanel;
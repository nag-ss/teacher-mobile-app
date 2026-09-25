import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
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

const PANEL_WIDTH = 400;
const DISMISS_DISTANCE = PANEL_WIDTH * 0.28;
const DISMISS_VELOCITY = 800;
const OPEN_MS = 280;
const CLOSE_MS = 240;

type NotificationPanelProps = {
  visible: boolean;
  onClose: () => void;
};

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
                      <View style={styles.closeIconBox}>
                        <SvgLoader svgFilePath="notificationClose" width={16} height={16} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    width: PANEL_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -8, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    zIndex: 3,
  },
  header: {
    // panel-header — Figma
    alignSelf: 'stretch',
    width: '100%',
    minHeight: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D6CF',
    flexGrow: 0,
    flexShrink: 0,
  },
  title: {
    // title — Figma (no fixed box — fixed 135×24 was clipping the last letters)
    fontSize: 20,
    lineHeight: 24,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_700Bold',
    includeFontPadding: false,
    flexGrow: 0,
    flexShrink: 0,
  },
  headerActions: {
    // header-actions — Figma
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    gap: 12,
    flexGrow: 0,
    flexShrink: 0,
  },
  markAllRead: {
    // mark-all-read — Figma (no fixed 87×17 — clips text on device)
    fontSize: 14,
    lineHeight: 17,
    color: '#0D8A57',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
    flexGrow: 0,
    flexShrink: 0,
  },
  closeButton: {
    // close-button — Figma
    width: 40,
    height: 40,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F1EC',
    borderRadius: 8,
    flexGrow: 0,
    flexShrink: 0,
  },
  closeIconBox: {
    // Close 1 — Figma
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
});

export default NotificationPanel;

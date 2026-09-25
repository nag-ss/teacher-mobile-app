import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Pressable, SafeAreaView } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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

  // Modal covers whole app (left nav + home) so everything unfocuses.
  // SafeAreaView keeps the white panel height inside the app safe area.
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
              <Animated.View style={[styles.panel, panelStyle]} />
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
    // notification-panel — Figma
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
});

export default NotificationPanel;

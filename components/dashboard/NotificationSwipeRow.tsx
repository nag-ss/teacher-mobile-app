import React, { type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type AnimatedStyle,
} from 'react-native-reanimated';

const MARK_READ_DISTANCE = 40;
const MARK_READ_VELOCITY = 600;
const COVER_MS = 280;
const REVEAL_HOLD_MS = 40;
const REVEAL_MS = 220;

type Props = {
  unread?: boolean;
  onMarkRead: () => void;
  children: (dotStyle: AnimatedStyle<StyleProp<ViewStyle>>) => ReactNode;
};

const NotificationSwipeRow = ({ unread, onMarkRead, children }: Props) => {
  const x = useSharedValue(0); // row offset
  const fade = useSharedValue(0); // 1 = gray overlay fully covers the row
  const width = useSharedValue(500);

  const pan = Gesture.Pan()
    .enabled(!!unread)
    .activeOffsetX(16)
    .failOffsetY([-20, 20])
    .onUpdate((e) => {
      x.value = Math.max(0, Math.min(e.translationX, width.value));
    })
    .onEnd((e) => {
      if (x.value > MARK_READ_DISTANCE || e.velocityX > MARK_READ_VELOCITY) {
        x.value = withTiming(
          width.value,
          { duration: COVER_MS, easing: Easing.out(Easing.cubic) },
          (done) => {
            if (!done) return;
            // Snap back under the gray overlay, then fade back to white.
            x.value = 0;
            fade.value = 1;
            fade.value = withDelay(
              REVEAL_HOLD_MS,
              withTiming(0, { duration: REVEAL_MS, easing: Easing.inOut(Easing.cubic) })
            );
            runOnJS(onMarkRead)();
          }
        );
      } else {
        x.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    opacity: 1 - fade.value,
    transform: [{ translateX: x.value }],
  }));

  const revealStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  // Dot fades out as soon as the row starts moving.
  const dotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [0, 16], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View
      style={styles.track}
      onLayout={(e) => {
        width.value = e.nativeEvent.layout.width;
      }}
    >
      {unread ? <View style={styles.gray} /> : null}

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.row, rowStyle]}>{children(dotStyle)}</Animated.View>
      </GestureDetector>

      <Animated.View pointerEvents="none" style={[styles.gray, styles.reveal, revealStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    marginHorizontal: -24,
    overflow: 'hidden',
  },
  gray: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8E6E1',
  },
  reveal: {
    zIndex: 2,
  },
  row: {
    backgroundColor: '#FFFFFF',
  },
});

export default NotificationSwipeRow;

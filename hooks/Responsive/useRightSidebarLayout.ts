import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/** Figma sizes for the home right sidebar at full dashboard size. */
const FIGMA = {
  sidebarWidth: 300,
  paddingTop: 24,
  paddingHorizontal: 24,
  paddingBottom: 32,
  gap: 20,
  headerHeight: 61,
  dayPillPaddingV: 12,
  dayPillPaddingH: 16,
  dayPillGap: 14,
  dayPillRadius: 12,
  notificationSize: 44,
  cardPadding: 24,
  cardGap: 16,
  cardRadius: 16,
  attentionGap: 10,
} as const;

/**
 * Home sits beside the left nav, so content area = window − left nav.
 * Left nav (216) + main column (~636) + right sidebar (300).
 */
const LEFT_SIDEBAR_WIDTH = 216;
const MAIN_COLUMN_WIDTH = 636;
const FIGMA_DASHBOARD_WIDTH = LEFT_SIDEBAR_WIDTH + MAIN_COLUMN_WIDTH + FIGMA.sidebarWidth;
const FIGMA_DASHBOARD_HEIGHT = 700;
const MAIN_MIN_WIDTH = 360;
const SIDEBAR_MIN_WIDTH = 220;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export type RightSidebarLayout = {
  sidebarWidth: number;
  paddingTop: number;
  paddingHorizontal: number;
  paddingBottom: number;
  gap: number;
  headerHeight: number;
  dayPillPaddingV: number;
  dayPillPaddingH: number;
  dayPillGap: number;
  dayPillRadius: number;
  notificationSize: number;
  cardPadding: number;
  cardGap: number;
  cardRadius: number;
  attentionGap: number;
};

export const useRightSidebarLayout = (): RightSidebarLayout => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const widthFits = width >= FIGMA_DASHBOARD_WIDTH;
    const heightFits = height >= FIGMA_DASHBOARD_HEIGHT;
    const homeWidth = Math.max(0, width - LEFT_SIDEBAR_WIDTH);
    const sidebarWidth = clamp(
      homeWidth - MAIN_MIN_WIDTH,
      SIDEBAR_MIN_WIDTH,
      FIGMA.sidebarWidth,
    );

    if (widthFits && heightFits) {
      return { ...FIGMA, sidebarWidth };
    }

    return {
      sidebarWidth,
      paddingTop: heightFits ? FIGMA.paddingTop : 16,
      paddingHorizontal: widthFits ? FIGMA.paddingHorizontal : 16,
      paddingBottom: heightFits ? FIGMA.paddingBottom : 20,
      gap: heightFits ? FIGMA.gap : 12,
      headerHeight: heightFits ? FIGMA.headerHeight : 48,
      dayPillPaddingV: heightFits ? FIGMA.dayPillPaddingV : 8,
      dayPillPaddingH: widthFits ? FIGMA.dayPillPaddingH : 12,
      dayPillGap: widthFits ? FIGMA.dayPillGap : 10,
      dayPillRadius: FIGMA.dayPillRadius,
      notificationSize: FIGMA.notificationSize,
      cardPadding: widthFits && heightFits ? FIGMA.cardPadding : 16,
      cardGap: heightFits ? FIGMA.cardGap : 12,
      cardRadius: FIGMA.cardRadius,
      attentionGap: FIGMA.attentionGap,
    };
  }, [width, height]);
};

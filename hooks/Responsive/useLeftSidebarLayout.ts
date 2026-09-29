import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/** Figma sizes for the left nav at full dashboard size. */
const FIGMA = {
  sidebarWidth: 216,
  paddingTop: 24,
  paddingHorizontal: 16,
  paddingBottom: 20,
  contentWidth: 184,
  navGap: 24,
  headerHeight: 61,
  headerGap: 8,
  logoSize: 32,
  menuGap: 8,
  menuItemHeight: 48,
  menuItemPaddingH: 16,
  menuItemGap: 14,
  menuItemRadius: 12,
  footerGap: 12,
  avatarSize: 40,
  logoutBoxSize: 24,
} as const;

/** Left nav (216) + main column (~636) + right sidebar (300). */
const MAIN_COLUMN_WIDTH = 636;
const RIGHT_SIDEBAR_WIDTH = 300;
const FIGMA_DASHBOARD_WIDTH = FIGMA.sidebarWidth + MAIN_COLUMN_WIDTH + RIGHT_SIDEBAR_WIDTH;
const FIGMA_DASHBOARD_HEIGHT = 700;
const SIDEBAR_MIN_WIDTH = 168;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export type LeftSidebarLayout = {
  sidebarWidth: number;
  paddingTop: number;
  paddingHorizontal: number;
  paddingBottom: number;
  contentWidth: number;
  navGap: number;
  headerHeight: number;
  headerGap: number;
  logoSize: number;
  menuGap: number;
  menuItemHeight: number;
  menuItemPaddingH: number;
  menuItemGap: number;
  menuItemRadius: number;
  footerGap: number;
  avatarSize: number;
  logoutBoxSize: number;
};

export const useLeftSidebarLayout = (): LeftSidebarLayout => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const widthFits = width >= FIGMA_DASHBOARD_WIDTH;
    const heightFits = height >= FIGMA_DASHBOARD_HEIGHT;

    if (widthFits && heightFits) {
      return { ...FIGMA };
    }

    const paddingHorizontal = widthFits ? FIGMA.paddingHorizontal : 10;
    /** Narrower left nav so center (live + timeline) gets more width. */
    const sidebarWidth = clamp(
      widthFits ? FIGMA.sidebarWidth : 176,
      SIDEBAR_MIN_WIDTH,
      FIGMA.sidebarWidth,
    );
    const contentWidth = Math.max(0, sidebarWidth - paddingHorizontal * 2);

    return {
      sidebarWidth,
      paddingTop: heightFits ? FIGMA.paddingTop : 16,
      paddingHorizontal,
      paddingBottom: heightFits ? FIGMA.paddingBottom : 16,
      contentWidth,
      navGap: heightFits ? FIGMA.navGap : 16,
      headerHeight: heightFits ? FIGMA.headerHeight : 48,
      headerGap: FIGMA.headerGap,
      logoSize: FIGMA.logoSize,
      menuGap: heightFits ? FIGMA.menuGap : 6,
      menuItemHeight: FIGMA.menuItemHeight,
      menuItemPaddingH: widthFits ? FIGMA.menuItemPaddingH : 12,
      menuItemGap: widthFits ? FIGMA.menuItemGap : 10,
      menuItemRadius: FIGMA.menuItemRadius,
      footerGap: widthFits ? FIGMA.footerGap : 8,
      avatarSize: FIGMA.avatarSize,
      logoutBoxSize: FIGMA.logoutBoxSize,
    };
  }, [width, height]);
};

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type HomeLayout = {
  isCompact: boolean;
  isNarrow: boolean;
  gap: number;
  paddingTop: number;
  paddingBottom: number;
  paddingHorizontal: number;
  paddingRight: number;
  mainFlex: number;
  timelineFlex: number;
  timelineMinHeight: number;
  actionMinHeight: number;
  topActionsMarginBottom: number;
  titleSize: number;
  titleLineHeight: number;
  subtitleSize: number;
  headerHeight: number;
  actionButtonSize: number;
  actionIconSize: number;
  actionButtonGap: number;
};

export const useHomeResponsive = (): HomeLayout => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isCompact = width < 900;
    const isNarrow = width < 480;

    if (isNarrow) {
      return {
        isCompact: true,
        isNarrow: true,
        gap: 10,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 12,
        paddingRight: 12,
        mainFlex: 1,
        timelineFlex: 1,
        timelineMinHeight: 420,
        actionMinHeight: 280,
        topActionsMarginBottom: 12,
        titleSize: 18,
        titleLineHeight: 24,
        subtitleSize: 11,
        headerHeight: 40,
        actionButtonSize: 36,
        actionIconSize: 16,
        actionButtonGap: 8,
      };
    }

    if (isCompact) {
      return {
        isCompact: true,
        isNarrow: false,
        gap: 12,
        paddingTop: 20,
        paddingBottom: 16,
        paddingHorizontal: 14,
        paddingRight: 14,
        mainFlex: 1,
        timelineFlex: 1,
        timelineMinHeight: 480,
        actionMinHeight: 320,
        topActionsMarginBottom: 14,
        titleSize: 20,
        titleLineHeight: 28,
        subtitleSize: 12,
        headerHeight: 42,
        actionButtonSize: 40,
        actionIconSize: 18,
        actionButtonGap: 10,
      };
    }

    return {
      isCompact: false,
      isNarrow: false,
      gap: 12,
      paddingTop: 24,
      paddingBottom: 16,
      paddingHorizontal: 16,
      paddingRight: 16,
      mainFlex: 630,
      timelineFlex: 510,
      timelineMinHeight: 0,
      actionMinHeight: 360,
      topActionsMarginBottom: 16,
      titleSize: 24,
      titleLineHeight: 32,
      subtitleSize: 12,
      headerHeight: 44,
      actionButtonSize: 44,
      actionIconSize: 20,
      actionButtonGap: 12,
    };
  }, [width]);
};

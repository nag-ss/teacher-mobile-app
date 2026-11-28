import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type HomeLayout = {
  isCompact: boolean;
  gap: number;
  paddingTop: number;
  paddingBottom: number;
  paddingHorizontal: number;
  mainFlex: number;
  timelineFlex: number;
  timelineMinHeight: number;
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
    if (width < 480) {
      return {
        isCompact: true,
        gap: 10,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 12,
        mainFlex: 1,
        timelineFlex: 1,
        timelineMinHeight: 420,
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

    if (width < 900) {
      return {
        isCompact: true,
        gap: 12,
        paddingTop: 20,
        paddingBottom: 16,
        paddingHorizontal: 14,
        mainFlex: 1,
        timelineFlex: 1,
        timelineMinHeight: 480,
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
      gap: 16,
      paddingTop: 24,
      paddingBottom: 24,
      paddingHorizontal: 24,
      mainFlex: 676,
      timelineFlex: 476,
      timelineMinHeight: 0,
      topActionsMarginBottom: 16,
      titleSize: 24,
      titleLineHeight: 32,
      subtitleSize: 12,
      headerHeight: 56,
      actionButtonSize: 40,
      actionIconSize: 18,
      actionButtonGap: 12,
    };
  }, [width]);
};

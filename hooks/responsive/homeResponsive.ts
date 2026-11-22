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
      mainFlex: 664,
      timelineFlex: 476,
      timelineMinHeight: 0,
      actionMinHeight: 360,
      topActionsMarginBottom: 16,
    };
  }, [width]);
};

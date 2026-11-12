import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/** Figma sizes for the live class card at full dashboard size. */
const FIGMA = {
  cardHeight: 176,
  cardPadding: 32,
  cardRadius: 20,
  contentGap: 20,
  heroInfoGap: 8,
  heroTextGap: 6,
  joinButtonWidth: 124,
  joinButtonHeight: 40,
  joinButtonPaddingH: 16,
  joinButtonGap: 6,
  accentBarWidth: 8,
} as const;

/** Left nav (216) + main column (~636) + right sidebar (300). */
const LEFT_SIDEBAR_WIDTH = 216;
const MAIN_COLUMN_WIDTH = 636;
const RIGHT_SIDEBAR_WIDTH = 300;
const FIGMA_DASHBOARD_WIDTH = LEFT_SIDEBAR_WIDTH + MAIN_COLUMN_WIDTH + RIGHT_SIDEBAR_WIDTH;
const FIGMA_DASHBOARD_HEIGHT = 700;

export type LiveClassLayout = {
  cardHeight: number;
  cardPadding: number;
  cardRadius: number;
  contentGap: number;
  heroInfoGap: number;
  heroTextGap: number;
  joinButtonWidth: number;
  joinButtonHeight: number;
  joinButtonPaddingH: number;
  joinButtonGap: number;
  accentBarWidth: number;
};

export const useLiveClassLayout = (): LiveClassLayout => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const widthFits = width >= FIGMA_DASHBOARD_WIDTH;
    const heightFits = height >= FIGMA_DASHBOARD_HEIGHT;

    if (widthFits && heightFits) {
      return { ...FIGMA };
    }

    return {
      cardHeight: FIGMA.cardHeight,
      cardPadding: widthFits && heightFits ? FIGMA.cardPadding : 20,
      cardRadius: FIGMA.cardRadius,
      contentGap: heightFits ? FIGMA.contentGap : 12,
      heroInfoGap: heightFits ? FIGMA.heroInfoGap : 6,
      heroTextGap: heightFits ? FIGMA.heroTextGap : 6,
      joinButtonWidth: FIGMA.joinButtonWidth,
      joinButtonHeight: FIGMA.joinButtonHeight,
      joinButtonPaddingH: FIGMA.joinButtonPaddingH,
      joinButtonGap: FIGMA.joinButtonGap,
      accentBarWidth: FIGMA.accentBarWidth,
    };
  }, [width, height]);
};

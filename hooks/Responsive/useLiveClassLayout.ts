import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/** Figma sizes for the live class card at full dashboard size. */
const FIGMA = {
  cardHeight: 217,
  cardEmptyHeight: 120,
  cardPadding: 32,
  cardEmptyPadding: 24,
  cardRadius: 20,
  contentGap: 20,
  heroInfoGap: 8,
  heroTextGap: 8,
  joinButtonHeight: 48,
  joinButtonPaddingH: 24,
  joinButtonGap: 8,
  emptyContentGap: 20,
  emptyIconSize: 56,
  emptyTextGap: 8,
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
  cardEmptyHeight: number;
  cardPadding: number;
  cardEmptyPadding: number;
  cardRadius: number;
  contentGap: number;
  heroInfoGap: number;
  heroTextGap: number;
  joinButtonHeight: number;
  joinButtonPaddingH: number;
  joinButtonGap: number;
  emptyContentGap: number;
  emptyIconSize: number;
  emptyTextGap: number;
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
      cardHeight: heightFits ? FIGMA.cardHeight : 180,
      cardEmptyHeight: heightFits ? FIGMA.cardEmptyHeight : 104,
      cardPadding: widthFits && heightFits ? FIGMA.cardPadding : 20,
      cardEmptyPadding: widthFits && heightFits ? FIGMA.cardEmptyPadding : 16,
      cardRadius: FIGMA.cardRadius,
      contentGap: heightFits ? FIGMA.contentGap : 12,
      heroInfoGap: heightFits ? FIGMA.heroInfoGap : 6,
      heroTextGap: heightFits ? FIGMA.heroTextGap : 6,
      joinButtonHeight: FIGMA.joinButtonHeight,
      joinButtonPaddingH: widthFits ? FIGMA.joinButtonPaddingH : 16,
      joinButtonGap: FIGMA.joinButtonGap,
      emptyContentGap: widthFits ? FIGMA.emptyContentGap : 14,
      emptyIconSize: FIGMA.emptyIconSize,
      emptyTextGap: heightFits ? FIGMA.emptyTextGap : 6,
      accentBarWidth: FIGMA.accentBarWidth,
    };
  }, [width, height]);
};

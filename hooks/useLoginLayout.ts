import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const FIGMA = {
  panePadding: 64,
  sectionGap: 48,
  artHeight: 434,
  dialogWidth: 440,
  dialogHeight: 316,
  dialogPadding: 32,
} as const;

const PANEL_FIGMA_WIDTH = 480;
const PANEL_CONTENT_WIDTH = PANEL_FIGMA_WIDTH - FIGMA.panePadding * 2;
const FIGMA_WIDTH = PANEL_FIGMA_WIDTH + 384 + FIGMA.panePadding * 2;
const PANEL_FIGMA_HEIGHT =
  FIGMA.panePadding * 2 + 40 + FIGMA.sectionGap + FIGMA.artHeight + FIGMA.sectionGap + 40;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export type LoginLayout = {
  panelWidth: number;
  panePadding: number;
  sectionGap: number;
  artHeight: number;
  dialogWidth: number;
  dialogHeight: number;
  dialogPadding: number;
};

export const useLoginLayout = (): LoginLayout => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const widthFits = width >= FIGMA_WIDTH;
    const heightFits = height >= PANEL_FIGMA_HEIGHT;
    const dialogWidth = clamp(width - 48, 320, FIGMA.dialogWidth);
    const dialogHeight = clamp(height - 48, 240, FIGMA.dialogHeight);
    const panePadding = widthFits && heightFits ? FIGMA.panePadding : 32;
    const formReserve = 280 + panePadding * 2;
    const panelWidth = clamp(
      PANEL_CONTENT_WIDTH + panePadding * 2,
      280,
      Math.max(280, width - formReserve),
    );

    if (widthFits && heightFits) {
      return { ...FIGMA, panelWidth, dialogWidth, dialogHeight };
    }

    const sectionGap = heightFits ? FIGMA.sectionGap : 32;
    const artHeight = heightFits
      ? FIGMA.artHeight
      : clamp(height - panePadding * 2 - 80 - sectionGap * 2, 280, FIGMA.artHeight);

    return {
      panelWidth,
      panePadding,
      sectionGap,
      artHeight,
      dialogWidth,
      dialogHeight,
      dialogPadding: 24,
    };
  }, [width, height]);
};

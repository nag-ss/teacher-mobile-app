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

const FIGMA_WIDTH = 480 + 384 + FIGMA.panePadding * 2;
const PANEL_FIGMA_HEIGHT =
  FIGMA.panePadding * 2 + 40 + FIGMA.sectionGap + FIGMA.artHeight + FIGMA.sectionGap + 40;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export type LoginLayout = {
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

    if (widthFits && heightFits) {
      return { ...FIGMA, dialogWidth, dialogHeight };
    }

    const panePadding = 32;
    const sectionGap = heightFits ? FIGMA.sectionGap : 32;
    const artHeight = heightFits
      ? FIGMA.artHeight
      : clamp(height - panePadding * 2 - 80 - sectionGap * 2, 280, FIGMA.artHeight);

    return {
      panePadding,
      sectionGap,
      artHeight,
      dialogWidth,
      dialogHeight,
      dialogPadding: 24,
    };
  }, [width, height]);
};

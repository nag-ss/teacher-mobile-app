import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

/** Figma sizes for the home timeline at full dashboard size. */
const FIGMA = {
  sectionGap: 16,
  sectionLabelHeight: 15,
  rowHeight: 85,
  rowGap: 16,
  rowPaddingH: 20,
  rowRadius: 12,
  visibleRows: 3,
  listBottomPad: 32,
  listContentBottomPad: 8,
  thumbHeight: 24,
  listRowGap: 8,
  scrollTrackWidth: 4,
  timeBoxMinWidth: 70,
  classMetaGap: 8,
  classMetaMarginLeft: 28,
  statusGap: 16,
  statusMarginLeft: 16,
  summaryGap: 8,
  arrowBoxSize: 20,
} as const;

/** Left nav (216) + main column (~636) + right sidebar (300). */
const LEFT_SIDEBAR_WIDTH = 216;
const MAIN_COLUMN_WIDTH = 636;
const RIGHT_SIDEBAR_WIDTH = 300;
const FIGMA_DASHBOARD_WIDTH = LEFT_SIDEBAR_WIDTH + MAIN_COLUMN_WIDTH + RIGHT_SIDEBAR_WIDTH;
const FIGMA_DASHBOARD_HEIGHT = 700;

export type TimelineLayout = {
  sectionGap: number;
  sectionLabelHeight: number;
  rowHeight: number;
  rowGap: number;
  rowPaddingH: number;
  rowRadius: number;
  listHeight: number;
  listContentBottomPad: number;
  thumbHeight: number;
  listRowGap: number;
  scrollTrackWidth: number;
  timeBoxMinWidth: number;
  classMetaGap: number;
  classMetaMarginLeft: number;
  statusGap: number;
  statusMarginLeft: number;
  summaryGap: number;
  arrowBoxSize: number;
};

export const useTimelineLayout = (): TimelineLayout => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const widthFits = width >= FIGMA_DASHBOARD_WIDTH;
    const heightFits = height >= FIGMA_DASHBOARD_HEIGHT;

    const rowHeight = heightFits ? FIGMA.rowHeight : 72;
    const rowGap = heightFits ? FIGMA.rowGap : 12;
    const listBottomPad = heightFits ? FIGMA.listBottomPad : 20;
    const listHeight =
      rowHeight * FIGMA.visibleRows + rowGap * (FIGMA.visibleRows - 1) + listBottomPad;

    if (widthFits && heightFits) {
      return {
        ...FIGMA,
        listHeight,
        listContentBottomPad: FIGMA.listContentBottomPad,
      };
    }

    return {
      sectionGap: heightFits ? FIGMA.sectionGap : 12,
      sectionLabelHeight: FIGMA.sectionLabelHeight,
      rowHeight,
      rowGap,
      rowPaddingH: widthFits ? FIGMA.rowPaddingH : 14,
      rowRadius: FIGMA.rowRadius,
      listHeight,
      listContentBottomPad: FIGMA.listContentBottomPad,
      thumbHeight: FIGMA.thumbHeight,
      listRowGap: FIGMA.listRowGap,
      scrollTrackWidth: FIGMA.scrollTrackWidth,
      timeBoxMinWidth: widthFits ? FIGMA.timeBoxMinWidth : 60,
      classMetaGap: heightFits ? FIGMA.classMetaGap : 6,
      classMetaMarginLeft: widthFits ? FIGMA.classMetaMarginLeft : 16,
      statusGap: widthFits ? FIGMA.statusGap : 10,
      statusMarginLeft: widthFits ? FIGMA.statusMarginLeft : 10,
      summaryGap: FIGMA.summaryGap,
      arrowBoxSize: FIGMA.arrowBoxSize,
    };
  }, [width, height]);
};

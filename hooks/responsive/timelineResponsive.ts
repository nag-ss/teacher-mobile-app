import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type TimelineLayout = {
  isCompact: boolean;
  timeGutter: number;
  eventsLeft: number;
  dayLabelWidth: number;
  daySegmentWidth: number;
  headerHeight: number;
  sectionSize: number;
};

export const useTimelineResponsive = (): TimelineLayout => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (width < 480) {
      return {
        isCompact: true,
        timeGutter: 48,
        eventsLeft: 44,
        dayLabelWidth: 84,
        daySegmentWidth: 32,
        headerHeight: 38,
        sectionSize: 15,
      };
    }

    if (width < 900) {
      return {
        isCompact: true,
        timeGutter: 54,
        eventsLeft: 50,
        dayLabelWidth: 96,
        daySegmentWidth: 34,
        headerHeight: 40,
        sectionSize: 15,
      };
    }

    return {
      isCompact: false,
      timeGutter: 62,
      eventsLeft: 44,
      dayLabelWidth: 104,
      daySegmentWidth: 36,
      headerHeight: 40,
      sectionSize: 16,
    };
  }, [width]);
};

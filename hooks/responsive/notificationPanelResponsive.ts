import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type NotificationPanelLayout = {
  panelWidth: number;
  paddingHorizontal: number;
  headerPaddingTop: number;
  headerPaddingBottom: number;
  titleSize: number;
  itemPaddingHorizontal: number;
  iconBoxSize: number;
};

export const useNotificationPanelResponsive = (): NotificationPanelLayout => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (width < 480) {
      return {
        panelWidth: Math.min(width, 360),
        paddingHorizontal: 16,
        headerPaddingTop: 14,
        headerPaddingBottom: 16,
        titleSize: 18,
        itemPaddingHorizontal: 16,
        iconBoxSize: 40,
      };
    }

    if (width < 900) {
      return {
        panelWidth: Math.min(420, Math.round(width * 0.72)),
        paddingHorizontal: 20,
        headerPaddingTop: 16,
        headerPaddingBottom: 18,
        titleSize: 18,
        itemPaddingHorizontal: 20,
        iconBoxSize: 42,
      };
    }

    return {
      panelWidth: 500,
      paddingHorizontal: 24,
      headerPaddingTop: 18,
      headerPaddingBottom: 20,
      titleSize: 20,
      itemPaddingHorizontal: 24,
      iconBoxSize: 44,
    };
  }, [width]);
};

import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type NotificationPanelLayout = {
  /** Fallback when home has not measured timeline width yet. */
  panelWidth: number;
  paddingHorizontal: number;
  headerPaddingBottom: number;
  iconBoxSize: number;
};

export const useNotificationPanelResponsive = (): NotificationPanelLayout => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (width < 480) {
      return {
        panelWidth: Math.min(width, 360),
        paddingHorizontal: 16,
        headerPaddingBottom: 16,
        iconBoxSize: 40,
      };
    }

    if (width < 900) {
      return {
        panelWidth: Math.min(420, Math.round(width * 0.72)),
        paddingHorizontal: 20,
        headerPaddingBottom: 18,
        iconBoxSize: 42,
      };
    }

    return {
      panelWidth: 500,
      paddingHorizontal: 24,
      headerPaddingBottom: 20,
      iconBoxSize: 44,
    };
  }, [width]);
};

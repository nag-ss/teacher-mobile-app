import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type SidebarLayout = {
  width: number;
  menuItemWidth: number;
  logoSize: number;
  avatarSize: number;
  showLabels: boolean;
};

export const useSidebarResponsive = (): SidebarLayout => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (width < 480) {
      return {
        width: 64,
        menuItemWidth: 48,
        logoSize: 40,
        avatarSize: 40,
        showLabels: false,
      };
    }

    if (width < 900) {
      return {
        width: 88,
        menuItemWidth: 72,
        logoSize: 44,
        avatarSize: 44,
        showLabels: true,
      };
    }

    return {
      width: 104,
      menuItemWidth: 88,
      logoSize: 48,
      avatarSize: 48,
      showLabels: true,
    };
  }, [width]);
};

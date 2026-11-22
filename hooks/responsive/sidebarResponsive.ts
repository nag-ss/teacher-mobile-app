import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type SidebarLayout = {
  isCompact: boolean;
  iconOnly: boolean;
  width: number;
  menuItemWidth: number;
  logoSize: number;
  avatarSize: number;
  paddingTop: number;
  paddingBottom: number;
  showLabels: boolean;
};

export const useSidebarResponsive = (): SidebarLayout => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    if (width < 480) {
      return {
        isCompact: true,
        iconOnly: true,
        width: 64,
        menuItemWidth: 48,
        logoSize: 40,
        avatarSize: 40,
        paddingTop: 12,
        paddingBottom: 16,
        showLabels: false,
      };
    }

    if (width < 900) {
      return {
        isCompact: true,
        iconOnly: false,
        width: 88,
        menuItemWidth: 72,
        logoSize: 44,
        avatarSize: 44,
        paddingTop: 14,
        paddingBottom: 20,
        showLabels: true,
      };
    }

    return {
      isCompact: false,
      iconOnly: false,
      width: 104,
      menuItemWidth: 88,
      logoSize: 48,
      avatarSize: 48,
      paddingTop: 16,
      paddingBottom: 24,
      showLabels: true,
    };
  }, [width]);
};

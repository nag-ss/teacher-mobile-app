import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type LoginBrandLayout = {
  compact: boolean;
  panelWidth?: number;
  padding: number;
  sectionGap?: number;
  artHeight?: number;
  iconSize?: number;
  headlineSize?: number;
  bodySize?: number;
};

export type LoginLayout = {
  isCompact: boolean;
  formPadding: number;
  brand: LoginBrandLayout;
};

export const useLoginResponsive = (): LoginLayout => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isCompact = width < 900;
    const isNarrow = width < 480;

    if (isCompact) {
      return {
        isCompact: true,
        formPadding: isNarrow ? 20 : 32,
        brand: {
          compact: true,
          padding: isNarrow ? 20 : 32,
        },
      };
    }

    const panelWidth = Math.min(480, Math.max(320, Math.round(width * 0.38)));
    const scale = panelWidth / 480;

    return {
      isCompact: false,
      formPadding: width < 1100 ? 40 : 64,
      brand: {
        compact: false,
        panelWidth,
        padding: Math.round(64 * scale),
        sectionGap: Math.round(48 * scale),
        artHeight: Math.round(434 * scale),
        iconSize: Math.round(176 * scale),
        headlineSize: Math.max(22, Math.round(28 * scale)),
        bodySize: Math.max(14, Math.round(16 * scale)),
      },
    };
  }, [width]);
};

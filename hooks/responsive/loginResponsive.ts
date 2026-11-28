import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type LoginBrandLayout = {
  panelWidth: number;
  padding: number;
  sectionGap: number;
  artHeight: number;
  iconSize: number;
  headlineSize: number;
  bodySize: number;
};

export type LoginLayout = {
  formPadding: number;
  brand: LoginBrandLayout;
};

export const useLoginResponsive = (): LoginLayout => {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const panelWidth = Math.min(480, Math.max(280, Math.round(width * 0.38)));
    const scale = panelWidth / 480;

    return {
      formPadding: width < 1100 ? 40 : 64,
      brand: {
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

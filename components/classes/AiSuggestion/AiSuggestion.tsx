import React, { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import QuickActions, { type QuickActionItem } from '@/components/dashboard/QuickActions';
import { classAiItems } from '@/data/Classdata';

export type AiSuggestionContentItem = Pick<QuickActionItem, 'title' | 'description'>;

type Chrome = { icon: ImageSourcePropType; cta: string };

const CLASS_CHROME: Chrome[] = [
  { icon: require('@/assets/images/cast_for_education.png'), cta: 'Schedule Review' },
  { icon: require('@/assets/images/ss/Warning.png'), cta: 'Remind Students' },
  { icon: require('@/assets/images/ss/p2p.png'), cta: 'Message Students' },
];

function toQuickActionItems(rows: AiSuggestionContentItem[]): QuickActionItem[] {
  return rows.map((row, i) => ({
    ...row,
    icon: CLASS_CHROME[i]?.icon,
    cta: CLASS_CHROME[i]?.cta || '',
  }));
}

type AiSuggestionProps = {
  title?: string;
  items?: AiSuggestionContentItem[];
};

const AiSuggestion = ({ title = 'AI Recommendations', items = classAiItems }: AiSuggestionProps) => {
  const quickActionItems = useMemo(() => toQuickActionItems(items), [items]);

  return <QuickActions title={title} items={quickActionItems} />;
};

export default AiSuggestion;

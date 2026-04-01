import React, { useMemo } from 'react';
import QuickActions from '@/components/dashboard/QuickActions';
import { classAiItems } from '@/data/Classdata';
import {
  mergeAiSuggestionItems,
  type AiSuggestionContentItem,
  type AiSuggestionVariant,
} from './aiSuggestionmapper';

export type { AiSuggestionContentItem, AiSuggestionVariant };

type AiSuggestionProps = {
  title?: string;
  items?: AiSuggestionContentItem[];
  variant?: AiSuggestionVariant;
};

const AiSuggestion = ({
  title = 'AI Recommendations',
  items = classAiItems,
  variant = 'class',
}: AiSuggestionProps) => {
  const quickActionItems = useMemo(
    () => mergeAiSuggestionItems(items, variant),
    [items, variant],
  );

  return <QuickActions title={title} items={quickActionItems} />;
};

export default AiSuggestion;


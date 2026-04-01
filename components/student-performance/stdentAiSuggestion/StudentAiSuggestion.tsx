import React, { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import QuickActions, { type QuickActionItem } from '@/components/dashboard/QuickActions';
import { studentAiItems } from '@/data/Classdata';

export type StudentAiContentItem = Pick<QuickActionItem, 'title' | 'description'>;

type Chrome = { icon: ImageSourcePropType; cta: string };

const STUDENT_CHROME: Chrome[] = [
  { icon: require('@/assets/images/folder.png'), cta: 'Assign Practice' },
  { icon: require('@/assets/images/autorenew.png'), cta: 'Share Resources' },
  { icon: require('@/assets/images/ss/WarningNew.png'), cta: 'Schedule Review Session' },
];

function toQuickActionItems(rows: StudentAiContentItem[]): QuickActionItem[] {
  return rows.map((row, i) => ({
    ...row,
    icon: STUDENT_CHROME[i]?.icon,
    cta: STUDENT_CHROME[i]?.cta || '',
  }));
}

type Props = {
  title?: string;
  items?: StudentAiContentItem[];
};

const StudentAiSuggestion = ({ title = 'AI Recommendations', items = studentAiItems }: Props) => {
  const quickActionItems = useMemo(() => toQuickActionItems(items), [items]);

  return <QuickActions title={title} items={quickActionItems} />;
};

export default StudentAiSuggestion;

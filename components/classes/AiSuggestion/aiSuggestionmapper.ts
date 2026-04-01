import type { QuickActionItem } from '@/components/dashboard/QuickActions';
import type { ImageSourcePropType } from 'react-native';

type Item = Pick<QuickActionItem, 'title' | 'description'>;

export type AiSuggestionContentItem = Item;
export type AiSuggestionVariant = 'class' | 'student';

type Chrome = {
  icon: ImageSourcePropType;
  cta: string;
};

const CHROME = {
  class: [
    { icon: require('@/assets/images/cast_for_education.png'), cta: 'Schedule Review' },
    { icon: require('@/assets/images/ss/Warning.png'), cta: 'Remind Students' },
    { icon: require('@/assets/images/ss/p2p.png'), cta: 'Message Students' },
  ],
  student: [
    { icon: require('@/assets/images/folder.png'), cta: 'Assign Practice' },
    { icon: require('@/assets/images/autorenew.png'), cta: 'Share Resources' },
    { icon: require('@/assets/images/ss/WarningNew.png'), cta: 'Schedule Review Session' },
  ],
};

export function mergeAiSuggestionItems(
  items: Item[],
  variant: 'class' | 'student',
): QuickActionItem[] {
  return items.map((item, i) => ({
    ...item,
    icon: CHROME[variant][i]?.icon,
    cta: CHROME[variant][i]?.cta || '',
  }));
}
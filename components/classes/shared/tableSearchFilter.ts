import { useMemo } from 'react';

export const STUDENT_TABLE_SEARCH_KEYS = [
  'name',
  'grade',
  'progress',
  'attendance',
  'engagement',
  'quiz',
  'id',
] as const;

export const ASSIGNMENT_TABLE_SEARCH_KEYS = ['title', 'dueDate', 'stats', 'status', 'id'] as const;

export const QUIZ_CARD_SEARCH_KEYS = ['title', 'scheduledAt', 'status'] as const;

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
}

export function useFilteredBySearch<T extends Record<string, unknown>>(
  items: T[],
  searchTerm: string,
  keys: readonly string[],
): T[] {
  return useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;

    return items.filter((item) => keys.some((key) => normalizeValue(item[key]).includes(term)));
  }, [items, keys, searchTerm]);
}

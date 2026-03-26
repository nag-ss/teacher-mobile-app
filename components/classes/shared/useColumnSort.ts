import { useMemo, useState } from 'react';

export type Direction = 'asc' | 'desc';

export type SortState = {
  key: string | null;
  direction: Direction;
};

export type GetValue<T> = Record<string, (item: T) => string | number>;

export function useSort<T>(items: T[], getValue: GetValue<T>) {
  const [key, setKey] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>('asc');
  const firstClickDescColumns = new Set(['rn', 'sno']);

  const sortedItems = useMemo(() => {
    if (!key) return items;

    const getter = getValue[key];
    if (!getter) return items;

    return [...items].sort((a, b) => {
      const aVal = getter(a);
      const bVal = getter(b);

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [items, key, direction, getValue]);

  const sortBy = (column: string) => {
    if (column === key) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setKey(column);
      setDirection(firstClickDescColumns.has(column) ? 'desc' : 'asc');
    }
  };

  const sortState: SortState = { key, direction };

  return { sortedItems, sortBy, key, direction, sortState };
}

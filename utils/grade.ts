const ROMAN_MAP: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const str = (v: unknown) => (v == null ? '' : String(v).trim());

export const toRoman = (value: string | number) => {
  const num =
    typeof value === 'number' ? value : parseInt(String(value).replace(/\D/g, ''), 10);
  if (!num || Number.isNaN(num) || num < 1 || num > 20) return String(value);

  let remaining = num;
  let result = '';
  for (const [n, symbol] of ROMAN_MAP) {
    while (remaining >= n) {
      result += symbol;
      remaining -= n;
    }
  }
  return result;
};

const getDivisionSection = (item: any) => {
  const rawDivision =
    str(item?.division_name) || str(item?.division) || str(item?.grade_name);
  const section = str(item?.section_name) || str(item?.section);
  const cleaned = rawDivision.replace(/^class\s+/i, '');
  const division = /\d/.test(cleaned) ? toRoman(cleaned) : cleaned;
  return { division, section };
};

/** Compact chip for timeline cards, e.g. `VII-A`. */
export const getGradeChip = (item: any) => {
  const { division, section } = getDivisionSection(item);
  if (division && section) return `${division}-${section}`;
  if (division) return division;
  if (section) return section;
  return '';
};

/** Full label for live card, e.g. `Grade VII · Section A`. */
export const getGradeLabel = (item: any) => {
  const { division, section } = getDivisionSection(item);
  if (division && section) return `Grade ${division} · Section ${section}`;
  if (division) return `Grade ${division}`;
  if (section) return `Section ${section}`;
  return '—';
};

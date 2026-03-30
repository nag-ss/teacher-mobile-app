type Option = { label: string; value: string };
type TeacherClassItem = {
  division?: {
    name?: string;
  };
};

export const splitGradeSection = (divisionName?: string) => {
  if (!divisionName) return { grade: '', section: '' };
  const trimmedName = divisionName.trim();
  const parts = trimmedName.split(' ').filter(Boolean);
  if (parts.length < 2) return { grade: trimmedName, section: '' };
  const rawGrade = parts.slice(0, parts.length - 1).join(' ');
  const normalizedGrade = rawGrade.replace(/^class\s+/i, '').trim();
  return {
    grade: normalizedGrade || rawGrade,
    section: parts[parts.length - 1],
  };
};

export const buildGradeOptions = (teacherClasses: TeacherClassItem[]): Option[] => {
  const gradeSet = new Set<string>();
  teacherClasses.forEach((item) => {
    const { grade } = splitGradeSection(item?.division?.name);
    if (grade) gradeSet.add(grade);
  });
  return Array.from(gradeSet).map((grade) => ({ label: grade, value: grade }));
};

export const buildSectionOptions = (teacherClasses: TeacherClassItem[], selectedGrade: string): Option[] => {
  const sectionSet = new Set<string>();
  teacherClasses.forEach((item) => {
    const { grade, section } = splitGradeSection(item?.division?.name);
    if (grade === selectedGrade && section) sectionSet.add(section);
  });
  return Array.from(sectionSet).map((section) => ({ label: section, value: section }));
};

import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import TableHeaderControls from '@/components/classes/shared/Header';
import TablePagination from '@/components/classes/shared/Pagination';
import TableHeaderRow from '@/components/classes/shared/ColumnsTitles';
import usePagination from '@/components/classes/shared/usePagination';
import { type GetValue, useSort } from '@/components/classes/shared/useColumnSort';
import { STUDENT_TABLE_SEARCH_KEYS, useFilteredBySearch } from '@/components/classes/shared/tableSearchFilter';
import StudentTableRow, { type StudentItem } from '@/components/classes/StudentSection/StudentItem';
import { classStudents } from '@/data/Classdata';

const parseNumericCell = (value: string) => Number.parseFloat((value ?? '').replace(/[^0-9.-]/g, ''));

const STUDENT_SORT_GETTERS: GetValue<StudentItem> = {
  rn: (s) => Number(s.id),
  name: (s) => s.name,
  grade: (s) => parseNumericCell(s.grade),
  progress: (s) => parseNumericCell(s.progress),
  attendance: (s) => parseNumericCell(s.attendance),
  engagement: (s) => s.engagement,
  quiz: (s) => parseNumericCell(s.quiz),
};

const StudentTable = () => {
  const PAGE_SIZE = 6;
  const [searchTerm, setSearchTerm] = useState('');
  const students = useMemo(() => classStudents as StudentItem[], []);
  const filteredStudents = useFilteredBySearch(students, searchTerm, STUDENT_TABLE_SEARCH_KEYS);
  const { sortedItems: sortedStudents, key, sortBy, direction } = useSort(filteredStudents, STUDENT_SORT_GETTERS);
  const { page, pageCount, pagedItems: pagedStudents, setPage, prev, next } = usePagination(sortedStudents, {
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    setPage(1);
  }, [searchTerm, key, direction, setPage]);

  return (
    <View style={styles.container}>
      <TableHeaderControls
        title="Student Performance"
        query={searchTerm}
        onChangeQuery={setSearchTerm}
        searchPlaceholder="Search students"
      />
      <View style={styles.tableBox}>
        <TableHeaderRow sortKey={key ?? undefined} onPressSortColumn={sortBy} columns={[
            { key: 'rn', label: 'R.no', textStyle: styles.colRn },
            { key: 'name', label: 'Student Name', textStyle: styles.colName },
            { key: 'grade', label: 'Overall Grade', textStyle: styles.colGrade },
            { key: 'progress', label: 'Progress', textStyle: styles.colProgress },
            { key: 'attendance', label: 'Attendance', textStyle: styles.colAttendance },
            { key: 'engagement', label: 'Engagement', textStyle: styles.colEngagement },
            { key: 'quiz', label: 'Last Quiz', textStyle: styles.colQuiz },
            { key: 'action', label: 'Action', textStyle: styles.colAction },
          ]}
        />

        <FlatList
          data={pagedStudents as StudentItem[]}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => <StudentTableRow item={item} />}
        />
      </View>

      {/* Pagination (reused from Feedback screen) */}
      <TablePagination page={page} pageCount={pageCount} onPrev={prev} onNext={next} onSetPage={setPage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  // header/search/sort/filter styles live in TableHeaderControls
  tableBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 335,
  },
  colRn: { flex: 0.6, textAlign: 'center' },
  colName: { flex: 1.6, textAlign: 'center' },
  colGrade: { flex: 1.2, textAlign: 'center' },
  colProgress: { flex: 1.0, textAlign: 'center' },
  colAttendance: { flex: 1.0, textAlign: 'center' },
  colEngagement: { flex: 1.0, textAlign: 'center' },
  colQuiz: { flex: 1.0, textAlign: 'center' },
  colAction: { flex: 0.7, textAlign: 'center' },
  // row styles live in StudentTableRow
  // pagination styles live in TablePagination
});

export default StudentTable;

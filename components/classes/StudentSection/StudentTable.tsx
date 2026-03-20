import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import TableHeaderControls from '@/components/classes/shared/TableHeaderControls';
import TablePagination from '@/components/classes/shared/TablePagination';
import TableHeaderRow from '@/components/classes/shared/TableHeaderRow';
import StudentTableRow, { type StudentItem } from '@/components/classes/StudentSection/StudentTableRow';

const StudentTable = () => {
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const seedStudents = [
    { name: 'Akshay Kumar .N', grade: 'B Grade - 82%', progress: '+02%', attendance: '92%', engagement: 'High', quiz: '85% (A)' },
    { name: 'Diya Choudhary.k', grade: 'A Grade - 92%', progress: '+05%', attendance: '88%', engagement: 'Medium', quiz: '56% (D)' },
    { name: 'Kabir Joshi Singh', grade: 'C Grade -75%', progress: '-02%', attendance: '72%', engagement: 'Low', quiz: '73% (B)' },
    { name: 'Aditi Desai', grade: 'A Grade -86%', progress: '+10%', attendance: '64%', engagement: 'High', quiz: '64% (C)' },
    { name: 'G.Saanvi Reddy', grade: 'D Grade -62%', progress: '+00%', attendance: '88%', engagement: 'Medium', quiz: '45% (E)' },
    { name: 'Rohan Gupta', grade: 'B Grade -79%', progress: '-06%', attendance: '45%', engagement: 'Low', quiz: '85% (A)' },
    { name: 'Rohan Gupta', grade: 'B Grade -79%', progress: '-06%', attendance: '45%', engagement: 'Low', quiz: '85% (A)' },
  ];

  const students = useMemo(
    () =>
      seedStudents.map((s, i) => ({
        id: String(i + 1).padStart(2, '0'),
        ...s,
      })),
    [seedStudents]
  );

  const pageCount = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const pagedStudents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return students.slice(start, start + PAGE_SIZE);
  }, [page, students]);

  const prev = () => {
    if (page > 1) setPage(page - 1);
  };
  const next = () => {
    if (page < pageCount) setPage(page + 1);
  };

  return (
    <View style={styles.container}>
      <TableHeaderControls title="Student Performance" query={query} onChangeQuery={setQuery} />
      <View style={styles.tableBox}>
        <TableHeaderRow
          columns={[
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

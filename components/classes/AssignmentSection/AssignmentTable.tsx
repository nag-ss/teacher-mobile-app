import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import TableHeaderControls from '@/components/classes/shared/TableHeaderControls';
import TablePagination from '@/components/classes/shared/TablePagination';
import TableHeaderRow from '@/components/classes/shared/TableHeaderRow';
import AssignmentTableRow, { type AssignmentItem } from '@/components/classes/AssignmentSection/AssignmentTableRow';

const AssignmentTable = () => {
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const assignments: AssignmentItem[] = useMemo(
    () => [
      { id: '01', title: 'Algebra Homework', dueDate: 'Apr 30', stats: '28/30 Submitted', status: 'Closed' },
      { id: '02', title: 'Trigonometry Assignment', dueDate: 'May 2', stats: '15/30 Submitted', status: 'In Progress' },
      { id: '03', title: 'Calculus Assignment', dueDate: 'May 5', stats: '10/30 Submitted', status: 'Low Participation' },
      { id: '04', title: 'Algebra Homework', dueDate: 'Apr 30', stats: '28/30 Submitted', status: 'Closed' },
      { id: '05', title: 'Trigonometry Assignment', dueDate: 'May 2', stats: '15/30 Submitted', status: 'In Progress' },
      { id: '06', title: 'Geometry Worksheet', dueDate: 'May 8', stats: '22/30 Submitted', status: 'In Progress' },
      { id: '07', title: 'Statistics Project', dueDate: 'May 12', stats: '09/30 Submitted', status: 'Low Participation' },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter((a) => `${a.title} ${a.dueDate} ${a.stats} ${a.status}`.toLowerCase().includes(q));
  }, [assignments, query]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedAssignments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const showPagination = filtered.length > PAGE_SIZE;

  const prev = () => {
    if (page > 1) setPage(page - 1);
  };
  const next = () => {
    if (page < pageCount) setPage(page + 1);
  };

  return (
    <View style={styles.container}>
      <TableHeaderControls title="Assignments" query={query} onChangeQuery={setQuery} />

      <View style={styles.tableBox}>
        <TableHeaderRow
          columns={[
            { key: 'sno', label: 'S.no', textStyle: styles.colSno },
            { key: 'title', label: 'Title', textStyle: styles.colTitle },
            { key: 'due', label: 'Due Date', textStyle: styles.colDue },
            { key: 'stats', label: 'Stats', textStyle: styles.colStats },
            { key: 'status', label: 'Status', textStyle: styles.colStatusHeader },
            { key: 'action', label: 'Action', textStyle: styles.colActionHeader },
          ]}
        />
        <FlatList
          data={pagedAssignments}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => <AssignmentTableRow item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      {showPagination ? (
        <TablePagination page={page} pageCount={pageCount} onPrev={prev} onNext={next} onSetPage={setPage} />
      ) : null}
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
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  colSno: { flex: 0.6, textAlign: 'center' },
  colTitle: { flex: 1.7, textAlign: 'center' },
  colDue: { flex: 0.9, textAlign: 'center' },
  colStats: { flex: 1.0, textAlign: 'center' },
  colStatus: { flex: 1.0, textAlign: 'center' },
  colAction: { flex: 0.7, textAlign: 'center' },
  colStatusHeader: { flex: 1.0, textAlign: 'center' },
  colActionHeader: { flex: 0.7, textAlign: 'center' },
  // row styles live in AssignmentTableRow
  // pagination styles live in TablePagination
});

export default AssignmentTable;


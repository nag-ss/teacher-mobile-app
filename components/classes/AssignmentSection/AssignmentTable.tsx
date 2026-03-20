import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import TableHeaderControls from '@/components/classes/shared/Header';
import TablePagination from '@/components/classes/shared/Pagination';
import TableHeaderRow from '@/components/classes/shared/ColumnsTitles';
import usePagination from '@/components/classes/shared/usePagination';
import AssignmentTableRow, { type AssignmentItem } from '@/components/classes/AssignmentSection/AssignmentItem';
import { classAssignments } from '@/data/Classdata';

const AssignmentTable = () => {
  const PAGE_SIZE = 6;
  const assignments = useMemo(() => classAssignments as AssignmentItem[], []);
  const {
    page,
    pageCount,
    pagedItems: pagedAssignments,
    showPagination,
    setPage,
    prev,
    next,
  } = usePagination(assignments, {
    pageSize: PAGE_SIZE,
  });

  return (
    <View style={styles.container}>
      <TableHeaderControls title="Assignments" searchDisabled />

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


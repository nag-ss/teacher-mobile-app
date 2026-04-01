import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import TableHeaderControls from '@/components/classes/shared/Header';
import TablePagination from '@/components/classes/shared/Pagination';
import TableHeaderRow from '@/components/classes/shared/ColumnsTitles';
import usePagination from '@/components/classes/shared/usePagination';
import { type GetValue, useSort } from '@/components/classes/shared/useColumnSort';
import { TASK_PERFORMANCE_SEARCH_KEYS, useFilteredBySearch } from '@/components/classes/shared/tableSearchFilter';
import TaskPerformanceItemRow, { type TaskPerformanceItem } from '@/components/student-performance/taskPerformance/TaskPerformanceItem';
import { studentTaskPerformance } from '@/data/Classdata';

const parsePercent = (value: string) => {
  const n = Number.parseFloat((value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : -1;
};

const TASK_PERFORMANCE_SORT_GETTERS: GetValue<TaskPerformanceItem> = {
  sno: (t) => Number.parseInt(String(t.id).replace(/\D/g, ''), 10) || 0,
  title: (t) => t.title,
  taskType: (t) => t.taskType,
  dueDate: (t) => t.dueDate,
  score: (t) => parsePercent(t.score),
  classAverage: (t) => parsePercent(t.classAverage),
  status: (t) => t.status,
};

const TaskPerformanceTable = () => {
  const PAGE_SIZE = 6;
  const [searchTerm, setSearchTerm] = useState('');
  const tasks = useMemo(() => studentTaskPerformance as TaskPerformanceItem[], []);
  const filtered = useFilteredBySearch(tasks, searchTerm, TASK_PERFORMANCE_SEARCH_KEYS);
  const { sortedItems, key, sortBy, direction } = useSort(filtered, TASK_PERFORMANCE_SORT_GETTERS);
  const { page, pageCount, pagedItems, setPage, prev, next } = usePagination(sortedItems, {
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    setPage(1);
  }, [searchTerm, key, direction, setPage]);

  return (
    <View style={styles.tpShell}>
      <TableHeaderControls
        title="Student Performance"
        query={searchTerm}
        onChangeQuery={setSearchTerm}
        searchPlaceholder="Search Keywords"
      />
      <View style={styles.tpGridFrame}>
        <TableHeaderRow
          sortKey={key ?? undefined}
          onPressSortColumn={sortBy}
          columns={[
            { key: 'sno', label: 'S.no', textStyle: styles.tpFlexSerial },
            { key: 'title', label: 'Assignment/Quiz Name', textStyle: styles.tpFlexAssignment },
            { key: 'taskType', label: 'Type', textStyle: styles.tpFlexType },
            { key: 'dueDate', label: 'Due Date', textStyle: styles.tpFlexDueDate },
            { key: 'score', label: 'Score', textStyle: styles.tpFlexScore },
            { key: 'classAverage', label: 'Class Average', textStyle: styles.tpFlexClassAvg },
            { key: 'status', label: 'Status', textStyle: styles.tpFlexStatus },
            { key: 'action', label: 'Action', textStyle: styles.tpFlexAction },
          ]}
        />

        <FlatList
          data={pagedItems as TaskPerformanceItem[]}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => <TaskPerformanceItemRow item={item} />}
        />
      </View>

      <TablePagination page={page} pageCount={pageCount} onPrev={prev} onNext={next} onSetPage={setPage} />
    </View>
  );
};

const styles = StyleSheet.create({
  tpShell: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  tpGridFrame: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 335,
  },
  tpFlexSerial: { flex: 0.55, textAlign: 'center' },
  tpFlexAssignment: { flex: 1.35, textAlign: 'center' },
  tpFlexType: { flex: 0.7, textAlign: 'center' },
  tpFlexDueDate: { flex: 0.75, textAlign: 'center' },
  tpFlexScore: { flex: 0.85, textAlign: 'center' },
  tpFlexClassAvg: { flex: 0.75, textAlign: 'center' },
  tpFlexStatus: { flex: 1.0, textAlign: 'center' },
  tpFlexAction: { flex: 0.65, textAlign: 'center' },
});

export default TaskPerformanceTable;

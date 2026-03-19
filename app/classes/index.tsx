import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import MetricsGrid from '@/components/classes/MetricsSection/MetricsGrid';
import StudentTable from '@/components/classes/StudentSection/StudentTable';
import LiveMonitorHeader from '@/components/live-monitoring/LiveMonitorHeader';
import ClassOverviewFilters from '@/components/classes/filter/ClassOverviewFilters';
import QuizTable from '@/components/classes/QuizSection/QuizTable';
import AssignmentTable from '@/components/classes/AssignmentSection/AssignmentTable';
import Sumarry from '@/components/classes/Insights/Insights';
import AiSuggestion from '@/components/classes/AiSuggestion/AiSuggestion';

const Classes = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} nestedScrollEnabled>
      <LiveMonitorHeader
        title="Class Overview"
        showStudentsCount={false}
        showNotificationsIcon
        notificationButtonStyle={styles.notificationButton}
      />
      <View style={styles.filtersWrap}>
        <ClassOverviewFilters />
      </View>
      <MetricsGrid />
      <StudentTable />
      <QuizTable />
      <AssignmentTable />
      <Sumarry />
      <AiSuggestion />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f5f5f5' },
  contentContainer: {
    paddingBottom: 24,
  },
  filtersWrap: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Classes;
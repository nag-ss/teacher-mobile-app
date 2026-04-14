import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LiveMonitorHeader from '@/components/live-monitoring/LiveMonitorHeader';
import ClassOverviewFilters from '@/components/classes/filter/ClassOverviewFilters';
import StudentAiSuggestion from '@/components/student-performance/studentAiSuggestion/studentAiSuggestion';
import StudentInsights from '@/components/student-performance/studentInsights/studentInsights';
import KeyHighlightGrid from '@/components/student-performance/keyHighlight/KeyHighlightGrid';
import TaskPerformanceTable from '@/components/student-performance/taskPerformance/TaskPerformanceTable';

const StudentPerformance = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const studentName = route?.params?.studentName ?? 'Student Performance';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} nestedScrollEnabled>
      <LiveMonitorHeader
        title={studentName}
        centerTitle
        showStudentsCount={false}
        showNotificationsIcon
        notificationButtonStyle={styles.notificationButton}
        onPressBack={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
            return;
          }
          navigation.navigate('Classes');
        }}
      />
      <View style={styles.filtersWrap}>
        <ClassOverviewFilters />
      </View>
      <View style={styles.suggestionsWrap}>
        <KeyHighlightGrid />
        <TaskPerformanceTable />
        <StudentInsights />
        <StudentAiSuggestion />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
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
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsWrap: {
    marginTop: 8,
  },
});

export default StudentPerformance;

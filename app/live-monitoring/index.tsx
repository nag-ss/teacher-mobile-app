import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TaskSection from '@/components/live-monitoring/TaskSection';
import StudentGrid from '@/components/live-monitoring/StudentGrid';

const DashboardScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <TaskSection />
      <StudentGrid />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f5f5f5' },
});

export default DashboardScreen;

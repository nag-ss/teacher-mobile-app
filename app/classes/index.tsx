import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MetricsGrid from '@/components/classes/MetricsGrid';
import StudentTable from '@/components/classes/StudentTable';

const Classes = () => {
  return (
    <ScrollView style={styles.container}>
      <MetricsGrid />
      <StudentTable />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f5f5f5' },
});

export default Classes;
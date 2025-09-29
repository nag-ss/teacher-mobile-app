import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TaskSection from '@/components/live-monitoring/TaskSection';
import StudentGrid from '@/components/live-monitoring/StudentGrid';
import AICheckSummary from '@/components/live-monitoring/AICheckSummary';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LiveMonitorHeader from '@/components/live-monitoring/LiveMonitorHeader';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [activeStudentsCount, setActiveStudentsCount] = useState(0)
  const [totalStudentsCount, setTotalStudentsCount] = useState(0)

  const { studentsData } = useSelector((state: any) => state.liveMonitor)
  const { liveClass } = useSelector((state: any) => state.classes)

  useEffect(() => {
      navigation.setOptions({ title: <LiveMonitorHeader /> });
  }, [])
  // useEffect(() => {
  //   navigation.setOptions({ title: 'Dynamic Title ✨' });
  // }, [navigation]);
  return (
    <ScrollView style={styles.container}>
      <LiveMonitorHeader />
      <TaskSection />
      <AICheckSummary />
      <StudentGrid />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginLeft: 18.28, backgroundColor: '#f5f5f5', marginRight: 10 },
});

export default DashboardScreen;


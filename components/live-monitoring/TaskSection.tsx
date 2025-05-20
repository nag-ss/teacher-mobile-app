import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AttendanceMonitoring from './AttendanceMonitoring';
import AITask from './AITask';
import Quiz from './Quiz';
import SlipTest from './SlipTest';
import Attendance from './Attendance';

const tasks = [
  { title: 'Attendance Monitoring', action: 'Check' },
  { title: 'Attendance Monitoring', action: 'Check' },
  { title: 'Ratios Problem', action: 'Publish' },
  { title: 'Quiz 1', action: 'Start' },
  { title: '', action: 'Add Task' },
];

const TaskSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Tasks</Text>
        <View style={styles.cardsContainer}>
            <Attendance />
            <AttendanceMonitoring />
            <AITask />
            <Quiz />
            <SlipTest />
            
        </View>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, padding: 10, backgroundColor: '#fff'},
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cardsContainer: {
    flexDirection: 'row'
  }
});

export default TaskSection;

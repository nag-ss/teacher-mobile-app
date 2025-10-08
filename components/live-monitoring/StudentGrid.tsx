import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import StudentCard from './StudentCard';
import { useSelector } from 'react-redux';
import StudentModal from './StudentModal';

const students = new Array(45).fill({ student_name: 'Akshay Sharma', status: 'Active' });

const StudentGrid = () => {
    const { studentsData, selectedTaskSection } = useSelector((state: any) => state.liveMonitor)
    const [selectedStudent, setSelectedStudent] = useState(null);
  
  console.log("studentsData")
  console.log(studentsData)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students Overview</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {studentsData.map((student: any, i: number) => (
          <StudentCard key={student.student_id+"_"+i} student={student} />
        ))}
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 13.7,
        borderRadius: 10
    },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 9.14 },
  grid: {
    // height: 500,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default StudentGrid;

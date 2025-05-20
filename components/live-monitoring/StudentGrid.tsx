import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import StudentCard from './StudentCard';
import { useSelector } from 'react-redux';
import StudentModal from './StudentModal';

const students = new Array(45).fill({ student_name: 'Akshay Sharma', status: 'Active' });

const StudentGrid = () => {
    const { studentsData } = useSelector((state: any) => state.liveMonitor)
    const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openStudentModal = (student: any) => {
    console.log("calling modal ....")
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStudent(null);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students Overview</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {studentsData.map((student: any, i: number) => (
          <StudentCard key={i} student={student} showStudentInfo={() => openStudentModal(student)} />
        ))}
      </ScrollView>
      <StudentModal
        visible={modalVisible}
        student={selectedStudent}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10
    },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  grid: {
    // height: 500,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
});

export default StudentGrid;

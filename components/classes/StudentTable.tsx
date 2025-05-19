import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import StudentRow from './StudentRow';

const StudentTable = () => {
  const students = [
    { id: '1', name: 'Akshay Kumar .N', grade: 'B Grade - 82%', progress: '+02%', attendance: '92%', engagement: 'High', quiz: '85% (A)' },
    { id: '2', name: 'Diya Choudhary.k', grade: 'A Grade - 92%', progress: '+05%', attendance: '88%', engagement: 'Medium', quiz: '56% (D)' },
    { id: '3', name: 'Kabir Joshi Singh', grade: 'C Grade -75%', progress: '-02%', attendance: '72%', engagement: 'Low', quiz: '73% (B)' },
    { id: '4', name: 'Aditi Desai', grade: 'A Grade -86%', progress: '+10%', attendance: '64%', engagement: 'High', quiz: '64% (C)' },
    { id: '5', name: 'G.Saanvi Reddy', grade: 'D Grade -62%', progress: '+00%', attendance: '88%', engagement: 'Medium', quiz: '45% (E)' },
    { id: '6', name: 'Rohan Gupta', grade: 'B Grade -79%', progress: '-06%', attendance: '45%', engagement: 'Low', quiz: '85% (A)' },
    { id: '7', name: 'M.Aarav Patel', grade: 'A Grade -91%', progress: '+00%', attendance: '89%', engagement: 'High', quiz: '95% (A)' },
    { id: '8', name: 'M.Aarav Patel', grade: 'A Grade -91%', progress: '+00%', attendance: '89%', engagement: 'High', quiz: '95% (A)' },
    { id: '9', name: 'M.Aarav Patel', grade: 'A Grade -91%', progress: '+00%', attendance: '89%', engagement: 'High', quiz: '95% (A)' },
    { id: '10', name: 'M.Aarav Patel', grade: 'A Grade -91%', progress: '+00%', attendance: '89%', engagement: 'High', quiz: '95% (A)' },
    { id: '11', name: 'M.Aarav Patel', grade: 'A Grade -91%', progress: '+00%', attendance: '89%', engagement: 'High', quiz: '95% (A)' },
    { id: '12', name: 'M.Aarav Patel', grade: 'A Grade -91%', progress: '+00%', attendance: '89%', engagement: 'High', quiz: '95% (A)' },
    { id: '13', name: 'M.Aarav Patel', grade: 'A Grade -91%', progress: '+00%', attendance: '89%', engagement: 'High', quiz: '95% (A)' },
    { id: '14', name: 'M.Aarav Patel', grade: 'A Grade -91%', progress: '+00%', attendance: '89%', engagement: 'High', quiz: '95% (A)' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Performance</Text>
        <View style={[styles.item]}>
            <Text style={[styles.id, styles.header]}>R.No</Text>
            <Text style={[styles.fname, styles.header]}>Student Name</Text>
            <Text style={[styles.name, styles.header]}>Overal Grade</Text>
            <Text style={[styles.attd, styles.header]}>Progress</Text>
            <Text style={[styles.progressCol, styles.header]}>Attendance</Text>
            <Text style={[styles.progressCol, styles.header]}>Engagement</Text>
            <Text style={[styles.attd, styles.header]}>Last Quiz</Text>
            <Text style={[styles.attd, styles.header, styles.actionsSec]}>Actions</Text>
        </View>
      <FlatList
        data={students}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.fname}>{item.name}</Text>
            <Text style={styles.name}>{item.grade}</Text>
            <Text style={styles.attd}>{item.progress}</Text>
            <Text style={styles.progressCol}>{item.attendance}</Text>
            <Text style={styles.progressCol}>{item.engagement}</Text>
            <Text style={styles.attd}>{item.quiz}</Text>
            <Text style={[styles.attd, styles.actionsSec]}> 💬 ➡️</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    height: 520
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  header: {
    fontWeight: 'bold'
  },
  actionsSec: {
    textAlign: 'center',
  },
  id: {
    // fontWeight: 'bold',
    // marginRight: 10,
    flex: 0.3
  },
  fname: {
    flex: 1.2
  },
  name: {
    flex: 1,
  },
  attd: {
    flex: 0.5,
    // backgroundColor: 'red'
  },
  progressCol: {
    flex: 0.7
  },
  attendenceCol: {

  },
});

export default StudentTable;

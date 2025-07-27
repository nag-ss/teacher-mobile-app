import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ProgressCircle from './ProgressCircle';

interface StudentCardProps {
  name: string;
  status: string;
  stdNo: number
}

const StudentCard = (studentData: any) => {
    const stdNo = studentData.student.student_id
    const student = studentData.student
    console.log("student")
    console.log(student)
    return (
  <TouchableOpacity style={styles.card} onPress={() => studentData.showStudentInfo()}>
    <View style={styles.iconView}>
        <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/Male.png')} />
    </View>
    <View style={styles.nameContnet}>
        <Text style={styles.name}>{student.student_name}</Text>
        <Text style={styles.status}>Status: {student.status}</Text>
    </View>
    {
        (student.task_type == 'SlipTest') ?
        <View style={styles.statusContainer}>
            <ProgressCircle progress={(student.score/10)*100} size={40} strokeWidth={4} />
        </View>
        : null
    }
    {
        (student.task_type == 'Classwork') ?
        <View style={styles.statusContainer}>
            <ProgressCircle progress={(student.score/10)*100} size={40} strokeWidth={4} />
        </View>
        : null
    }
    {
        (student.task_type == 'AICheck') ?
        <View style={styles.statusContainer}>
            {
                student.exact_match ? 
                <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/Correct.png')} />
                : <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/close.png')} />
            }
            
        </View>
        : null
    }
    
  </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    marginLeft: 0,
    flex: 1,
    minWidth: 200,
    maxWidth: '33%',
    alignItems: 'center',
    // elevation: 2,
    borderWidth: 1,
    borderColor: 'lightgray',
    flexDirection: 'row'
  },
  iconView: {
    marginRight: 10
  },
  icon: { fontSize: 24 },
  name: { fontWeight: '600', marginTop: 8 },
  status: { fontSize: 12, color: '#555' },
  statusContainer: {
    padding: 10,
    // backgroundColor: 'red'
  },
  nameContnet: {
    width: 130
  }
});

export default StudentCard;

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ProgressCircle from './ProgressCircle';
import { useSelector } from 'react-redux';
import StudentModal from './StudentModal';
import SlipTestResultModal from './SlipTestResult';

interface StudentCardProps {
  name: string;
  status: string;
  stdNo: number
}

const StudentCard = (studentData: any) => {
    const { selectedTaskSection } = useSelector((state: any) => state.liveMonitor)
    const [selectedStudent, setSelectedStudent] = useState(null);
    const stdNo = studentData.student.student_id
    const student = studentData.student
    console.log("student")
    console.log(student)
    const [notesModalVisible, setNotesModalVisible] = useState(false);
    const [stResultModalVisible, setstResultModalVisible] = useState(false);


  const closeModal = () => {
    setNotesModalVisible(false);
    setstResultModalVisible(false)
  };

  const showStudentInfo = async () => {
    if(selectedTaskSection == 'Attendance') {
      console.log("calling modal ....")
      setSelectedStudent(student);
      setNotesModalVisible(true);
    } else if(selectedTaskSection == 'SlipTest') {
      console.log("sliptest result calling modal ....")
      // setSelectedStudent(student);
      // setNotesModalVisible(true);
      setstResultModalVisible(true)
    }

  }


    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.card} onPress={() => showStudentInfo()}>
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
                  <ProgressCircle progress={Math.round(parseFloat(student.percentage))} size={40} strokeWidth={4} />
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
              (student.task_type == 'AICheck' && student.match_type == 'exact') ?
              <View style={styles.statusContainer}>
                  {
                      student.exact.color == 'Red' ? 
                      <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/close.png')} />
                      : <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/Correct.png')} />
                  }
                  
              </View>
              : null
          }
          {
              (student.task_type == 'AICheck' && student.match_type == 'approx') ?
              <View style={styles.statusContainer}>
                  {
                      <ProgressCircle progress={Math.round(parseFloat(student.approx.score))} size={40} strokeWidth={4} color={student.approx.color} />
                  }
                  
              </View>
              : null
          }
          
        </TouchableOpacity>
        {notesModalVisible ?
        <StudentModal
        visible={notesModalVisible}
        student={student}
        onClose={closeModal}
      /> : null
         }
        
        {stResultModalVisible ?
        <SlipTestResultModal
        visible={stResultModalVisible}
        student={student}
        onClose={closeModal}
      /> : null
      }
        
      </View>
  
    )
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    marginLeft: 0,
    // flex: 1,
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
    // padding: 10,
    // backgroundColor: 'yellow'
  },
  nameContnet: {
    width: 130
  }
});

export default StudentCard;

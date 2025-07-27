import { Colors } from '@/constants/Colors';
import { getSlipTestResults, setSelectedTask, setSelectedTaskId } from '@/store/liveMonitoringSlice';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ClassworkCheckModal from '../Modals/ClassworkModal';
import { addTaskToClass, publishQuiz } from '@/store/classSlice';
import moment from 'moment-timezone';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const Quiz = ({task}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId} = useSelector((state: any) => state.liveMonitor)
    const {user} = useSelector((state: any) => state.user);
    const {liveClass} = useSelector((state: any) => state.classes);

    const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);

    const getAttendanceData = async () => {
        const reqObj: any = {classId}
        dispatch(getSlipTestResults(reqObj))
    }
    const onPress = () => {
      setShowModal4AICheckModal(true)
        console.log("button pressed ....")
    }

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('ClassWork'))
        dispatch(setSelectedTaskId(task.task_id))
        getAttendanceData()
    }
    useEffect(() => {
        if(selectedTaskSection == 'ClassWork') {
            getAttendanceData()
        }

    }, [selectedTaskSection])

    const publishQuizFun = async () => {
      console.log("task")
      console.log(task)
      // const now = new Date();
      // const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
      const fiveMinutesLaterIST = moment().tz("Asia/Kolkata").add(5, 'minutes');
      const formatted = fiveMinutesLaterIST.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      const the_quiz = {
        start_time: formatted, 
        quiz_id: task?.quiz_id, 
        quiz_type: task?.quiz_details?.quiz_type ? task?.quiz_details?.quiz_type : "SlipTest", 
        duration: task?.quiz_details?.duration, 
        division_id: liveClass.division_id,
        task_id: task.task_id
      }
      await dispatch(publishQuiz(the_quiz));
      setShowModal4AICheckModal(false)
    }
    return (
      <View>
        <TouchableOpacity onPress={cardPressed}>
        <View style={[styles.card, {borderColor : (selectedTaskSection == 'ClassWork' && selectedTaskId == task.task_id) ? '#21C17C' : 'lightgray'}]}>
            <View style={styles.imageSection}>
                <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/Quiz.png')} />
            </View>
            
            <Text style={styles.title}>{'Quiz'}</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{'Start'}</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
        {/* <ClassworkCheckModal visible={showModal4AICheckModal} onClose={publishQuiz} goBack={publishQuiz} saveAICheckDetails={selectedTaskSection} /> */}
        <Modal visible={showModal4AICheckModal} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../../assets/images/ss/QuizIcon.png')} style={styles.iconImg} />
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.mainText}>Start Quiz</Text>
                  <Text style={styles.subText}>Are you sure you want to proceed?</Text>
                </View>
              </View>
              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal4AICheckModal(false)}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={publishQuizFun}>
                  <Text style={{ color: 'white' }}>Start Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
};

const styles = StyleSheet.create({
  card: {
    width: 130,
    // marginHorizontal: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    // alignItems: 'center',
    // elevation: 2,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  icon: { fontSize: 24 },
  title: { fontSize: 14, fontWeight: '600', marginVertical: 10, height: 40 },
  button: {
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    width: 100,
    alignItems: 'center'
  },
  buttonText: { fontWeight: '600' },
  imageSection: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 5,
    width: 50
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '50%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  iconImg: {

  },
  mainText: {
    fontSize: 20
  },
  subText: {
    fontSize: 16
  }

});

export default Quiz;

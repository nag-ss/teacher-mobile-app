import { Colors } from '@/constants/Colors';
import { getSlipTestResults, setSelectedTask, setSelectedTaskData, setSelectedTaskId } from '@/store/liveMonitoringSlice';
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

const Quiz = ({task, refreshTasks}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId} = useSelector((state: any) => state.liveMonitor)
    const {user} = useSelector((state: any) => state.user);
    const {liveClass} = useSelector((state: any) => state.classes);

    const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
    const [quizeStatusCheck, setQuizeStatusCheck] = useState('');
    const [isTaskLive, setIsTaskLive] = useState(false);

    console.log("Slip Test Slip Test Slip Test Slip Test")
    console.log(task)
    const getAttendanceData = async (taskId: number) => {
        const reqObj: any = {classId, taskId}
        dispatch(getSlipTestResults(reqObj))
    }
    const onPress = () => {
      setShowModal4AICheckModal(true)
        console.log("button pressed ....")
    }

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('SlipTest'))
        dispatch(setSelectedTaskId(task.task_id))
        dispatch(setSelectedTaskData(task))
        getAttendanceData(task.task_id)
    }
    useEffect(() => {
        if(selectedTaskSection == 'SlipTest') {
            getAttendanceData(task.task_id)
        }

    }, [selectedTaskSection])

    const publishQuizFun = async () => {
      // console.log("task")
      // console.log(task)
      // const now = new Date();
      // const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
      // const fiveMinutesLaterIST = moment().tz("Asia/Kolkata").add(5, 'minutes');
      const fiveMinutesLaterIST = moment().tz("Asia/Kolkata").add(1, 'minutes');
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
      await refreshTasks()
      setShowModal4AICheckModal(false)

    }

    useEffect(() => {
      if(task.published_quiz_id) {
        // console.log(JSON.stringify(task.quiz_details.start_date))
        // console.log(JSON.stringify(task.quiz_details.duration))
        const durationMinutes = task.quiz_details.duration;
        const startDateString = task.quiz_details.start_date;

        // Parse start date
        const startDate: any = new Date(startDateString.replace(' ', 'T'));

        // Calculate end time
        const endDate: any = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

        // Function to get remaining time
        function getTimeLeft() {
          const now: any = new Date();
          const timeLeftMS: any = endDate - now;

          if (timeLeftMS <= 0) {
            clearInterval(intervarid);
            return 'Time up!';
              
          }

          const minutes = Math.floor((timeLeftMS / 1000 / 60) % 60);
          const seconds = Math.floor((timeLeftMS / 1000) % 60);

          let tStr = ''
          if(minutes > 0) {
            tStr = `${minutes} min`
          } else {
            tStr = `${seconds} secs`
          }
          return `Time Left: ${tStr} `;
          // return `${minutes} min ${seconds} sec left`;
          // return `Time Left: ${minutes} min `;
        }

        const intervarid = setInterval(() => {
          let timeLeft = getTimeLeft()
          setQuizeStatusCheck(timeLeft);
          if((task.status == 'active' || task.status == 'in_progress') && timeLeft != 'Time up!') {
            setIsTaskLive(true)
          } else {
            setIsTaskLive(false)
          }
        }, 1000);
      }
    }, [task])
    return (
      <View>
        <TouchableOpacity onPress={cardPressed}>
        <View style={[styles.card, {borderColor : (selectedTaskSection == 'SlipTest' && selectedTaskId == task.task_id) ? '#21C17C' : 'lightgray', backgroundColor: isTaskLive ? Colors.primaryColor : ''}]}>
            <View style={styles.headerSection}>
              <View style={[styles.imageSection, {backgroundColor: isTaskLive ? '#fff' : ''}]}>
                  <Image style={{width: 20, height: 20}} source={require('../../assets/images/ss/Quiz.png')} />
              </View>
               
              <View style={[styles.pbutton, {backgroundColor: isTaskLive ? '#fff' : '', borderColor: '#21C17C'}]} >
                <Text style={[styles.pbuttonText, {color: task.live ? '#fff' : '#000' }]}>{task.status =='saved' ? 'In Queue' : ('Progress')}</Text>
              </View> 
              
            </View>
            <View style={styles.taskBodySection}>
              <Text style={styles.title}>{task.title}</Text>
              {
                task.published_quiz_id ?
                <Text style={styles.subTitle}>{quizeStatusCheck}</Text> :
                <Text style={styles.subTitle}>{''}</Text>
              }
              
            </View>
            {
              !task.published_quiz_id ?
              <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{'Start'}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : ''}]} onPress={cardPressed}>
              <Text style={styles.buttonText}>{'Results'}</Text>
            </TouchableOpacity>
            }
            
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
    width: 165,
    // height: 185,
    // marginHorizontal: 8,
    padding: 9.14,
    backgroundColor: '#fff',
    borderRadius: 10,
    // alignItems: 'center',
    // elevation: 2,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  icon: { fontSize: 24 },
  title: { 
    fontSize: 14, fontWeight: '600', height: 60
    
  },
  subTitle: {
    fontSize: 12
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 9.14
  },
  buttonText: { fontWeight: '600' },
  pbutton: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 4.57,
    borderRadius: 5,
    // width: 82,
    alignItems: 'center',
    height: 28
  },
  pbuttonText: { fontSize: 10 },
  imageSection: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 5,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskBodySection: {
    // height: 80,
    marginTop: 9.14
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
    padding: 18.28,
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
    width: '48%',
    alignItems: 'center'
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
    width: '48%',
    alignItems: 'center'
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

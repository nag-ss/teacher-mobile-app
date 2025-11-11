import { Colors } from '@/constants/Colors';
import { clearSelectedTaskData, getSlipTestResults, setSelectedTask, setSelectedTaskData, setSelectedTaskId } from '@/store/liveMonitoringSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ClassworkCheckModal from '../Modals/ClassworkModal';
import { addTaskToClass, getTaskStatus, publishQuiz } from '@/store/classSlice';
import moment from 'moment-timezone';
import { Menu, IconButton, Divider } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const Quiz = ({task, refreshTasks, editTask, deleteTask, viewTask}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId} = useSelector((state: any) => state.liveMonitor)
    const {user} = useSelector((state: any) => state.user);
    const {liveClass} = useSelector((state: any) => state.classes);

    const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
    const [quizeStatusCheck, setQuizeStatusCheck] = useState('');
    const [isTaskLive, setIsTaskLive] = useState(false);
    const [publishError, setPublishError] = useState(null);
    const [taskStatus, setTaskStatus] = useState<string>('')
    const [taskStatusName, setTaskStatusName] = useState<string>(task.status_name)
    const [taskCTAName, setTaskCTAName] = useState<string>(task.status_name)
    const [menuVisible, setMenuVisible] = useState(false);
    const taskCTANames: any = {
      "in_queue": 'Publish',
      "completed": 'Update Results',
      "evaluated": 'View Results',
      "evaluating": 'View Results',
      "in_progress": 'Update Results',
      "launching": 'Update Results',
      'published': 'Launching',
      'loading': 'Wait'
    }
    const nonLiveStatuses = ['in_queue', 'completed', 'evaluated']
    const statusCheckStatuses = ['in_progress', 'completed', 'evaluating', 'launching', 'loading', 'published']
    const intervalTimeSec = 30
    let intervalId: any; 

    // console.log("Slip slip Test")
    // console.log(task)
    const checkTaskStatus = async (taskId: any) => {
      const taskResp = await dispatch(getTaskStatus({task_id: taskId}))
      const taskStatusResp = taskResp.payload
      console.log("status res .....")
      console.log(taskStatusResp)
      setTaskStatus(taskStatusResp.status)
      setTaskStatusName(taskStatusResp.status_name)
      setIsTaskLive(nonLiveStatuses.indexOf(taskStatusResp.status) >= 0 ? false : true )
      setTaskCTAName(taskCTANames[taskStatusResp.status.toLowerCase()])
      if(taskStatusResp.status.toLowerCase() == 'evaluated') {
        if (intervalId) {
          clearInterval(intervalId);
          refreshTasks()
        }
      }
      if(taskCTANames[taskStatusResp.status.toLowerCase()] == 'Update Results' || taskCTANames[taskStatusResp.status.toLowerCase()] == 'View Results') {
        // fetch results automatically
        dispatch(clearSelectedTaskData({}))
        cardPressed()
      }
    }

    useEffect(() => {
      
      console.log("taskStatus", taskStatus)
      if (statusCheckStatuses.indexOf(taskStatus.toLowerCase()) >= 0) {
        intervalId = setInterval(() => {
          checkTaskStatus(task.task_id)
        }, intervalTimeSec * 1000);
      }

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [taskStatus])

    useFocusEffect(useCallback(() => {
        if(task.status){
          setTaskStatus(task.status)
          setTaskStatusName(task.status_name)
          setTaskCTAName(taskCTANames[task.status.toLowerCase()])
          setIsTaskLive(nonLiveStatuses.indexOf(task.status) >= 0 ? false : true )
        }
      }, [task])
    )

    // console.log("Slip Test Slip Test Slip Test Slip Test")
    // console.log(task)
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

    const fetchResult = () => {
      console.log(taskStatus, task.task_id)
      if(taskStatus == 'in_queue') {
        onPress()
      } else if(taskStatus.toLowerCase() != 'launching') {
        cardPressed()
      }
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
      console.log(the_quiz)
      const qRes = await dispatch(publishQuiz(the_quiz));
      console.log("qRes")
      console.log(qRes.payload)
      if(!qRes.payload.detail) {
        await refreshTasks()
        setShowModal4AICheckModal(false)
        setPublishError(null)
      } else {
        setPublishError(qRes.payload.detail)
      }
      

    }

    useEffect(() => {
      if(taskStatus) {
        try {
          let intervarid:  any;
          // console.log(JSON.stringify(task.quiz_details.start_date))
          // console.log(JSON.stringify(task.quiz_details.duration))
          

          

          if(taskStatus == 'in_progress') {
            const durationMinutes = task.quiz_details.duration;
            const startDateString = task.quiz_details.start_date;
            const endDateString = task.quiz_details.end_date;

            // Parse start date
            // const startDate: any = new Date(startDateString.replace(' ', 'T'));
            // const endDateStr: any = new Date(endDateString.replace(' ', 'T'));

            // Calculate end time
            // const endDate: any = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
            // const endDate: any = new Date(endDateStr.getTime() * 60 * 1000);
            const endDate: any = new Date(task.quiz_details.end_date);

            // Function to get remaining time
            function getTimeLeft() {
              const now: any = new Date();
              const timeLeftMS: any = endDate - now;

              if (timeLeftMS <= 0) {
                // clearInterval(intervarid);
                return 'Time up!';
                  
              }

              const minutes = Math.floor((timeLeftMS / 1000 / 60) % 60);
              const seconds = Math.floor((timeLeftMS / 1000) % 60);

              let tStr = ''
              // if(minutes > 0) {
              //   tStr = `${minutes} min`
              // } else {
              //   tStr = `${seconds} secs`
              // }
              tStr = `${minutes} : ${seconds}`
              return `Time Left: ${tStr} `;
              // return `${minutes} min ${seconds} sec left`;
              // return `Time Left: ${minutes} min `;
            }
            intervarid = setInterval(() => {
              let timeLeft = getTimeLeft()
              setQuizeStatusCheck(timeLeft);
              if(timeLeft == 'Time up!') {
                clearInterval(intervarid)
              }
            }, 1000);
          } else {
            if(intervarid) {
              setQuizeStatusCheck('');
              clearInterval(intervarid)
            }
            
          }
        } catch (e) {
          console.log("error in ST", e)
        }
        
      }
    }, [taskStatus])
    return (
      <View>
        <TouchableOpacity>
        <View style={[styles.card, {borderColor : (selectedTaskSection == 'SlipTest' && selectedTaskId == task.task_id) ? '#21C17C' : 'lightgray', backgroundColor: isTaskLive ? Colors.primaryColor : '#fff'}]}>
            <View style={styles.headerSection}>
              <View style={[styles.imageSection, {backgroundColor: isTaskLive ? '#fff' : ''}]}>
                  <Image style={{width: 20, height: 20}} source={require('../../assets/images/ss/Quiz.png')} />
              </View>
               
              {/* <View style={[styles.pbutton, {backgroundColor: isTaskLive ? '#fff' : '', borderColor: '#21C17C'}]} >
                <Text style={[styles.pbuttonText, {color: task.live ? '#fff' : '#000' }]}>{task.status =='saved' ? 'In Queue' : (!isTaskLive ? 'Completed' : 'Progress')}</Text>
              </View>  */}
              <View style={{flexDirection: 'row'}}>
                <View style={[styles.pbutton, {backgroundColor: task.status == 'pending' ? '#fff' : (isTaskLive ? '#fff' : 'lightgray')}]} >
                  <Text style={[styles.pbuttonText]}>{taskStatusName}</Text>
                </View>
                <View style={{ width: 20 }}>
                  <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        size={20}
                        onPress={() => setMenuVisible(true)}
                        style={{
                          width: 20,  
                          height: 20
                        }}
                      />
                    }
                    contentStyle={{
                      backgroundColor: "#fdfdfd",
                      borderRadius: 10,
                      paddingVertical: 4,
                      elevation: 5,
                      shadowColor: "#000",
                      shadowOpacity: 0.2,
                      shadowRadius: 6,
                    }}
                    style={{
                      marginTop: 40, // adjust distance from icon
                      marginLeft: 20
                    }}
                  >
                    {
                      taskStatus != 'in_queue' && 
                      <Menu.Item onPress={() => viewTask(task.quiz_id, task.task_id)} title="View" />
                    }
                    { /*
                      taskStatus == 'in_queue' && 
                      <Divider />
                    */ }
                    {
                      taskStatus == 'in_queue' && 
                        <Menu.Item onPress={() => editTask(task.task_id, task.task_type)} title="Edit" />
                    }
                    {
                      taskStatus == 'in_queue' && 
                          <Divider />
                    }
                    {
                      taskStatus == 'in_queue' && 
                        <Menu.Item onPress={() => deleteTask(task.task_id, task.task_type)} title="Delete" />
                    }
                    
                    
                    
                  </Menu>
                </View>
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
            {/* {
              !task.published_quiz_id ?
              <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{'Start'}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : ''}]} onPress={cardPressed}>
              <Text style={styles.buttonText}>{'Results'}</Text>
            </TouchableOpacity>
            } */}
            <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : ''}]} onPress={fetchResult}>
              <Text style={styles.buttonText}>{taskCTAName}</Text>
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
              {publishError ? 
              <View style={{marginTop: 13.7}}>
                <Text style={{color: 'red'}}>{publishError}</Text>
              </View>
              : null }
              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => {setShowModal4AICheckModal(false); setPublishError(null)}}>
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

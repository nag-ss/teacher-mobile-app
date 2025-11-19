import { Colors } from '@/constants/Colors';
import { clearSelectedTaskData, getClassworkResults, setSelectedTask, setSelectedTaskData, setSelectedTaskId } from '@/store/liveMonitoringSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TouchableHighlight } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AiCheckModal from '../Modals/Modal_4_AICheckModal';
import { addTaskToClass, getTaskStatus, publishClasswork } from '@/store/classSlice';
import moment from 'moment-timezone';
import { useFocusEffect } from '@react-navigation/native';
import { Menu, IconButton, Divider } from "react-native-paper";

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const ClassWork = ({task, refreshTasks, editTask, deleteTask, viewTask}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId} = useSelector((state: any) => state.liveMonitor)
    const {user} = useSelector((state: any) => state.user);
    const {liveClass} = useSelector((state: any) => state.classes);
    const [cwStatusCheck, setCWStatusCheck] = useState('');
    const [isTaskLive, setIsTaskLive] = useState(false);
    const [publishError, setPublishError] = useState(null);
    const [taskStatus, setTaskStatus] = useState<string>('')
    const [taskStatusName, setTaskStatusName] = useState<string>(task.status_name)
    const [taskCTAName, setTaskCTAName] = useState<string>(task.status_name)
    const [menuVisible, setMenuVisible] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
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
    const taskStatusNamesMap: any = {
      "in_queue": 'In Queue',
      "completed": 'On Going',
      "evaluated": 'Completed',
      "evaluating": 'On Going',
      "in_progress": 'On Going',
      "launching": 'Launching',
      'published': 'Launching',
      'loading': 'Launching'
    }
    const nonLiveStatuses = ['in_queue', 'completed', 'evaluated']
    const statusCheckStatuses = ['in_progress', 'completed', 'evaluating', 'launching', 'published', 'loading']
    const intervalTimeSec = 30
    let intervalId: any; 
    let intervarid: any; 

    // console.log("CW CW CW")
    // console.log(task)
    const checkTaskStatus = async (taskId: any) => {
      const taskResp = await dispatch(getTaskStatus({task_id: taskId}))
      const taskStatusResp = taskResp.payload
      console.log("status res .....")
      console.log(taskStatusResp)
      setTaskStatus(taskStatusResp.status)
      // setTaskStatusName(taskStatusNamesMap[taskStatusResp.status])
      setTaskStatusName(taskStatusResp.status_name)
      setIsTaskLive(nonLiveStatuses.indexOf(taskStatusResp.status) >= 0 ? false : true )
      setTaskCTAName(taskCTANames[taskStatusResp.status.toLowerCase()])
      if(taskStatusResp.status.toLowerCase() == 'evaluated') {
        if (intervalId) {
          clearInterval(intervalId);
          refreshTasks()
        }
        if(intervarid) {
          setCWStatusCheck('');
          clearInterval(intervarid)
        }
        if(selectedTaskId == task.task_id) {
          // fetch results automatically
          cardPressed()
        }
      }
      /*if(taskCTANames[taskStatusResp.status.toLowerCase()] == 'Update Results' || taskCTANames[taskStatusResp.status.toLowerCase()] == 'View Results') {
        // fetch results automatically
        dispatch(clearSelectedTaskData({}))
        cardPressed()
      }*/
     
    }

    useEffect(() => {
      
      console.log("taskStatus ====== ", taskStatus)
      if (statusCheckStatuses.indexOf(taskStatus.toLowerCase()) >= 0) {
        intervalId = setInterval(() => {
          checkTaskStatus(task.task_id)
        }, intervalTimeSec * 1000);
      }

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
        if (intervarid) {
          clearInterval(intervarid);
        }
      };
    }, [taskStatus])

    useFocusEffect(useCallback(() => {
        if(task.status){
          setTaskStatus(task.status)
          // setTaskStatusName(taskStatusNamesMap[task.status])
          setTaskStatusName(task.status_name)
          setTaskCTAName(taskCTANames[task.status.toLowerCase()])
          setIsTaskLive(nonLiveStatuses.indexOf(task.status) >= 0 ? false : true )
        }
      }, [task])
    )
    
    // console.log("task")
    // console.log(task)
    const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
    
    const getClassworkData = async () => {
        const reqObj: any = {classId, taskId: task.task_id}
        dispatch(getClassworkResults(reqObj))
    }
    const onPress = () => {
        
        console.log("button pressed ....")
        setShowModal4AICheckModal(true)
    }

    const cardPressed = async () => {
        console.log("card pressed ....")
        await dispatch(clearSelectedTaskData({}))
        dispatch(setSelectedTask('Classwork'))
        dispatch(setSelectedTaskId(task.task_id))
        dispatch(setSelectedTaskData(task))
        getClassworkData()
    }

    const fetchResult = () => {
      console.log(taskStatus, task.task_id)
      if(taskStatus == 'in_queue') {
        onPress()
      } else if(taskStatus.toLowerCase() != 'launching') {
        cardPressed()
      }
    }

    // useEffect(() => {
    //     // if(selectedTaskSection == 'Classwork') {
    //     //     getAttendanceData()
    //     // }

    // }, [selectedTaskSection])

    const publishQuizFun = async () => {
        setSubmitStatus(true)
        try {
          const classworkReq = {
            task_id: task.task_id
          }
          console.log(classworkReq)
          const pCWRes = await dispatch(publishClasswork(classworkReq));
          if(!pCWRes.payload.detail) {
            setShowModal4AICheckModal(false)
            await refreshTasks()
            cardPressed()
            setPublishError(null)
          } else {
            setPublishError(pCWRes.payload.detail)
          }
          setSubmitStatus(false)
        } catch(e) {
          setSubmitStatus(false)
        } finally {
          setSubmitStatus(false)
        }
          
    }
    useEffect(() => {
          if(taskStatus) {
            try {
              // let intervarid: any;
              // console.log(JSON.stringify(task.quiz_details.start_date))
              // console.log(JSON.stringify(task.quiz_details.duration))
              // const durationMinutes = task.work_detail.time;
              // const startDateString = task.work_detail.start_time;

              // Parse start date
              // const startDate: any = new Date(startDateString.replace(' ', 'T'));
      
              // Calculate end time
              // const endDate: any = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
              
      
              if(taskStatus == 'in_progress') {
                const endDate: any = new Date(task.work_detail.end_time);
      
                // Function to get remaining time
                function getTimeLeft() {
                  const now: any = new Date();
                  const timeLeftMS: any = endDate - now;
        
                  if (timeLeftMS <= 0) {
                    clearInterval(intervarid);
                    return 'Time up!';
                      
                  }
                  if(taskStatus.toLowerCase() == 'evaluated') {
                    clearInterval(intervarid);
                    return 'Time up!';
                  }
        
                  let minutes:  any = Math.floor((timeLeftMS / 1000 / 60) % 60);
                  let seconds:  any = Math.floor((timeLeftMS / 1000) % 60);
                  
                  minutes = minutes.toString().padStart(2, "0")
                  seconds = seconds.toString().padStart(2, "0")
                  // return `${minutes} min ${seconds} sec left`;
                  let tStr = ''
                  // if(minutes > 0) {
                  //   tStr = `${minutes} min`
                  // } else {
                  //   tStr = `${seconds} secs`
                  // }
                  tStr = `${minutes} : ${seconds}`
                  return `Time Left: ${tStr} `;
                }
                if(!intervarid) {
                  intervarid = setInterval(() => {
                    let timeLeft = getTimeLeft()
                    setCWStatusCheck(timeLeft);
                    if(timeLeft == 'Time up!') {
                      clearInterval(intervarid)
                    }
                  }, 1000);
                }
                
              } else {
                if(intervarid) {
                  setCWStatusCheck('');
                  clearInterval(intervarid)
                }
                
              }
            } catch (e) {
              console.log("error in start CW ....", e)
            }
            
          }
        }, [taskStatus])

    return (
      <View>
        <TouchableOpacity>
        <View style={[styles.card, {borderColor : (taskStatus == 'in_queue') ? '#21C17C' : 'lightgray', backgroundColor: isTaskLive ? Colors.primaryColor : '#fff'}]}>
            <View style={styles.headerSection}>
              <View style={[styles.imageSection, {backgroundColor: isTaskLive ? '#fff' : ''}]}>
                  <Image style={{width: 20, height: 20}} source={require('../../assets/images/ss/Note-taking.png')} />
              </View>
              {/* <View>
                <Text>CW</Text>
              </View> */}
              {/* <View style={[styles.pbutton, {backgroundColor: task.status == 'pending' ? '' : (isTaskLive ? '#fff' : 'lightgray')}]} >
                <Text style={[styles.pbuttonText]}>{task.status == 'pending' ? 'In Queue' : (!isTaskLive ? 'Completed' : 'Progress')}</Text>
              </View> */}
              <View style={{flexDirection: 'row'}}>
                <View style={[styles.pbutton, {backgroundColor: taskStatus == 'in_queue' ? Colors.primaryColor : (isTaskLive ? '#fff' : 'lightgray')}]} >
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
                        iconColor={isTaskLive ? 'black' : 'gray'} 
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
                      paddingVertical: 0,
                      paddingHorizontal: 0,
                      width: 80
                    }}
                    style={{
                      marginTop: 30, 
                      marginLeft: 15,
                    }}
                  >
                    {
                      taskStatus != 'in_queue' && 
                      <TouchableHighlight style={{ alignItems: "center" }} underlayColor='#bdedd7' onPress={() => viewTask(task.quiz_id, task.task_id)}>
                        <View
                          style={{
                            width: 80, // ✅ smaller than menu width
                            paddingVertical: 6,
                            // backgroundColor: "#f3f3f3",
                            borderRadius: 6,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text>View</Text>
                        </View>
                      </TouchableHighlight>
                    }
                    {
                      taskStatus == 'in_queue' && 
                      <TouchableHighlight style={{ alignItems: "center" }} underlayColor='#bdedd7'  onPress={() => editTask(task.task_id, task.task_type)}>
                        <View
                          style={{
                            width: 80, // ✅ smaller than menu width
                            paddingVertical: 6,
                            // backgroundColor: "#f3f3f3",
                            borderRadius: 6,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text>Edit</Text>
                        </View>
                      </TouchableHighlight>
                    }
                    {
                      taskStatus == 'in_queue' && 
                      <Divider />
                    }
                    {
                      taskStatus == 'in_queue' && 
                      <TouchableHighlight style={{ alignItems: "center" }} underlayColor='#bdedd7'  onPress={() => deleteTask(task.task_id, task.task_type)}>
                        <View
                          style={{
                            width: 80,
                            paddingVertical: 6,
                            // backgroundColor: "#fee",
                            borderRadius: 6,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text>Delete</Text>
                        </View>
                      </TouchableHighlight>
                    }
                  </Menu>
                </View>
              </View>
            </View>
            <View style={styles.taskBodySection}>
              <Text style={styles.title}>{task.title}</Text>
              {
                task.published_work_id ?
                <Text style={styles.subTitle}>{cwStatusCheck}</Text> :
                <Text style={styles.subTitle}>{''}</Text>
              }
            </View>
            {/* {
              !task.published_work_id ?
                <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{'Publish'}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : ''}]} onPress={cardPressed}>
                <Text style={styles.buttonText}>{'Results'}</Text>
                </TouchableOpacity>
            } */}
            <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : '', borderColor:  taskStatus.toLowerCase() == 'evaluated' ? 'lightgray' : Colors.primaryColor}]} onPress={fetchResult}>
              <Text style={styles.buttonText}>{taskCTAName}</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
        <Modal visible={showModal4AICheckModal} transparent animationType="fade">
            <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('../../assets/images/ss/PublishClasswork.png')} style={styles.iconImg} />
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.mainText}>Publish Classwork</Text>
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
                <TouchableOpacity style={styles.saveBtn} onPress={publishQuizFun} disabled={submitStatus}>
                    <Text style={{ color: 'white' }}>Publish</Text>
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
    // width: 173.7
    width: '48%',
    alignItems: 'center'
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
    // width: 173.7
    width: '48%',
    alignItems: 'center'
  },
  iconImg: {

  },
  mainText: {
    fontSize: 18,
    fontWeight: '600'
  },
  subText: {
    fontSize: 14,
    color: '#666',
  }
});

export default ClassWork;

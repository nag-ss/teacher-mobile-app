import { Colors } from '@/constants/Colors';
import { clearSelectedTaskData, getAITaskCheckResults, setSelectedTask, setSelectedTaskData, setSelectedTaskId } from '@/store/liveMonitoringSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TouchableHighlight } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AiCheckModal from '../Modals/Modal_4_AICheckModal';
import { addTaskToClass, getTaskStatus, launchAICheckTask } from '@/store/classSlice';
import { useFocusEffect } from '@react-navigation/native';
import { Menu, IconButton, Divider } from "react-native-paper";

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const AITask = ({task, refreshTasks, editTask, deleteTask, viewTask}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId, selectedTask} = useSelector((state: any) => state.liveMonitor)
    const {user} = useSelector((state: any) => state.user);
    const {liveClass} = useSelector((state: any) => state.classes);

    const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
    const [isTaskLive, setIsTaskLive] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [taskStatus, setTaskStatus] = useState<string>('')
    const [taskStatusName, setTaskStatusName] = useState<string>(task.status_name)
    const [taskCTAName, setTaskCTAName] = useState<string>(task.status_name)
    const [menuVisible, setMenuVisible] = useState(false);
    const taskCTANames: any = {
      "in_queue": 'Launch',
      "completed": 'Update Results',
      "evaluated": 'View Results',
      "in_progress": 'Update Results'
    }
    const nonLiveStatuses = ['in_queue', 'completed', 'evaluated']
    const statusCheckStatuses = ['in_progress', 'completed']
    const intervalTimeSec = 30
    let intervalId: any; 

    // console.log("AI task")
    // console.log(task)
    const getAttendanceData = async () => {
        const reqObj: any = {classId, taskId: task.task_id}
        dispatch(getAITaskCheckResults(reqObj))
    }
    const onPress = () => {
        
        console.log("button pressed ....")
        setShowModal4AICheckModal(true)
    }

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
      /*if(taskCTANames[taskStatusResp.status.toLowerCase()] == 'Update Results' || taskCTANames[taskStatusResp.status.toLowerCase()] == 'View Results') {
        // fetch results automatically
        dispatch(clearSelectedTaskData({}))
        cardPressed()
      }*/
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

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('AICheck'))
        dispatch(setSelectedTaskId(task.task_id))
        dispatch(setSelectedTaskData(task))
        getAttendanceData()
    }

    const fetchResult = () => {
      console.log(taskStatus, task.task_id)
      if(taskStatus == 'in_queue') {
        onPress()
      } else {
        cardPressed()
      }
    }
    // useEffect(() => {
    //     if(selectedTaskSection == 'AICheck') {
    //         getAttendanceData()
    //     }

    // }, [selectedTaskSection])

    const publishQuizFun = async () => {
          setSubmitStatus(true)
          const aiCheckReq = {
            task_id: task.task_id,
            class_schedule_id: task.class_schedule_id
          }
          const res = await dispatch(launchAICheckTask(aiCheckReq));
          console.log(res.payload)
          await refreshTasks()
          if(res.payload && res.payload.status) {
            setTaskStatus(res.payload.status)
            setSubmitStatus(false)
            setShowModal4AICheckModal(false)
          }
          
    
    }

    // useEffect(() => {
    //   if(isTaskLive) {
    //     const getTimeLeft = async () => {
    //       const taskResp = await dispatch(getTaskStatus({task_id: task.task_id}))
    //       const taskStatusResp = taskResp.payload
    //       if(taskStatusResp && taskStatusResp.status == 'completed') {
    //         clearInterval(intervarid);
    //         setIsTaskLive(false)
    //       }
    //     }

    //     const intervarid = setInterval(() => {
    //       getTimeLeft()
          
    //     }, 2000);
    //   }
    // }, [isTaskLive])

    useFocusEffect(useCallback(() => {
        if(task.status != 'pending' && task.status != 'completed'){
          console.log("came here tooo .....")
          // setIsTaskLive(true)
        }
      }, [])
    )

    useEffect(() => {
      if(task.status != 'pending' && task.status != 'completed'){
        console.log("came here ......")
        // setIsTaskLive(true)
      }
    }, [task.status])

    
    return (
      <View>
        <TouchableOpacity>
        <View style={[styles.card, {borderColor : (taskStatus == 'in_queue') ? '#21C17C' : 'lightgray', backgroundColor: isTaskLive ? Colors.primaryColor : '#fff'}]}>
            <View style={styles.headerSection}>
              <View style={styles.imageSection}>
                  <Image style={{width: 20, height: 20}} source={require('../../assets/images/tasks/AI_task.png')} />
              </View>
              {/* <View>
                <Text style={{fontSize: 10}}>AI Check</Text>
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
              <Text style={styles.subTitle}>{''}</Text>
              {/* <Text style={styles.subTitle}>{'Time Left: 12:45 Mins'}</Text> */}
            </View>
            
            {/* {
              task.status == 'pending' ?
                <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{'Check'}</Text>
                </TouchableOpacity>
                : (task.status == 'completed' ?
                <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : ''}]} onPress={cardPressed}>
                <Text style={styles.buttonText}>{'Results'}</Text>
                </TouchableOpacity>
                : <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : ''}]} >
                  <Text style={styles.buttonText}>{'Evaluating ...'}</Text>
                </TouchableOpacity>)
            } */}
            <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : ''}]} onPress={fetchResult}>
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
                    <Text style={styles.mainText}>Publish AI Check</Text>
                    <Text style={styles.subText}>Are you sure you want to proceed?</Text>
                </View>
                </View>
                <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal4AICheckModal(false)}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={publishQuizFun}>
                    <Text style={{ color: 'white' }}>{taskCTAName}</Text>
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
    fontSize: 14, fontWeight: '600', 
    height: 60
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
  
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageSection: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 5,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center'
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

export default AITask;

import { Colors } from '@/constants/Colors';
import { getAITaskCheckResults, setSelectedTask, setSelectedTaskData, setSelectedTaskId } from '@/store/liveMonitoringSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AiCheckModal from '../Modals/Modal_4_AICheckModal';
import { addTaskToClass, getTaskStatus, launchAICheckTask } from '@/store/classSlice';
import { useFocusEffect } from '@react-navigation/native';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const AITask = ({task, refreshTasks}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId} = useSelector((state: any) => state.liveMonitor)
    const {user} = useSelector((state: any) => state.user);
    const {liveClass} = useSelector((state: any) => state.classes);

    const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
    const [isTaskLive, setIsTaskLive] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);

    const getAttendanceData = async () => {
        const reqObj: any = {classId, taskId: task.task_id}
        dispatch(getAITaskCheckResults(reqObj))
    }
    const onPress = () => {
        
        console.log("button pressed ....")
        setShowModal4AICheckModal(true)
    }

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('AICheck'))
        dispatch(setSelectedTaskId(task.task_id))
        dispatch(setSelectedTaskData(task))
        getAttendanceData()
    }
    // useEffect(() => {
    //     if(selectedTaskSection == 'AICheck') {
    //         getAttendanceData()
    //     }

    // }, [selectedTaskSection])

    const publishQuizFun = async () => {
          setSubmitStatus(true)
          const classworkReq = {
            task_id: task.task_id,
            class_schedule_id: task.class_schedule_id
          }
          await dispatch(launchAICheckTask(classworkReq));
          await refreshTasks()
          setSubmitStatus(false)
          setShowModal4AICheckModal(false)
    
    }

    useEffect(() => {
      if(isTaskLive) {
        const getTimeLeft = async () => {
          const taskResp = await dispatch(getTaskStatus({task_id: task.task_id}))
          const taskStatusResp = taskResp.payload
          if(taskStatusResp && taskStatusResp.status == 'completed') {
            clearInterval(intervarid);
            setIsTaskLive(false)
          }
        }

        const intervarid = setInterval(() => {
          getTimeLeft()
          
        }, 2000);
      }
    }, [isTaskLive])

    useFocusEffect(useCallback(() => {
        if(task.status != 'pending' && task.status != 'completed'){
          console.log("came here tooo .....")
          setIsTaskLive(true)
        }
      }, [])
    )

    useEffect(() => {
      if(task.status != 'pending' && task.status != 'completed'){
        console.log("came here ......")
        setIsTaskLive(true)
      }
    }, [task.status])

    return (
      <View>
        <TouchableOpacity onPress={cardPressed}>
        <View style={[styles.card, {borderColor : (selectedTaskSection == 'AICheck' && selectedTaskId == task.task_id) ? '#21C17C' : 'lightgray', backgroundColor: isTaskLive ? Colors.primaryColor : '#fff'}]}>
            <View style={styles.headerSection}>
              <View style={styles.imageSection}>
                  <Image style={{width: 20, height: 20}} source={require('../../assets/images/ss/Note-taking.png')} />
              </View>
              <View style={[styles.pbutton, {backgroundColor: task.status == 'pending' ? '#fff' : (isTaskLive ? '#fff' : 'lightgray')}]} >
                <Text style={[styles.pbuttonText]}>{task.status == 'pending' ? 'In Queue' : 'Completed'}</Text>
              </View>
            </View>
            <View style={styles.taskBodySection}>
              <Text style={styles.title}>{task.title}</Text>
              <Text style={styles.subTitle}>{''}</Text>
              {/* <Text style={styles.subTitle}>{'Time Left: 12:45 Mins'}</Text> */}
            </View>
            
            {
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
            }
            {/* <TouchableOpacity style={styles.button} onPress={cardPressed}>
            <Text style={styles.buttonText}>{task.task_type == 'AICheck' ? 'Check' : 'Publish'}</Text>
            </TouchableOpacity> */}
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
                    <Text style={{ color: 'white' }}>{submitStatus ? 'Evaluating ...' : 'Publish'}</Text>
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
    fontSize: 20
  },
  subText: {
    fontSize: 16
  }
});

export default AITask;

import { Colors } from '@/constants/Colors';
import { getClassworkResults, setSelectedTask, setSelectedTaskId } from '@/store/liveMonitoringSlice';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AiCheckModal from '../Modals/Modal_4_AICheckModal';
import { addTaskToClass, publishClasswork } from '@/store/classSlice';
import moment from 'moment-timezone';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const ClassWork = ({task, refreshTasks}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId} = useSelector((state: any) => state.liveMonitor)
    const {user} = useSelector((state: any) => state.user);
    const {liveClass} = useSelector((state: any) => state.classes);
    const [cwStatusCheck, setCWStatusCheck] = useState('');
    const [isTaskLive, setIsTaskLive] = useState(false);

    console.log("task")
    console.log(task)
    const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
    
    const getClassworkData = async () => {
        const reqObj: any = {classId, taskId: task.task_id}
        dispatch(getClassworkResults(reqObj))
    }
    const onPress = () => {
        
        console.log("button pressed ....")
        setShowModal4AICheckModal(true)
    }

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('Classwork'))
        dispatch(setSelectedTaskId(task.task_id))
        getClassworkData()
    }
    useEffect(() => {
        // if(selectedTaskSection == 'Classwork') {
        //     getAttendanceData()
        // }

    }, [selectedTaskSection])

    const publishQuizFun = async () => {

          const classworkReq = {
            task_id: task.task_id
          }
          console.log(classworkReq)
          await dispatch(publishClasswork(classworkReq));
          await refreshTasks()
          setShowModal4AICheckModal(false)
    
    }
    
    useEffect(() => {
          if(task.published_work_id) {
            // console.log(JSON.stringify(task.quiz_details.start_date))
            // console.log(JSON.stringify(task.quiz_details.duration))
            const durationMinutes = task.work_detail.time;
            const startDateString = task.work_detail.start_time;

            // Parse start date
            const startDate: any = new Date(startDateString.replace(' ', 'T'));
    
            // Calculate end time
            // const endDate: any = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
            const endDate: any = new Date(task.work_detail.end_time);
    
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
    
              // return `${minutes} min ${seconds} sec left`;
              let tStr = ''
              if(minutes > 0) {
                tStr = `${minutes} min`
              } else {
                tStr = `${seconds} secs`
              }
              return `Time Left: ${tStr} `;
            }
    
            const intervarid = setInterval(() => {
              let timeLeft = getTimeLeft()
              setCWStatusCheck(timeLeft);
              if(task.status == 'in_progress' && timeLeft != 'Time up!') {
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
        <View style={[styles.card, {borderColor : (selectedTaskSection == 'Classwork' && selectedTaskId == task.task_id) ? '#21C17C' : 'lightgray', backgroundColor: isTaskLive ? Colors.primaryColor : ''}]}>
            <View style={styles.headerSection}>
              <View style={[styles.imageSection, {backgroundColor: isTaskLive ? '#fff' : ''}]}>
                  <Image style={{width: 20, height: 20}} source={require('../../assets/images/ss/Note-taking.png')} />
              </View>
              <View style={[styles.pbutton, {backgroundColor: task.status == 'pending' ? '' : (isTaskLive ? '#fff' : 'lightgray')}]} >
                <Text style={[styles.pbuttonText]}>{task.status == 'pending' ? 'In Queue' : (!isTaskLive ? 'Completed' : 'Progress')}</Text>
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
            {
              !task.published_work_id ?
                <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{'Publish'}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={[styles.button, {backgroundColor: isTaskLive ? '#fff' : ''}]} onPress={cardPressed}>
                <Text style={styles.buttonText}>{'Results'}</Text>
                </TouchableOpacity>
            }
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
                <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal4AICheckModal(false)}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={publishQuizFun}>
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
    fontSize: 20
  },
  subText: {
    fontSize: 16
  }
});

export default ClassWork;

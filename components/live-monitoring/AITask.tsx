import { Colors } from '@/constants/Colors';
import { getAITaskCheckResults, setSelectedTask, setSelectedTaskData, setSelectedTaskId } from '@/store/liveMonitoringSlice';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AiCheckModal from '../Modals/Modal_4_AICheckModal';
import { addTaskToClass } from '@/store/classSlice';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const AITask = ({task}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId} = useSelector((state: any) => state.liveMonitor)
    const {user} = useSelector((state: any) => state.user);
    const {liveClass} = useSelector((state: any) => state.classes);

    console.log("task")
    console.log(task)
    const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
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
        dispatch(setSelectedTask('AI Task'))
        dispatch(setSelectedTaskId(task.task_id))
        dispatch(setSelectedTaskData(task))
        getAttendanceData()
    }
    useEffect(() => {
        if(selectedTaskSection == 'AI Task') {
            getAttendanceData()
        }

    }, [selectedTaskSection])

    
    return (
      <View>
        <TouchableOpacity onPress={cardPressed}>
        <View style={[styles.card, {borderColor : (selectedTaskSection == 'AI Task' && selectedTaskId == task.task_id) ? '#21C17C' : 'lightgray'}]}>
            <View style={styles.headerSection}>
              <View style={styles.imageSection}>
                  <Image style={{width: 20, height: 20}} source={require('../../assets/images/ss/Note-taking.png')} />
              </View>
              <View style={[styles.pbutton, {backgroundColor: Colors.primaryColor}]} >
                <Text style={[styles.pbuttonText]}>{'Progress'}</Text>
              </View>
            </View>
            <View style={styles.taskBodySection}>
              <Text style={styles.title}>{task.title}</Text>
              <Text style={styles.subTitle}>{''}</Text>
              {/* <Text style={styles.subTitle}>{'Time Left: 12:45 Mins'}</Text> */}
            </View>
            
            <TouchableOpacity style={styles.button} onPress={cardPressed}>
            <Text style={styles.buttonText}>{task.task_type == 'AICheck' ? 'Check' : 'Publish'}</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
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
  }
});

export default AITask;

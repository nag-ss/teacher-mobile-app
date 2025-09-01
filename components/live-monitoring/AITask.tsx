import { Colors } from '@/constants/Colors';
import { getAITaskCheckResults, setSelectedTask, setSelectedTaskId } from '@/store/liveMonitoringSlice';
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
        const reqObj: any = {classId}
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
            <View style={styles.imageSection}>
                <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/Note-taking.png')} />
            </View>
            <Text style={styles.title}>{task.title}</Text>
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
  }
});

export default AITask;

import { Colors } from '@/constants/Colors';
import { getSlipTestResults, setSelectedTask, setSelectedTaskData, setSelectedTaskId } from '@/store/liveMonitoringSlice';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ClassPrep from '../dashboard/ClassPrep';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const SlipTest = ({task}: any) => {
    const [isPressed, setIsPressed] = useState(false);
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId, selectedTaskId} = useSelector((state: any) => state.liveMonitor)
    const { liveClass } = useSelector((state: any) => state.classes)
    const classPrepRef = useRef<any>();
    
    const onPress = () => {
        // getAttendanceData()
        console.log("button pressed ....")
        setIsPressed(true)
        classPrepRef.current?.setSelectedClass()
    }

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('Slip Test'))
        dispatch(setSelectedTaskId(task.task_id))
        dispatch(setSelectedTaskData(task))
    }
    useEffect(() => {
        if(selectedTaskSection == 'Slip Test') {
            // getAttendanceData()
        }

    }, [selectedTaskSection])

    const updateTopicSubTopic = () => {
      
    }
    return (
      <View>
        <TouchableOpacity onPress={cardPressed}>
        <View style={[styles.card, {borderColor : (selectedTaskSection == 'Slip Test' && selectedTaskId == task.task_id) ? '#21C17C' : 'lightgray'}]}>
            <View style={styles.imageSection}>
                <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/MileStone.png')} />
            </View>
            <Text style={styles.title}>{'Tasks'}</Text>
            <TouchableOpacity style={[styles.button, {backgroundColor: isPressed ? Colors.primaryColor : ''}]} 
                onPress={onPress}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
            >
            <Text style={[styles.buttonText, {color: isPressed ? '#fff' : '#000' }]}>{'Add Task'}</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
        {/* To be fixed */}
        <ClassPrep item={{}} selectedClass={liveClass} ref={classPrepRef} updateTopicSubTopic={updateTopicSubTopic} />
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

export default SlipTest;

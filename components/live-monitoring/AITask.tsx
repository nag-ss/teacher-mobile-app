import { Colors } from '@/constants/Colors';
import { getAITaskCheckResults, setSelectedTask } from '@/store/liveMonitoringSlice';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const AITask = () => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId} = useSelector((state: any) => state.liveMonitor)
    const getAttendanceData = async () => {
        const reqObj: any = {classId}
        dispatch(getAITaskCheckResults(reqObj))
    }
    const onPress = () => {
        getAttendanceData()
        console.log("button pressed ....")
    }

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('AI Task'))
    }
    useEffect(() => {
        if(selectedTaskSection == 'AI Task') {
            getAttendanceData()
        }

    }, [selectedTaskSection])
    return (
        <TouchableOpacity onPress={cardPressed}>
        <View style={[styles.card, {borderColor : selectedTaskSection == 'AI Task' ? 'green' : 'lightgray'}]}>
            <View style={styles.imageSection}>
                <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/Note-taking.png')} />
            </View>
            <Text style={styles.title}>{'Ratios Problem'}</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{'Publish'}</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginHorizontal: 8,
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

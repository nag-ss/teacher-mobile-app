import { Colors } from '@/constants/Colors';
import { getSlipTestResults, setSelectedTask } from '@/store/liveMonitoringSlice';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const SlipTest = () => {
    const [isPressed, setIsPressed] = useState(false);
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId} = useSelector((state: any) => state.liveMonitor)
    const getAttendanceData = async () => {
        const reqObj: any = {classId}
        dispatch(getSlipTestResults(reqObj))
    }
    const onPress = () => {
        getAttendanceData()
        console.log("button pressed ....")
    }

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('Slip Test'))
    }
    useEffect(() => {
        if(selectedTaskSection == 'Slip Test') {
            getAttendanceData()
        }

    }, [selectedTaskSection])
    return (
        <TouchableOpacity onPress={cardPressed}>
        <View style={[styles.card, {borderColor : selectedTaskSection == 'Slip Test' ? 'green' : 'lightgray'}]}>
            <View style={styles.imageSection}>
                <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/MileStone.png')} />
            </View>
            <Text style={styles.title}>{'Slip Test'}</Text>
            <TouchableOpacity style={[styles.button]} 
                onPress={onPress}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
            >
            <Text style={[styles.buttonText, {color: isPressed ? '#fff' : '#000' }]}>{'Add Task'}</Text>
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

export default SlipTest;

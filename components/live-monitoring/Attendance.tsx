import { Colors } from '@/constants/Colors';
import { getAttendance, setSelectedTask, setSelectedTaskData } from '@/store/liveMonitoringSlice';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const Attendance = () => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId} = useSelector((state: any) => state.liveMonitor)
    const getAttendanceData = async () => {
        const reqObj: any = {classId}
        dispatch(getAttendance(reqObj))
    }
    const onPress = () => {
        dispatch(setSelectedTask('Attendance'))
        dispatch(setSelectedTaskData(null))
        getAttendanceData()
        console.log("button pressed ....")
    }

    const cardPressed = () => {
        console.log("card pressed ....")
        dispatch(setSelectedTask('Attendance'))
    }
    useEffect(() => {
        if(selectedTaskSection == 'Attendance') {
            getAttendanceData()
        }

    }, [selectedTaskSection])
    return (
        <TouchableOpacity onPress={cardPressed}>
        <View style={[styles.card, {borderColor : selectedTaskSection == 'Attendance' ? '#21C17C' : 'lightgray'}]}>
            <View style={styles.imageSection}>
                <Image style={{width: 20, height: 20}} source={require('../../assets/images/ss/MileStone.png')} />
            </View>
            
            <View style={styles.taskBodySection}>
              <Text style={styles.title}>{'View Notebook'}</Text>
              <Text style={styles.subTitle}>{''}</Text>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text style={styles.buttonText}>{'Activate'}</Text>
            </TouchableOpacity>
        </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  card: {
    width: 165,
    // height: 185,
    // marginHorizontal: 8,
    // marginRight: 16,
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
    // width: 130,
    width: '100%',
    alignItems: 'center',
    marginTop: 9.14
  },
  buttonText: { fontWeight: '600' },
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
});

export default Attendance;

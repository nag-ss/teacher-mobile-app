import { Colors } from '@/constants/Colors';
import { getAITaskCheckResults, setSelectedTask } from '@/store/liveMonitoringSlice';
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

const AICheckSummary = ({task}: any) => {
    const dispatch = useDispatch<any>()
    const { selectedTaskSection, classId} = useSelector((state: any) => state.liveMonitor)
    
    const getAttendanceData = async () => {
        const reqObj: any = {classId}
        dispatch(getAITaskCheckResults(reqObj))
    }
    
    useEffect(() => {
        if(selectedTaskSection == 'AI Task') {
            // getAttendanceData()
        }

    }, [selectedTaskSection])

    // if(selectedTaskSection == 'AI Task') {
        return (
            <View style={{width: '100%'}}>
              <View style={[styles.card]}>
                  <View style={{width: '22%'}}>
                      <Text style={styles.title}>{'AI Check Summary - '}</Text>
                  </View>
                  <View  style={{width: '78%'}}>
                      <Text style={styles.subTitle}>{'Student engagement is 85%, with 3 students flagged for incomplete work. Overall class performance is stable. - 10:45 AM'}</Text>
                  </View>
              </View>
            </View>
          )
    // } else {
    //     return (null)
    // }
    
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    // width: 140,
    // marginHorizontal: 8,
    padding: 18.28,
    backgroundColor: '#fff',
    borderRadius: 10,
    // alignItems: 'center',
    // elevation: 2,
    borderWidth: 1,
    borderColor: 'lightgray',
    marginBottom: 16
  },
  title: { fontSize: 14, fontWeight: '600'},
    
  subTitle: {
    fontSize: 10,
    marginTop: 3
  }
});

export default AICheckSummary;

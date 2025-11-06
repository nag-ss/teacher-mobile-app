import { Colors } from '@/constants/Colors';
import { getAITaskCheckResults, getTaskSummary, setSelectedTask } from '@/store/liveMonitoringSlice';
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
    const { selectedTaskSection, classId, selectedTask, taskSummary} = useSelector((state: any) => state.liveMonitor)
    
    const getSummaryData = async () => {
      console.log("calling req for summary api ....")
        const reqObj: any = {
          task_id: selectedTask.task_id,
          class_schedule_id: selectedTask.class_schedule_id
        }
        console.log(reqObj)
        dispatch(getTaskSummary(reqObj))
    }
    
    useEffect(() => {
        if(selectedTaskSection == 'AI Task') {
            // getAttendanceData()
        }

    }, [selectedTaskSection])

    useEffect(() => {
      if(selectedTask && selectedTask.task_id) {
        getSummaryData()
      }
    },  [selectedTask])

    // if(selectedTaskSection == 'AI Task') {
        return (
            <View style={{width: '100%'}}>
              {taskSummary ? 
              <View style={[styles.card]}>
                  <View style={{width: '23%'}}>
                      <Text style={styles.title}>{taskSummary.name+' - '}</Text>
                  </View>
                  <View  style={{width: '77%'}}>
                      <Text style={styles.subTitle}>{taskSummary.summary}</Text>
                  </View>
              </View>
              : null
              }
              
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
    padding: 13.7,
    backgroundColor: '#fff',
    borderRadius: 10,
    // alignItems: 'center',
    // elevation: 2,
    // borderWidth: 1,
    borderColor: 'lightgray',
    marginBottom: 13.7
  },
  title: { fontSize: 14, fontWeight: '600'},
    
  subTitle: {
    fontSize: 10,
    marginTop: 3
  }
});

export default AICheckSummary;

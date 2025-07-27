import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import AttendanceMonitoring from './AttendanceMonitoring';
import AITask from './AITask';
import Quiz from './Quiz';
import SlipTest from './SlipTest';
import Attendance from './Attendance';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherClassTasks } from '@/store/classSlice';
import { useFocusEffect } from '@react-navigation/native';

const tasks = [
  { title: 'Attendance Monitoring', action: 'Check' },
  { title: 'Attendance Monitoring', action: 'Check' },
  { title: 'Ratios Problem', action: 'Publish' },
  { title: 'Quiz 1', action: 'Start' },
  { title: '', action: 'Add Task' },
];

const TaskSection = () => {
  const dispatch = useDispatch<any>()
  const { liveClass, classTimeline, classTasks } = useSelector((state: any) => state.classes);
  const [tasks, setTasks] = useState<any>([])
  const attendanceTask = {
    "id": "Attendance",
    "task_type": "Attendance"
  }
  const addTaskCard = {
    "id": "AddTask",
    "task_type": "AddTask"
  }
  
  console.log("classTasks")
  console.log(classTasks)
  const getTasksListData = async () => {
    let reqObj: any = {
      class_schedule_id : liveClass.class_schedule_id,
      teacher_id: liveClass.teacher_id,
      division_id: liveClass.division_id,
      subject_id: liveClass.subject_id

    }
    console.log("calling tasks from home ")
    console.log(reqObj)
    await dispatch(getTeacherClassTasks(reqObj))
  }
  
  /*useEffect(() => {
    getTasksListData()
  }, [])*/

  useFocusEffect(useCallback(() => {
      getTasksListData()
    }, [])
    )

  useEffect(() => {
    if(classTasks && classTasks.length) {
      const tasksList = [attendanceTask, ...classTasks, addTaskCard];
      setTasks(tasksList)
    } else {
      const tasksList = [attendanceTask, addTaskCard];
      setTasks(tasksList)
    }

  }, [classTasks])

  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      currentIndex.current = index;
    }
  };

  const handleScrollLeft = () => {
    const newIndex = Math.max(currentIndex.current - 1, 0);
    scrollToIndex(newIndex);
  };

  const handleScrollRight = () => {
    const newIndex = Math.min(currentIndex.current + 1, tasks.length - 1);
    scrollToIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Tasks</Text>
        <View style={styles.cardsContainer}>
            {/* <Attendance /> */}
            {/* <AttendanceMonitoring />
            <AITask />
            <Quiz />
            <SlipTest /> */}
            <TouchableOpacity onPress={handleScrollLeft} style={styles.arrow}>
              <Image style={{width: 30, height: 30}} source={require('../../assets/images/ss/left-arrow-small.png')} />
            </TouchableOpacity>
            {
              (tasks && tasks.length) ? 
              <FlatList
              ref={flatListRef}
              data={tasks}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
              keyExtractor={(item: any) => item.id}
              renderItem={
                ({ item }) => {
                  if(item.task_type == 'AICheck') {
                    return (<AITask task={item} /> )
                  } else if(item.task_type == 'Classwork') {
                    return (<AITask task={item} /> )
                  } else if(item.task_type == 'SlipTest') {
                    return (<Quiz task={item} /> )
                  } else if(item.task_type == 'Attendance') {
                    return (<Attendance /> )
                  } else if(item.task_type == 'AddTask') {
                    return (<SlipTest /> )
                  } else {
                    return ( null )
                  }
                  
                }
              
            }
            /> : null
            }
            <TouchableOpacity onPress={handleScrollRight} style={styles.arrow}>
            <Image style={{width: 30, height: 30}} source={require('../../assets/images/ss/right-arrow-small.png')} />
            </TouchableOpacity>
            
        </View>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, 
    paddingVertical: 10, 
    paddingHorizontal: 5,
    backgroundColor: '#fff'},
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cardsContainer: {
    flexDirection: 'row'
  },
  arrow: {
    padding: 8,
    justifyContent: 'center'
  },
  arrowText: {
    fontSize: 24,
  }
});

export default TaskSection;

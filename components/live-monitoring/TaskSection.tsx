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
import ClassWork from './ClassWork';
import { Colors } from '@/constants/Colors';
import ClassPrep from '../dashboard/ClassPrep';

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
  const [isPressed, setIsPressed] = useState(false);
      
  const [tasks, setTasks] = useState<any>([])
  const attendanceTask = {
    "id": "Attendance",
    "task_type": "Attendance",
    "task_id": 1
  }
  const addTaskCard = {
    "id": "AddTask",
    "task_type": "AddTask"
  }
  
  const classPrepRef = useRef<any>();
      
  const onPress = () => {
      // getAttendanceData()
      setIsPressed(true)
      // classPrepRef.current?.setLiveMonitorFlag()
      classPrepRef.current?.setSelectedClass(true)
  }
  const getTasksListData = async () => {
    let reqObj: any = {
      class_schedule_id : liveClass.class_schedule_id,
      teacher_id: liveClass.teacher_id,
      division_id: liveClass.division_id,
      subject_id: liveClass.subject_id

    }
    console.log("calling tasks from home *********************")
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
      const tasksList = [attendanceTask, ...classTasks];
      setTasks(tasksList)
    } else {
      const tasksList = [attendanceTask];
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

  const updateTopicSubTopic = () => {

  }

  const editTaskFun = (taskId: number, taskType: string) => {
    classPrepRef.current?.editTask(taskId, taskType, true)
  }
  const deleteTaskFun = (taskId: number, taskType: string) => {
    classPrepRef.current?.editTask(taskId, taskType)
  }

  const viewTaskFun = (quizId: number, taskId: number) => {
    classPrepRef.current?.viewQuiz(quizId, taskId)
  }

  const viewTaskFn = (quizId: number, taskId: number) => {
    // classPrepRef.current?.viewTask(quizId, taskId)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>AI Tasks</Text>
        <TouchableOpacity style={[styles.button, {backgroundColor: isPressed ? Colors.primaryColor : ''}]} 
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
         <Text style={[styles.buttonText, {color: isPressed ? '#fff' : '#000' }]}>{'Add Task'}</Text>
        </TouchableOpacity>
      </View>
      
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
              keyExtractor={(item: any) => item.task_id.toString()}
              renderItem={
                ({ item }) => {
                  if(item.task_type == 'AICheck') {
                    return (<AITask task={item} refreshTasks={getTasksListData} editTask={editTaskFun} deleteTask={deleteTaskFun}  viewTask={viewTaskFn} /> )
                  } else if(item.task_type == 'Classwork') {
                    return (<ClassWork task={item} refreshTasks={getTasksListData} editTask={editTaskFun} deleteTask={deleteTaskFun} viewTask={viewTaskFn} /> )
                  } else if(item.task_type == 'SlipTest') {
                    return (<Quiz task={item} refreshTasks={getTasksListData} editTask={editTaskFun} deleteTask={deleteTaskFun} viewTask={viewTaskFun} /> )
                  } else if(item.task_type == 'Attendance') {
                    return (<Attendance /> )
                  } else {
                    return ( <View /> )
                  }
                  
                }
              
            }
            /> : null
            }
            <TouchableOpacity onPress={handleScrollRight} style={styles.arrow}>
            <Image style={{width: 30, height: 30}} source={require('../../assets/images/ss/right-arrow-small.png')} />
            </TouchableOpacity>
            
        </View>
        <ClassPrep item={{}} selectedClass={liveClass} ref={classPrepRef} updateTopicSubTopic={updateTopicSubTopic} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginTop: 13.7,
    marginBottom: 16, 
    // paddingVertical: 10, 
    // paddingHorizontal: 5,
    padding: 13.7,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cardsContainer: {
    flexDirection: 'row',
    // paddingHorizontal: 18.28,
  },
  arrow: {
    paddingRight: 8,
    justifyContent: 'center'
  },
  arrowText: {
    fontSize: 24,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    // paddingHorizontal: 18.28,
    // paddingTop: 9.14,
    paddingBottom: 9.14
  },
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
});

export default TaskSection;

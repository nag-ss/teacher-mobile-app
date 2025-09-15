// Prep Class page 2

import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView
} from 'react-native';
import UploadMaterialsCard from '../PrepClass/UploadMaterial';
import TaskItem from '../PrepClass/TaskItem';
import SvgLoader from '@/utils/SvgLoader';
import QuickActions from '../dashboard/QuickActions';
// import {Tasks} from '../../data/Tasks';

const calendar_month_icon = require('../../assets/images/modal/calendar_month.png');
const action_icon = require('../../assets/images/actions_icon.png');

const { width } = Dimensions.get('window');
interface ClassTaskCardPopProps { 
  topic: string; 
  subTopic: string; 
  visible: boolean; 
  classTasks: any[];
  selectedClass:any; 
  onClose: () => void;
  goBack: () => void;
  addTask: () => void;
  deleteTask: (task_id: number, task_type: string) => void;
  editTask: (task_id: number, task_type: string) => void;
  viewQuiz: (quiz_id: number) => void;
}

// const tasks = [
//   { id:1, icon: '📄', title: 'Covalent Bond Worksheet', category: 'Classwork' },
//   { id:2, icon: '🧪', title: 'Periodic Table', category: 'Quiz' },
//   { id:3, icon: '📄', title: 'Upload Notes on Hydrogen Bonds', category: 'Classwork' },
//   { id:4, icon: '🎯', title: 'Student Engagement', category: 'AI Check' },
//   { id:5, icon: '🎯', title: 'Student Engagement', category: 'AI Check' },
// ];

const mapper: any = {
  SlipTest: "Slip Test",
  Quiz: "Quiz",
  Classwork: "Classwork",
  AICheck: "AI Check"
}

const ClassTaskCardPop = ({ topic, subTopic, visible, selectedClass, classTasks, onClose, goBack, addTask, deleteTask, editTask, viewQuiz }: ClassTaskCardPopProps) => {
  const tasksCount = classTasks.length;
  const [selectedTaskId, setSelectedTaskId] = useState(0)
  // const tasksCount = Tasks.length;
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <TouchableOpacity onPress={goBack}>
                  <Image source={require('../../assets/images/back-icon.png')} style={styles.icon} />
                </TouchableOpacity>  
                <Text style={styles.sectionTitle}>{selectedClass?.division_name} - Section {selectedClass?.section_name}</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            {/* Topic */}
            <View style={styles.topicContainer}>
              <View style={styles.topicRow}>
                <Text style={{fontSize: 16}}>Topic - </Text>
                <Text style={styles.topicText}>{topic}</Text>
              </View>
              <View style={styles.topicRow}>
                <Text style={{fontSize: 16}}>Sub Topic - </Text>
                <Text style={styles.topicText}>{subTopic}</Text>
              </View>
              
              
              <TouchableOpacity style={styles.editButton} onPress={goBack}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* AI Assistant Text */}
            <View style={styles.aiAssistantContainer}>
              <View style={styles.aiTextContainer}>
                <Text style={styles.aiTitle}>Your AI-Powered Assistant</Text>
                <Text style={styles.aiSubtitle}>
                  Let AI handle the heavy lifting — create assignments, tests, and classwork in seconds.
                </Text>
              </View>

              {/* AI Assistant Image */}
              <View style={styles.aiImageContainer}>
                <Image
                  source={require('../../assets/images/AI_Assistant_large.png')} // Replace with your actual image path
                  style={styles.aiAssistant}
                  resizeMode="contain"
                />
              </View>

              <ScrollView style={{ padding: 10, maxHeight: 450}}>
                {
                  (classTasks.length > 0) ? (
                    <View style={styles.taskTable}>
                      <View style={{display: 'flex', flexDirection: 'row', paddingBottom: 10, borderBottomWidth: 0.5}}>
                        <Text style={{width: 50, textAlign: 'center'}}>Icon</Text>
                        <Text style={{width: 260, textAlign: 'center'}}>Title</Text>
                        <Text style={{width: 250, textAlign: 'center'}}>Category</Text>
                        <Text style={{width: 50, textAlign: 'center'}}>Action</Text>
                      </View>
                      {/* <FlatList
                        data={classTasks}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item, index }) => (<TaskItem item={item} index={index} tasksCount={tasksCount} key={item.task_id} deleteTask={deleteTask} editTask={editTask} viewQuiz={viewQuiz} />)}
                      /> */}
                      {classTasks.map((task, i) => {
                        return (<TaskItem noTasks={classTasks.length} noTask={i} item={task} index={task.task_id} key={task.task_id} deleteTask={deleteTask} editTask={editTask} viewQuiz={viewQuiz} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} />)
                      })}

                    </View>
                  ) : (
                    <View>
                      <Text style={styles.aiSubtitle}> No tasks yet! Start by adding a task.</Text>
                    </View>
                    
                  )
                }
              </ScrollView>

              {/* Add Task */}
              <View style={styles.addTaskContainer}>
                <TouchableOpacity onPress={addTask} style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ Add a Task</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Quick Actions */}
            {/* <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.quickCards}>
                <UploadMaterialsCard title='Upload Material' />
                <UploadMaterialsCard title='Home Work'/>
                <UploadMaterialsCard title='Assignment'/>
              </View>
            </View> */}
            
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ClassTaskCardPop;



const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeIcon:{
    width: 24,
    height: 24
  },
  icon: {
    width: 16,
    height: 16,
  },
  aiAssistant: {
    width: 200,
    height: 200,
  },
  topicContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 6,
  },
  topicRow: {
    flexDirection: 'row',
  },
  topicText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#21c17c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#64748B',
    fontSize: 16,
  },
  aiAssistantContainer: {
    backgroundColor: 'white', 
    marginTop: 20, 
    paddingBottom: 20, 
    borderRadius: 10
  },
  aiTextContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  aiSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10
  },
  aiImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  aiImage: {
    width: 200,
    height: 200,
  },
  taskTable: {
    borderWidth: 1,
    paddingTop: 10,
    borderRadius: 10,
    borderColor: 'grey',
  },
  addTaskContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#21C17C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActions: {
    marginTop: 30,
    backgroundColor: 'white'
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 16,
  },
  quickCards: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
  },
  cardPlaceholder: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: 100,
    alignItems: 'center',
    elevation: 2,
  },
});

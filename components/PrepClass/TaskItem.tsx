import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Pressable
} from 'react-native';

const calendar_month_icon = require('../../assets/images/modal/calendar_month.png');
const action_icon = require('../../assets/images/actions_icon.png');
const quiz_icon = require('../../assets/images/ss/quiz-2.png');
// const new_classwork_icon = require('../../assets/images/book_48dp.png');
// const new_aicheck_icon = require('../../assets/images/AI_Check_48dp.png');
// const new_quiz_icon = require('../../assets/images/Test_48dp.png');
const classwork_icon = require('../../assets/images/ss/description.png');
const ai_check_icon = require('../../assets/images/ss/flag-3.png');

const { width } = Dimensions.get('window');

const taskTypes = ['AICheck', 'Classwork', 'SlipTest'];

const mapper: any = {
  SlipTest: "Slip Test",
  Quiz: "Quiz",
  Classwork: "Classwork",
  AICheck: "AI Check"
}

const iconMapper: any = {
  SlipTest: quiz_icon,
  Quiz: quiz_icon,
  Classwork: classwork_icon,
  AICheck: ai_check_icon
}

interface TaskItemProps {
  item: any;
  index: number;
  noTasks: number;
  noTask: number;
  selectedTaskId: number;
  viewQuiz: (quiz_id: number, task_id: number) => void;
  deleteTask: (id: number, type: string) => void;
  editTask: (id: number, type: string) => void;
  setSelectedTaskId: (id: number) => void;
};

const TaskItem = ({item, noTasks, noTask, index, deleteTask, editTask, viewQuiz, setSelectedTaskId, selectedTaskId}: TaskItemProps) => {
  const [taskOptionsVisible, setTaskOptionsVisible] = useState(false);
  const isLastItem = noTask === noTasks - 1;
  const setTaskOptionsVisibleOption = () => {
    setTaskOptionsVisible(!taskOptionsVisible)
    setSelectedTaskId(item.task_id)
  }

  const isEditVisible = () => {
    const {task_type, published_quiz_id, published_work_id} = item; 
    if (task_type == "AICheck" || task_type == "Classwork") {
      return true;
    } else if (task_type == "SlipTest") {
      return !published_quiz_id;
    }
    return false;
  }

  const isDeleteVisible = () => {
    const {task_type, published_quiz_id, published_work_id} = item; 
    if (task_type == "AICheck") {
      return true;
    } else if (task_type == "Classwork") {
      return !published_work_id;
    } else if (task_type == "SlipTest") {
      return !published_quiz_id;
    }
    return false;
  }

  return (
    <View style={[styles.taskRow, isLastItem ? {}: {borderWidth: 0.5, borderColor: 'grey'}]}>
        <View style={{width: 75, alignItems: 'center'}}>
          <View style={{ borderWidth: 1, borderRadius: 4, borderColor: '#21c17c', width: 30, height: 30 }}>
            <Image source={iconMapper[item.task_type]} style={{...styles.taskIcon, width: 24, height: 24}} />
          </View>
        </View>
        <Text style={{...styles.taskCell, width: 380, fontWeight: 'bold', textAlign: 'center'}}>{item.title}</Text>
        <Text style={{...styles.taskCell, width: 160,textAlign: 'center'}}>{mapper[item.task_type] || 'Other'}</Text>
        <TouchableOpacity style={{width: 60, alignContent: 'center'}} onPress={() => setTaskOptionsVisibleOption()}>
          <Image source={action_icon} style={styles.taskIcon} />
        </TouchableOpacity>
        
        {(taskOptionsVisible && selectedTaskId == item.task_id) && (<View style={[styles.dropdown, isLastItem ? styles.dropdownAbove : styles.dropdownBelow]}>
          {(isEditVisible()) && (<TouchableHighlight underlayColor='#bdedd7' style={{borderBottomWidth: 0.5}} onPress={() => editTask(item.task_id, item.task_type)}>
            <Text style={styles.actionButton}>{(item.task_type == "Classwork" && item.published_work_id) ? "View" : "Edit"}</Text>
          </TouchableHighlight>)}
          {(isDeleteVisible()) && (<TouchableHighlight underlayColor='#bdedd7' style={{borderBottomWidth: 0.5}} onPress={() => deleteTask(item.task_id, item.task_type)}>
            <Text style={styles.actionButton}>Delete</Text>
          </TouchableHighlight>)}
          {(item.task_type == "SlipTest") && (<TouchableHighlight underlayColor='#bdedd7' onPress={() => viewQuiz(item.quiz_id, item.task_id)}>
            <Text style={styles.actionButton}>View Quiz</Text>
          </TouchableHighlight>)}
        </View>)}
      </View>
  )
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  taskCell: {
    fontSize: 16,
    // flex: 1,
    textAlign: 'center',
  },
  taskIcon: {
    margin: 2,
    height: 30,
  },
  actionBox: { 
    zIndex: 100,
    display: 'flex', 
    position: 'absolute', 
    backgroundColor: '#f5f5f5',
    marginLeft: 570, 
    borderWidth: 1, 
    borderRadius: 8 
  },
  actionButton: {
    margin: 12, 
    textAlign: 'left' 
  } ,
  // dropdown: { position: 'absolute', right: 30, top: 30, backgroundColor: '#fff', elevation: 5, zIndex: 1 }
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    elevation: 5,
    zIndex: 1,
    borderRadius: 6
  },
  dropdownBelow: {
    top: 30,
    right: 30,
  },
  dropdownAbove: {
    bottom: 30,
    right: 30,
  },
})

export default TaskItem;
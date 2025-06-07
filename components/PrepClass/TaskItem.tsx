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
  ScrollView,
  TouchableHighlight,
} from 'react-native';

const calendar_month_icon = require('../../assets/images/modal/calendar_month.png');
const action_icon = require('../../assets/images/actions_icon.png');

const mapper: any = {
  SlipTest: "Slip Test",
  Quiz: "Quiz",
  ClassWork: "Classwork",
  AICheck: "AI Check"
}

interface TaskItemProps {
  item: any;
  index: number;
  tasksCount: number;
  deleteTask: (id: number, type: string) => void;
  editTask: (id: number, type: string) => void;
};

const TaskItem = ({item, index, tasksCount, deleteTask, editTask}: TaskItemProps) => {
  const [taskOptionsVisible, setTaskOptionsVisible] = useState(false);
  const mt = (index==tasksCount-1 || index == tasksCount - 2) ? -75: 50;
  return (
    <View style={styles.taskRow}>
      <Image source={calendar_month_icon} style={{...styles.taskIcon, width: 40, marginLeft: 20}} />
      <Text style={{...styles.taskCell, width: 300, fontWeight: 'bold'}}>{item.title}</Text>
      <Text style={styles.taskCell}>{mapper[item.task_type] || 'Other'}</Text>
      <TouchableOpacity onPress={() => setTaskOptionsVisible(val => !val)}>
        <Image source={action_icon} style={styles.taskIcon} />
      </TouchableOpacity>
      {taskOptionsVisible && (<View style={{...styles.actionBox, marginTop: mt}}>
        {item.task_type != 'SlipTest' && (<TouchableHighlight underlayColor='#bdedd7' style={{borderBottomWidth: 0.5}} onPress={() => editTask(item.task_id, item.task_type)}>
          <Text style={styles.actionButton}>Edit</Text>
        </TouchableHighlight>)}
        <TouchableHighlight underlayColor='#bdedd7' onPress={() => deleteTask(item.task_id, item.task_type)}>
          <Text style={styles.actionButton}>Delete</Text>
        </TouchableHighlight>
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
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  taskCell: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    width: 230
  },
  taskIcon: {
    width: 50,
    height: 32,
    marginHorizontal: 8,
  },
  actionBox: { 
    zIndex: 100 ,
    display: 'flex', 
    position: 'absolute', 
    backgroundColor: '#f5f5f5',
     marginLeft: 600, 
     borderWidth: 1, 
     borderRadius: 8 
    },
  actionButton: {
    margin: 12, 
    textAlign: 'left' 
  } 

})

export default TaskItem;
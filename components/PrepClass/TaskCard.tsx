import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SvgLoader from '@/utils/SvgLoader';

const TaskCard = ({idx, task, createTask}: {idx: number; task: any; createTask: (title: string) => void}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View key={idx} style={styles.taskCard}>
      <View style={styles.taskInfo}>
        <View style={{justifyContent: 'center'}}>
          <SvgLoader
            svgFilePath={task.svgIcon} // Replace with your own logo
            style={styles.taskLogo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.taskText}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {task.description.map((desc: string, i: number) => (
            <Text key={i} style={styles.taskDescription}>
              • {desc}
            </Text>
          ))}
        </View>
      </View>
      
      <View style={styles.createButtonBox}>
        <TouchableOpacity
          style={[styles.actionButton, isPressed && styles.buttonPressed]}
          onPress={() => {
            setIsPressed(true);
            createTask(task.id)
            setIsPressed(false);
          }}
          onPressIn={() => setIsPressed(true)}
          // onPressOut={() => setIsPressed(false)}
        >
          <Text style={styles.actionText}>{task.action}</Text>
        </TouchableOpacity>
      </View>
        
    </View>
  )
}

const styles = StyleSheet.create({
  taskCard: {
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  taskInfo: {
    flexDirection: 'row',
    width: 430,
  },
  taskImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  taskLogo: {
    width: 80,
    height: 80,
  },
  taskText: {
    padding: 24,
    flex: 1,
    marginLeft: 5,
    justifyContent: 'center'
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 12,
    margin: 2,
    color: '#4B5563',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#21c17c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonPressed: {
    backgroundColor: "#BDEDD7"
  },
  createButtonBox: {
    justifyContent: 'center'
  },
  actionText: {
    fontSize: 14,
  },
});

export default TaskCard;


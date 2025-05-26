import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SvgLoader from '@/utils/SvgLoader';

const TaskCard = ({idx, task, createTask}: {idx: number; task: any; createTask: (title: string) => void}) => {
  return (
    <View key={idx} style={styles.taskCard}>
      <View style={styles.taskInfo}>
        <SvgLoader
          svgFilePath={task.svgIcon} // Replace with your own logo
          style={styles.taskLogo}
          resizeMode="contain"
        />
        <View style={styles.taskText}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {task.description.map((desc: string, i: number) => (
            <Text key={i} style={styles.taskDescription}>
              • {desc}
            </Text>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => createTask(task.id)}
      >
        <Text style={styles.actionText}>{task.action}</Text>
      </TouchableOpacity>
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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  taskInfo: {
    flexDirection: 'row',
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
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 12,
    color: '#4B5563',
  },
  actionButton: {
    alignSelf: 'flex-end',
    marginTop: -30,
    borderWidth: 1,
    borderColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionText: {
    color: '#10B981',
    fontSize: 14,
  },
});

export default TaskCard;


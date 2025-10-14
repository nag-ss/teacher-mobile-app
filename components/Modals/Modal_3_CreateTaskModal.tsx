// Prep Class page 3

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import TaskCard from '../PrepClass/TaskCard';

const taskOptions = [
  {
    id: 'AICheck',
    title: 'AI Check-Up',
    description: [
      'Get instant AI evaluation on student submissions',
      'Identify mistakes, patterns & improvement areas',
    ],
    svgIcon: 'aiCheck',
    action: 'Create',
    imagePath: require('../../assets/images/modal/Ai_Check.png')
  },
  {
    id: 'SlipTest',
    title: 'Auto Slip Test Generation',
    description: [
      'Generate customized tests using AI.',
      'Adjust difficulty & personalize for students.',
    ],
    svgIcon: 'autoTest',
    action: 'Create',
    imagePath: require('../../assets/images/modal/Auto_Test.png')
  },
  {
    id: 'Classwork',
    title: 'Classwork',
    description: [
      'Publish classwork checks during live class',
      'Define questions and select check types',
    ],
    svgIcon: 'classUpload',
    action: 'Create',
    imagePath: require('../../assets/images/modal/Upload.png')
  }
];

const NewTaskModal = ({ visible, onClose, goBack, clickedNext }: {visible: boolean; onClose: () => void; goBack: () => void; clickedNext: (taskName:string) => void}) => {

  const createTask = (taskName: string) => {
    clickedNext(taskName);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.iconWrapper}>
              <Image source={require('../../assets/images/back-icon.png')} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.title}>
              Create a New Task{' '}
              <Text style={styles.subtitle}>
                - Select a task type to get started
              </Text>
            </Text>
          </View>

          {/* Task Options */}
          <ScrollView contentContainerStyle={styles.taskList}>
            {taskOptions.map((task, idx) => (
              <TaskCard key={idx} idx={idx} task={task} createTask={createTask} />
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewTaskModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconWrapper: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontWeight: 'normal',
    fontSize: 14,
  },
  taskList: {
    // paddingBottom: 20,
  },
  footer: {
    alignItems: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  cancelText: {
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 20
  },
});

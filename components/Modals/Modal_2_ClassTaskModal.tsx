// Prep Class page 2

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import UploadMaterialsCard from '../PrepClass/UploadMaterial';
import SvgLoader from '@/utils/SvgLoader';

const tasks = [
  {
    index: 1,
    icon: require('../../assets/images/modal/calendar_month.png'),
    title: 'Friction',
    category: 'Class Work',
    action: '02-11-2024',
  },
  {
    index: 2,
    icon: require('../../assets/images/modal/calendar_month.png'),
    title: 'Friction',
    category: 'Quiz',
    action: '02-11-2024',
  },
  {
    index: 3,
    icon: require('../../assets/images/modal/calendar_month.png'),
    title: 'Friction',
    category: 'AI Check',
    action: '02-11-2024',
  },
  {
    index: 4,
    icon: require('../../assets/images/modal/calendar_month.png'),
    title: 'Friction',
    category: 'Lecture Notes',
    action: '02-11-2024',
  },
  {
    index: 5,
    icon: require('../../assets/images/modal/calendar_month.png'),
    title: 'Friction',
    category: 'Lecture Notes',
    action: '02-11-2024',
  },
];

// const tasks = [
//   { id:1, icon: '📄', title: 'Covalent Bond Worksheet', category: 'Classwork' },
//   { id:2, icon: '🧪', title: 'Periodic Table', category: 'Quiz' },
//   { id:3, icon: '📄', title: 'Upload Notes on Hydrogen Bonds', category: 'Classwork' },
//   { id:4, icon: '🎯', title: 'Student Engagement', category: 'AI Check' },
//   { id:5, icon: '🎯', title: 'Student Engagement', category: 'AI Check' },
// ];

const ClassTaskCardPop = ({ visible, onClose, goBack, addTask }: { visible: boolean; onClose: () => void; goBack: () => void; addTask: () => void }) => {
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
                <Text style={styles.sectionTitle}>VII Grade - Section A</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>

            {/* Topic */}
            <View style={styles.topicContainer}>
              <Text style={styles.topicText}>Topic - Covalent Bond</Text>
              <Text style={styles.topicText}>Sub topic - Oxygen, Hydrogen</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* AI Assistant Text */}
            <View style={styles.aiTextContainer}>
              <Text style={styles.aiTitle}>Your AI-Powered Assistant</Text>
              <Text style={styles.aiSubtitle}>
                Let AI handle the heavy lifting — create assignments, tests, and classwork in seconds.
              </Text>
            </View>

            {/* AI Assistant Image */}
            <View style={styles.aiImageContainer}>
              <SvgLoader
                svgFilePath='aiAssistant' // Replace with your own logo
                style={styles.aiAssistant}
                resizeMode="contain"
              />
            </View>

            {/* Table / Task List */}
            <View style={styles.taskTable}> 
              <FlatList
                data={tasks}
                keyExtractor={(item) => item.index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.taskRow}>
                    <Image source={item.icon} style={styles.taskIcon} />
                    <Text style={styles.taskCell}>{item.title}</Text>
                    <Text style={styles.taskCell}>{item.category}</Text>
                    <Image source={require('../../assets/images/actions_icon.png')} style={styles.taskIcon} />
                  </View>
                )}
              />
            </View>

            {/* Add Task */}
            <View style={styles.addTaskContainer}>
              <TouchableOpacity onPress={addTask} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Task</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.quickCards}>
                {/* You can replace these with real components if needed */}
                <UploadMaterialsCard title='Upload Material' />
                <UploadMaterialsCard title='Home Work'/>
                <UploadMaterialsCard title='Assignment'/>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ClassTaskCardPop;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: width - 40,
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
  icon: {
    width: 32,
    height: 32,
  },
  aiAssistant: {
    width: 120,
    height: 120,
  },
  topicContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  topicText: {
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#64748B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#64748B',
    fontSize: 16,
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
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
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
    marginTop: 20,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  taskCell: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  taskIcon: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
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
  },
  quickActionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  quickCards: {
    flexDirection: 'row',
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

// Prep Class page 1

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ClassSummaryPopModal({ visible, onClose, clickedNext} : { visible: boolean; onClose: () => void; clickedNext: () => void}) {
  const [topic, setTopic] = useState();
  const [subTopic, setSubTopic] = useState();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.rowBetween}>
            <Text style={styles.title}>Summary</Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          {/* Class Details */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Class Details</Text>
            <View style={styles.rowBetween}>
              <View style={styles.rowItem}>
                <Text style={styles.detailText}>Grade </Text> <Text style={styles.detailTextValues}>: VII</Text>
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.detailText}>Section </Text> <Text style={styles.detailTextValues}>: A</Text>
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.detailText}>Subject </Text> <Text style={styles.detailTextValues}>: Chemistry</Text>
              </View>
              
             
            </View>
          </View>

          {/* Date and Time */}
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Image source={require('../../assets/images/modal/calendar_month.png')} style={styles.icon} />
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>: Mar 5 - 2025</Text>
            </View>
            <View style={styles.row}>
              <Image source={require('../../assets/images/modal/account_circle.png')} style={styles.iconSmall} />
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>: 10:00 - 11:00 AM</Text>
            </View>
          </View>

          {/* Set Topic Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Set Class Topic</Text>
            <View style={styles.row}>
              
              <Text style={styles.label}>Topic </Text>
              <Text>:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={topic}
                  style={styles.picker}
                  onValueChange={(itemValue) => setTopic(itemValue)}
                  mode="dropdown"
                >
                  <Picker.Item label="Select Topic" value={null} />
                  <Picker.Item label="Light" value="light" />
                  <Picker.Item label="Dark" value="dark" />
                  <Picker.Item label="System" value="system" />
                </Picker>
              </View>
              

              <Text style={styles.label}>Sub Topic </Text>
              <Text>:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={subTopic}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSubTopic(itemValue)}
                  mode="dropdown"
                >
                  <Picker.Item label="Select Sub Topic" value={null} />
                  <Picker.Item label="Light" value="light" />
                  <Picker.Item label="Dark" value="dark" />
                  <Picker.Item label="System" value="system" />
                </Picker>
              </View>
              
            </View>

            <View style={styles.row}>
              
            </View>
          </View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={clickedNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  rowItem:{
    flexDirection: 'row'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  detailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10
  },
  detailTextValues: {
    fontSize: 18
  },
  label: {
    fontSize: 18,
    marginLeft: 3,
    marginRight: 10,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    marginLeft: 20,
  },
  icon: {
    width: 32,
    height: 32,
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  section: {
    marginVertical: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1, 
    borderRadius: 4,
    marginLeft: 10
  },
  picker: {
    height: 54,
    width: 180,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#21C17C',
    width: 200,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
});

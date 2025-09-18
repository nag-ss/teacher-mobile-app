// Prep Class page 1

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
// import { useDispatch, useSelector } from 'react-redux';
// import {Topics} from '../../data/Topic_SubTopic';


// const topicsList = [{label: "Integer", value: "Integer"}, {label:"Fractions and Decimals", value: "Fractions and Decimals"}]
// const subTopicsList = [
//   {label: "Properties: Associative, Distributive, Commutative", value: "Properties: Associative, Distributive, Commutative"}, 
//   {label: "Introduction", value: "Introduction"}, 
//   {label: "Multiplication of Fractions", value: "Multiplication of Fractions"}, 
//   {label: "Division of Fractions", value: "Division of Fractions"},
//   {label: "Addition, Subtraction, Division, Multiplication", value: "Addition, Subtraction, Division, Multiplication"}
// ]

interface ClassSummaryPopModalProps { 
  visible: boolean; 
  selectedClass: any;
  parentProps: any;
  topicsList: any;
  // updateTopic: (topic: string) => void;
  // updateSubTopic: (subtopic: string) => void;
  onClose: () => void; 
  setTopicSubTopicAndMoveToNext: (topic: any, subTopic: any) => void;
}


export default function ClassSummaryPopModal({ 
  visible, 
  selectedClass,
  parentProps,
  topicsList,
  onClose, 
  setTopicSubTopicAndMoveToNext
} : ClassSummaryPopModalProps) {

  const [subTopics, setSubTopics] = useState([]);
  const [topic, setTopic] = useState(null);
  const [subTopic, setSubTopic] = useState(null);

  const setSubTopicAndUpdateTopic = (tp: any) => {
    console.log(tp);
    // setSubTopics(s_topics);
    console.log(tp.sub_topic);
    setSubTopics(tp.sub_topic)
    setTopic(tp)
  }
  
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
              <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Class Details */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Class Details</Text>
            <View style={styles.rowBetween}>
              <View style={styles.rowItem}>
                <Text style={styles.detailText}>Grade :</Text> 
                <Text style={styles.detailTextValues}>{selectedClass?.division_name}</Text>
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.detailText}>Section :</Text> 
                <Text style={styles.detailTextValues}> {selectedClass?.section_name}</Text>
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.detailText}>Subject :</Text> 
                <Text style={styles.detailTextValues}> {parentProps.category}</Text>
              </View>
            </View>
            {/* Date and Time */}
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginLeft: -2, marginTop: 8}}>
              <View style={styles.rowItem}>
                {/* <Image source={require('../../assets/images/modal/calendar_month.png')} style={styles.iconSmall} /> */}
                <Text style={[styles.label, {width: 45}]}>Date:</Text>
                <Text style={styles.value}> {selectedClass?.date}</Text>
              </View>
              <View style={styles.rowItem}>
                {/* <Image source={require('../../assets/images/modal/account_circle.png')} style={styles.iconSmall} /> */}
                <Text style={[styles.label, {width: 55}]}>Time:</Text>
                <Text style={styles.value}> {parentProps.time}</Text>
              </View>
            </View>
          </View>

          

          {/* Set Topic Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Set Class Topic</Text>
            <View style={styles.row}>
              
              <Text style={styles.label}>Topic </Text>
              <Text>:</Text>
              <View style={styles.pickerWrapper}>
                {/* <Picker
                  selectedValue={topic}
                  style={styles.picker}
                  onValueChange={(itemValue) => updateTopic(itemValue)}
                  mode="dropdown"
                >
                  {topicsList.map((key)=> <Picker.Item key={key} label={key} value={key} />)}
                </Picker> */}
                <Dropdown
                  data={topicsList}
                  value={topic}
                  onChange={(tp) => setSubTopicAndUpdateTopic(tp)}
                  labelField="topic"
                  valueField="topic"
                  style={styles.picker}
                  iconStyle={{width: 30, height:30}}
                  containerStyle={{borderRadius: 10}}
                  itemContainerStyle={{borderColor: '#f5f5f5', borderBottomWidth: 1}}
                />
              </View>
              

              <Text style={styles.label}>Sub Topic </Text>
              <Text>:</Text>
              <View style={styles.pickerWrapper}>
                {/* <Picker
                  selectedValue={subTopic}
                  style={styles.picker}
                  onValueChange={(itemValue) => updateSubTopic(itemValue)}
                  mode="dropdown"
                >
                  {subTopicsList.map((key)=> <Picker.Item key={key} label={key} value={key} />)}
                </Picker> */}
                 <Dropdown
                  data={subTopics}
                  value={subTopic}
                  onChange={(item) => setSubTopic(item)}
                  labelField="sub_topic"
                  valueField="sub_topic"
                  style={styles.picker}
                  iconStyle={{width: 30, height:30}}
                  containerStyle={{borderRadius: 10}}
                  itemContainerStyle={{borderColor: '#f5f5f5', borderBottomWidth: 1}}
                />
              </View>
              
            </View>
          </View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setTopicSubTopicAndMoveToNext(topic, subTopic)} style={styles.nextButton}>
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
    marginVertical: 6,
  },
  rowItem:{
    flexDirection: 'row',
    width: 230,
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
  closeIcon:{
    width: 24,
    height: 24
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
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1, 
    borderRadius: 4,
  },
  pickerBox: {
    height: 100,
    justifyContent: 'flex-end', // aligns picker to the bottom of the box
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  picker: {
    height: 60,
    width: 180,
    padding: 10,
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
  pickerWrapper: {
    borderWidth: 0.5,
    borderColor: '#999',
    borderRadius: 8,
    overflow: 'hidden'
  },
});

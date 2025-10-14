import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {RadioButton} from 'react-native-radio-buttons-group';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import {Topics} from '../../data/Topic_SubTopic';

// const topicsList = [{label: "Integer", value: "Integer"}, {label:"Fractions and Decimals", value: "Fractions and Decimals"}]
// const subTopicsList = [
//   {label: "Properties: Associative, Distributive, Commutative", value: "Properties: Associative, Distributive, Commutative"}, 
//   {label: "Introduction", value: "Introduction"}, 
//   {label: "Multiplication of Fractions", value: "Multiplication of Fractions"}, 
//   {label: "Division of Fractions", value: "Division of Fractions"},
//   {label: "Addition, Subtraction, Division, Multiplication", value: "Addition, Subtraction, Division, Multiplication"}
// ]

interface GenerateSlipTestModalProps { 
  visible: boolean; 
  selectedClass:any;
  selectedTopic: string;
  selectedSubTopic: string;
  topicsList: any;
  updateTopic: (topic: string) => void;
  updateSubTopic: (subtopic: string) => void;
  onClose: () => void; 
  clickedNext: () => void;
}

const GenerateSlipTestModal = ({
  visible,
  selectedClass,
  topicsList,
  selectedTopic,
  selectedSubTopic,
  updateTopic,
  updateSubTopic,
  onClose,
  clickedNext,
}: GenerateSlipTestModalProps ) => {
  const [selectedOption, setSelectedOption] = useState<'topic' | 'upload'>('topic');
  // const [topicSelected, setTopicSelected] = useState(false)
  // const [uploadSelected, setUploadSelected] = useState(false)
  const [topic, setTopic] = useState(String);
  const [subTopic, setSubTopic] = useState(String);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [subTopics, setSubTopics] = useState([]);

  const setSubTopicsAndUpdateTopic = (tp: any) => {
    console.log(tp);
    // setSubTopics(s_topics);
    console.log(tp.sub_topic);
    setSubTopics(tp.sub_topic)
    setTopic(tp)
    updateTopic(tp);
  }

  useEffect(() => {
    if (visible) {
      setTopic(selectedTopic);
      setSubTopic(selectedSubTopic);
      const subTopics = topicsList.find((tp: any) => tp.topic == selectedTopic).sub_topic
      setSubTopics(subTopics)
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View>
                <Text style={styles.modalTitle}>Generate Slip Test</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.closeIcon} />
                </TouchableOpacity>
              </View>
              
              
            </View>
            


            {/* Class Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Class Details</Text>
              <View style={styles.detailGrid}>
                <Text>
                  <Text style={styles.detailItem}>Grade {' '}</Text>
                  <Text>: {' '}</Text><Text style={styles.detailValue}>{selectedClass?.division_name}</Text>
                </Text>
                
                <Text>
                  <Text style={styles.detailItem}>Section {' '}</Text>
                  <Text>: {' '}</Text><Text style={styles.detailValue}>{selectedClass?.section_name}</Text>
                </Text>
                
                
                <Text>
                  <Text style={styles.detailItem}>Subject {' '}</Text>
                  <Text>: {' '}</Text><Text style={styles.detailValue}>{selectedClass?.subject_name}</Text>
                </Text>
                
              </View>
            </View>

            <Text style={styles.sectionTitle}>Select an Option to Proceed</Text>

            {/* Topic Option */}

            <View  style={styles.optionBox}>
              <View style={styles.optionBoxMainContent}>
                <View>
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View style={{display:'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                      <View style={styles.imageBox}>
                        <Image source={require('../../assets/images/ss/Topic.png')} style={styles.icon} />
                      </View>
                      <View style={{marginLeft: 10}}>
                        <Text style={styles.optionTitle}>Topic</Text>
                        <Text style={styles.optionDescription}>
                          Choose a topic and subtopic to auto-generate a customized test.
                        </Text>
                      </View>
                    </View>
                    
                  </View>
                    
                </View>
                
                <RadioButton color="#21c17c" id='topic' onPress={(ev) => setSelectedOption('topic')} selected={selectedOption == "topic"} />
                {/* <CheckBox checked={topicSelected} onPress={() => setTopicSelected(val => !val)}/> */}
                  
              </View>
              {selectedOption == "topic" && (
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>            
                  <Text style={styles.label}>Topic :</Text>
                  <View style={styles.pickerContainer}>
                    {/* <Picker
                      selectedValue={topic}
                      style={styles.picker}
                      onValueChange={(itemValue) => updateTopic(itemValue)}
                      mode="dropdown"
                    >
                      {topicsList.map((key)=> <Picker.Item label={key} value={key} />)}
                    </Picker> */}
                    <Dropdown
                      data={topicsList}
                      value={topic}
                      onChange={(item) => setSubTopicsAndUpdateTopic(item)}
                      labelField="topic"
                      valueField="topic"
                      style={{height: 60, width: 180, padding: 10}}
                      containerStyle={{borderRadius: 10, overflow: 'hidden'}}
                      iconStyle={{width: 30, height:30}}
                      renderItem={(item, selected) => {
                        return selected ? (<View style={[styles.picker, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                          <Text>{item.topic}</Text>
                          <Icon name="check" size={16} color="black" /> 
                        </View>) : (<View style={[styles.picker, {display: 'flex', flexDirection: 'row', alignItems: 'center'}]}>
                          <Text>{item.topic}</Text>
                        </View>)
                      }}
                      // itemContainerStyle={{borderColor: '#f5f5f5', borderBottomWidth: 1}}
                    />
                  </View>
                  
    
                  <Text style={styles.label}>Sub Topic :</Text>
                  <View style={styles.pickerContainer}>
                    {/* <Picker
                      selectedValue={subTopic}
                      style={styles.picker}
                      onValueChange={(itemValue) => updateSubTopic(itemValue)}
                      mode="dropdown"
                    >
                      {subTopicsList.map((key)=> <Picker.Item label={key} value={key} />)}
                    </Picker> */}
                    <Dropdown
                      data={subTopics}
                      value={subTopic}
                      onChange={(item) => updateSubTopic(item.sub_topic)}
                      labelField="sub_topic"
                      valueField="sub_topic"
                      style={{height: 60, width: 180, padding: 10}}
                      iconStyle={{width: 30, height:30}}
                      containerStyle={{borderRadius: 10, overflow: 'hidden'}}
                      renderItem={(item, selected) => {
                        return selected ? (<View style={[styles.picker, {display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                          <Text>{item.sub_topic}</Text>
                          <Icon name="check" size={16} color="black" /> 
                        </View>) : (<View style={[styles.picker, {display: 'flex', flexDirection: 'row', alignItems: 'center'}]}>
                          <Text>{item.sub_topic}</Text>
                        </View>)
                      }}
                      // itemContainerStyle={{borderColor: '#f5f5f5', borderBottomWidth: 1}}
                    />
                  </View>
                  
                </View>
              )}
            </View>

            {/* Upload Option */}
            <View style={styles.optionBox}>
              
              <View style={[styles.optionBoxMainContent, {opacity: 0.5}]}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View style={styles.imageBox}>
                      <Image source={require('../../assets/images/ss/Upload-materials.png')} style={styles.icon} />
                    </View>
                    <View style={{marginLeft: 10}}>
                      <Text style={styles.optionTitle}>Upload</Text>
                      <Text style={styles.optionDescription}>
                        Generate a test by uploading your own material.
                      </Text>
                    </View>
                  </View>
                  
                </View>
                <RadioButton disabled color="#21c17c" id='upload' onPress={(ev) => setSelectedOption('upload')} selected={selectedOption == "upload"} />
              </View>

              {selectedOption == "upload" && (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadText}>📎 Upload file (simulated)</Text>
                </View>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.nextButton} onPress={clickedNext}>
                <Text style={styles.nextText}>Next</Text>
              </TouchableOpacity>
            </View>
          
        </View>
      </View>
    </Modal>
  );
};

export default GenerateSlipTestModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '75%',
    maxHeight: '90%',
  },
  contentContainer: {
    // paddingBottom: 20,
  },
  closeButton: {
    zIndex: 10,
  },
  closeIcon:{
    width: 24,
    height: 24
  },
  imageBox: {
    borderColor: '#21c17c', 
    borderRadius: 6, 
    borderWidth: 0.5, 
    alignSelf: 'center', 
    padding: 4 
  },
  icon: {
    width: 32,
    height: 32,
  },
  closeText: {
    fontSize: 28,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
  },
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailItem: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    fontWeight: 'normal'
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#FFF',
  },
  optionBoxMainContent: {
    display: 'flex',
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10
  },
  picker: {
    minHeight: 60,
    width: 160,
    padding: 10,
  },
  uploadPlaceholder: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  uploadText: {
    color: '#6B7280',
    fontSize: 14,
  },
  footer: {
    alignItems: 'flex-end',
  },
  nextButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop:8
  },
  nextText: {
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 0.5,
    borderColor: '#999',
    borderRadius: 8,
    overflow: 'hidden'
  },

});

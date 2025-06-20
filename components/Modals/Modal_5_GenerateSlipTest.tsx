import React, { useState } from 'react';
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

const topicsList = [{label: "Integer", value: "Integer"}, {label:"Fractions and Decimals", value: "Fractions and Decimals"}]
const subTopicsList = [
  {label: "Properties: Associative, Distributive, Commutative", value: "Properties: Associative, Distributive, Commutative"}, 
  {label: "Introduction", value: "Introduction"}, 
  {label: "Multiplication of Fractions", value: "Multiplication of Fractions"}, 
  {label: "Division of Fractions", value: "Division of Fractions"},
  {label: "Addition, Subtraction, Division, Multiplication", value: "Addition, Subtraction, Division, Multiplication"}
]

interface GenerateSlipTestModalProps { 
  topic: string; 
  subTopic: string; 
  visible: boolean; 
  selectedClass:any; 
  updateTopic: (topic: string) => void;
  updateSubTopic: (subtopic: string) => void;
  onClose: () => void; 
  clickedNext: () => void;
}

const GenerateSlipTestModal = ({
  topic, 
  subTopic,
  visible,
  selectedClass,
  updateTopic,
  updateSubTopic,
  onClose,
  clickedNext,
}: GenerateSlipTestModalProps ) => {
  const [selectedOption, setSelectedOption] = useState<'topic' | 'upload'>();
  const [topicSelected, setTopicSelected] = useState(false)
  const [uploadSelected, setUploadSelected] = useState(false)
  const [selectedId, setSelectedId] = useState<string | undefined>();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.contentContainer}>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.closeIcon} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Generate Slip Test</Text>

            {/* Class Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Class Details</Text>
              <View style={styles.detailGrid}>
                <Text style={styles.detailItem}>Grade</Text>
                <Text>
                  <Text>: {'  '}</Text><Text style={styles.detailValue}>{selectedClass.division_name}</Text>
                </Text>
                <Text style={styles.detailItem}>Section</Text>
                <Text>
                  <Text>: {'  '}</Text><Text style={styles.detailValue}>{selectedClass.section_name}</Text>
                </Text>
                
                <Text style={styles.detailItem}>Subject</Text>
                <Text>
                  <Text>: {'  '}</Text><Text style={styles.detailValue}>{selectedClass.subject_name}</Text>
                </Text>
                
              </View>
            </View>

            <Text style={styles.sectionTitle}>Select an Option to Proceed</Text>

            {/* Topic Option */}

            <View  style={styles.optionBox}>
              <View style={styles.optionBoxMainContent}>
                <Image source={require('../../assets/images/ss/Topic.png')} style={styles.icon} />
                <View>
                  <Text style={styles.optionTitle}>Topic</Text>
                  <Text style={styles.optionDescription}>
                    Generate a test by choosing a topic and sub-topic. The test will be automatically created using these topics.
                  </Text>
                </View>
                <RadioButton color="#21c17c" id='topic' onPress={() => setTopicSelected(val => !val)} selected={topicSelected} />
                {/* <CheckBox checked={topicSelected} onPress={() => setTopicSelected(val => !val)}/> */}
                  
              </View>
              {topicSelected && (
                <View style={{display: 'flex', 'flexDirection': 'row', justifyContent: 'space-between', alignItems: 'center'}}>            
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
                      onChange={(item) => updateTopic(item.value)}
                      labelField="label"
                      valueField="value"
                      style={styles.picker}
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
                      data={subTopicsList}
                      value={subTopic}
                      onChange={(item) => updateSubTopic(item.value)}
                      labelField="label"
                      valueField="value"
                      style={styles.picker}
                    />
                  </View>
                  
                </View>
              )}
            </View>

            {/* Upload Option */}
            <View style={styles.optionBox}>
              
              <View style={styles.optionBoxMainContent}>
                <Image source={require('../../assets/images/ss/Upload-materials.png')} style={styles.icon} />
                <View>
                  <Text style={styles.optionTitle}>Upload</Text>
                  <Text style={styles.optionDescription}>
                    Upload your own test, learning material, or classwork to generate a test from its content.
                  </Text>
                </View>
                
                <RadioButton color="#21c17c" id='upload' onPress={() => setUploadSelected(val => !val)} selected={uploadSelected} />
              </View>

              {uploadSelected && (
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
          </ScrollView>
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
    padding: 20,
    width: '75%',
    maxHeight: '90%',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
  },
  closeIcon:{
    width: 24,
    height: 24
  },
  icon: {
    width: 32,
    height: 32,
    borderColor: '#21c17c',
    borderRadius: 6,
    borderWidth: 2,
  },
  closeText: {
    fontSize: 28,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
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
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  optionBoxMainContent: {
    display: 'flex',
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 11,
    color: '#4B5563',
    width: 300,
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
    height: 60,
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
    marginTop: 20,
    alignItems: 'flex-end',
  },
  nextButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
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

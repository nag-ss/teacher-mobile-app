import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import InputSpinner from "react-native-input-spinner";


interface TestSettingsModalProps {
  visible: boolean; 
  onClose: () => void; 
  generateSlipTest: (slipTestDetails:any) => void;
}

const timeData = [
  {id: 1,value: 15, label: '15 mins'},
  {id: 2,value: 30, label: '30 mins'},
  {id: 3,value: 45, label: '45 mins'},
  {id: 4,value: 60, label: '60 mins'},
];

const marksData = [
  {id: 1,value: 20, label: '20'},
  {id: 2,value: 50, label: '50'},
  {id: 3,value: 60, label: '60'},
  {id: 4,value: 100, label: '100'},
]


const TestSettingsModal = ({ visible, onClose, generateSlipTest }: TestSettingsModalProps) => {
  const [duration, setDuration] = useState(15);
  const [marks, setMarks] = useState(50);
  const [difficulty, setDifficulty] = useState(7);
  const [mcqCount, setMcqCount] = useState(3);
  const [subCount, setSubCount] = useState(2);
  const [isMCQ, setIsMCQ] = useState(true);
  const [isSubjective, setIsSubjective] = useState(true);

  const totalQuestions = (isMCQ ? mcqCount : 0) + (isSubjective ? subCount : 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
             <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.closeIcon} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>Test Settings - </Text>
              <Text style={styles.subtitle}>Customize test parameters before generating questions.</Text>
            </View>
            

            {/* Time & Marks */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time & Marks Section</Text>

              <View style={styles.row}>
                <Text style={styles.marksTextStyle}><Image source={require('../../assets/images/ss/Clock.png')} style={styles.clockIcon} /> Time</Text>
                <Text style={styles.colonStyle}>:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={duration}
                    onValueChange={(value) => setDuration(value)}
                    style={styles.picker}
                    mode='dropdown'
                  >
                    {
                      timeData.map((item) => <Picker.Item key={item.id} label={item.label} value={item.value} />)
                    }
                  </Picker>
                </View>
                
                <Text style={styles.marksTextStyle}><Image source={require('../../assets/images/ss/Marks.png')} style={styles.clockIcon} /> Marks</Text>
                <Text style={styles.colonStyle}>:</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={marks}
                    onValueChange={(value) => setMarks(value)}
                    style={styles.picker}
                    mode='dropdown'
                  >
                    {
                      marksData.map((item) => <Picker.Item key={item.id} label={item.label} value={item.value} />)
                    }

                  </Picker>
                </View>
                
              </View>

                
            </View>

            {/* Difficulty */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Difficulty Level -{' '}
                <Text style={styles.difficultyText}>
                  {difficulty >= 7 ? 'Hard' : difficulty >= 4 ? 'Medium' : 'Easy'}
                </Text>
              </Text>
              {/* <TextInput
                style={styles.slider}
                value={String(difficulty)}
                onChangeText={(val) => setDifficulty(Math.max(0, Math.min(10, Number(val))))}
                keyboardType="numeric"
              /> */}
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={difficulty}
                onValueChange={(num) => setDifficulty(num)}
                renderStepNumber
                minimumTrackTintColor='#21c17c'
                thumbTintColor='#21c17c'
              />

            </View>

            {/* Number of Questions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Number of Questions</Text>

              
              <View style={styles.questionRow}>
                {/* MCQ Toggle */}  
                <View >
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Image source={require('../../assets/images/ss/Checkbox.png')} style={styles.subjectCheckIcon} />
                    <Text>Multiple Choice</Text>
                  </View>
                  
                  <View style={styles.questionsCount}>
                    <InputSpinner
                      value={mcqCount}
                      onIncrease={() => setMcqCount((prev) => prev + 1)}
                      onDecrease={() => setMcqCount((prev) => prev - 1)}              
                      height={40}
                      color='#8080801A'
                      colorPress='#BDEDD7'
                      buttonTextColor='#808080'
                    />;
                  </View>
                  
                  {/* <Switch value={isMCQ} onValueChange={setIsMCQ} /> */}

                  {/* <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setMcqCount((prev) => Math.max(0, prev - 1))}
                    disabled={!isMCQ}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.countText}>{mcqCount}</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setMcqCount((prev) => prev + 1)}
                    disabled={!isMCQ}
                  >
                    <Text>+</Text>
                  </TouchableOpacity> */}
                </View>
                 {/* Subjective Toggle */}
                <View>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Image source={require('../../assets/images/ss/Checkbox.png')} style={styles.subjectCheckIcon} />
                    <Text>Subjective</Text>
                  </View>
                  
                  {/* <Switch value={isSubjective} onValueChange={setIsSubjective} /> */}
                  <View style={styles.questionsCount}>
                    <InputSpinner
                      value={subCount}
                      onIncrease={() => setSubCount((prev) => prev + 1)}
                      onDecrease={() => setSubCount((prev) => prev - 1)}
                      height={40}
                      color='#8080801A'
                      colorPress='#BDEDD7'
                      buttonTextColor='#808080'
                    />;
                  </View>
                  
                </View>
                {/* Total */}
                <View>
                  <Text style={{marginBottom: 8}}>Total Questions</Text>
                  <View style={{width: 150, borderWidth: 0.5, borderRadius: 8}}>
                    <Text style={{textAlign: 'center', marginTop: 10, height: 30}}>{totalQuestions}</Text>
                  </View>
                </View>

              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={() => {
                generateSlipTest({duration, marks, difficulty, mcqCount, subCount, totalQuestions})
                setDifficulty(7)
                setDuration(15),
                setMarks(50),
                setMcqCount(10)
                setSubCount(10)
              }}>
                <Text>Generate Test</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TestSettingsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    width: '70%',
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
  },
  icon: {
    width: 32,
    height: 32,
  },
  closeIcon:{
    width: 24,
    height: 24,
  },
  closeText: {
    fontSize: 24,
    color: '#6B7280',
  },
  titleContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    marginTop: 4, 
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 6,
    fontSize: 12
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white'
  },
  clockIcon: {
    width: 16,
    height: 16
  },
  subjectCheckIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  difficultyText: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  row: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marksTextStyle: {
    marginTop: 12
  },
  colonStyle:{
    fontWeight: 'bold',
    marginTop: 12
  },
  pickerWrapper: {
    borderWidth: 0.5,
    borderColor: '#999',
    borderRadius: 8,
    overflow: 'hidden'
  },
  picker: {
    width: 150
  },
  slider: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 3,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 10,
    width: '95%',
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleMark: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  questionRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  questionsCount: {
    width: 150,
    marginTop: 10, 
    borderWidth: 0.5, 
    borderRadius: 10
  },
  counterButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    width: 30,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  countText: {
    width: 30,
    textAlign: 'center',
  },
  footer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#21c17c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});

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

const TestSettingsModal = ({ visible, onClose, generateSlipTest }: {visible: boolean; onClose: () => void; generateSlipTest: () => void}) => {
  const [time, setTime] = useState('15 min');
  const [marks, setMarks] = useState('50');
  const [difficulty, setDifficulty] = useState(8);
  const [mcqCount, setMcqCount] = useState(10);
  const [subCount, setSubCount] = useState(10);
  const [isMCQ, setIsMCQ] = useState(true);
  const [isSubjective, setIsSubjective] = useState(true);

  const totalQuestions = (isMCQ ? mcqCount : 0) + (isSubjective ? subCount : 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
             <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.icon} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Test Settings</Text>
            <Text style={styles.subtitle}>Customize test parameters before generating questions.</Text>

            {/* Time & Marks */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time & Marks Section</Text>

              <View style={styles.row}>
                <Text>⏰ Time:</Text>
                <Picker
                  selectedValue={time}
                  onValueChange={(value) => setTime(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="15 min" value="15 min" />
                  <Picker.Item label="30 min" value="30 min" />
                  <Picker.Item label="45 min" value="45 min" />
                  <Picker.Item label="60 min" value="60 min" />
                </Picker>
              </View>

              <View style={styles.row}>
                <Text>📄 Marks:</Text>
                <Picker
                  selectedValue={marks}
                  onValueChange={(value) => setMarks(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="50" value="50" />
                  <Picker.Item label="100" value="100" />
                </Picker>
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
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={difficulty}
                onValueChange={(num) => setDifficulty(num)}
                renderStepNumber
              />

            </View>

            {/* Number of Questions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Number of Questions</Text>

              {/* MCQ Toggle */}
              <View style={styles.questionRow}>
                <Text>Multiple Choice</Text>
                <Switch value={isMCQ} onValueChange={setIsMCQ} />
                <TouchableOpacity
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
                </TouchableOpacity>
              </View>

              {/* Subjective Toggle */}
              <View style={styles.questionRow}>
                <Text>Subjective</Text>
                <Switch value={isSubjective} onValueChange={setIsSubjective} />
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setSubCount((prev) => Math.max(0, prev - 1))}
                  disabled={!isSubjective}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <Text style={styles.countText}>{subCount}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setSubCount((prev) => prev + 1)}
                  disabled={!isSubjective}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>

              {/* Total */}
              <View style={{ marginTop: 10 }}>
                <Text>Total Questions: {totalQuestions}</Text>
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={generateSlipTest}>
                <Text style={styles.buttonText}>Generate Test</Text>
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
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
  closeText: {
    fontSize: 24,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
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
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  slider: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 3,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 10,
    width: 630,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
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
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

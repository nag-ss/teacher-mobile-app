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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GenerateSlipTestModal = ({
  visible,
  onClose,
  clickedNext,
}: {visible: boolean; onClose: () => void; clickedNext: () => void} ) => {
  const [selectedOption, setSelectedOption] = useState<'topic' | 'upload'>();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubTopic, setSelectedSubTopic] = useState('');

  const topics = ['Option 1', 'Option 2', 'Option 3'];
  const subTopics = ['Sub 1', 'Sub 2', 'Sub 3'];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>&times;</Text>
            </Pressable>

            <Text style={styles.modalTitle}>Generate Slip Test</Text>

            {/* Class Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Class Details</Text>
              <View style={styles.detailGrid}>
                <Text style={styles.detailItem}>Grade: <Text style={styles.detailValue}>VII</Text></Text>
                <Text style={styles.detailItem}>Section: <Text style={styles.detailValue}>A</Text></Text>
                <Text style={styles.detailItem}>Subject: <Text style={styles.detailValue}>Chemistry</Text></Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Select an Option to Proceed</Text>

            {/* Topic Option */}
            <TouchableOpacity
              style={[
                styles.optionBox,
                selectedOption === 'topic' && styles.optionBoxSelected,
              ]}
              onPress={() => setSelectedOption('topic')}
              activeOpacity={0.9}
            >
              <Text style={styles.optionIcon}>📁</Text>
              <Text style={styles.optionTitle}>Topic</Text>
              <Text style={styles.optionDescription}>
                Generate a test by choosing a topic and sub-topic. The test will be automatically created using these topics.
              </Text>

              {selectedOption === 'topic' && (
                <View style={styles.pickerGroup}>
                  <View style={styles.pickerWrapper}>
                    <Text style={styles.label}>Topic</Text>
                    <Picker
                      selectedValue={selectedTopic}
                      onValueChange={(itemValue) => setSelectedTopic(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Choose an option" value="" />
                      {topics.map((topic) => (
                        <Picker.Item key={topic} label={topic} value={topic} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <Text style={styles.label}>Sub Topic</Text>
                    <Picker
                      selectedValue={selectedSubTopic}
                      onValueChange={(itemValue) => setSelectedSubTopic(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Choose an option" value="" />
                      {subTopics.map((sub) => (
                        <Picker.Item key={sub} label={sub} value={sub} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Upload Option */}
            <TouchableOpacity
              style={[
                styles.optionBox,
                selectedOption === 'upload' && styles.optionBoxSelected,
              ]}
              onPress={() => setSelectedOption('upload')}
              activeOpacity={0.9}
            >
              <Text style={styles.optionIcon}>📤</Text>
              <Text style={styles.optionTitle}>Upload</Text>
              <Text style={styles.optionDescription}>
                Upload your own test, learning material, or classwork to generate a test from its content.
              </Text>

              {selectedOption === 'upload' && (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadText}>📎 Upload file (simulated)</Text>
                </View>
              )}
            </TouchableOpacity>

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
    width: '90%',
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
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    fontSize: 14,
    marginRight: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: '600',
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  optionBoxSelected: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
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
    marginBottom: 4,
    fontSize: 14,
    color: '#374151',
  },
  picker: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
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
    color: 'white',
    fontWeight: '600',
  },
});

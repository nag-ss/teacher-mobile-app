import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const QuestionModal = ({ show, ques, onClose, clickedNext, onCancel }: any) => {
  if (!show) return null;

  const clickBack = () => {
    onCancel();
  };

  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Edit Question</Text>
              <Text style={styles.subText}>Modify the question and answer before finalizing.</Text>
            </View>

            <View style={styles.questionBox}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Question</Text>
                <TextInput
                  value={ques.question}
                  style={styles.input}
                  multiline
                  editable={false} // change to true if editing is needed
                />
              </View>

              {/* Subjective Answer */}
              {ques.type === 'subjective' && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerLabel}>Answer:</Text>
                  <TextInput
                    value={ques.answer}
                    style={styles.textArea}
                    multiline
                    editable={false} // change to true if editing is needed
                  />
                </View>
              )}

              {/* Objective Options */}
              {ques.type === 'objective' && (
                <View style={styles.optionsContainer}>
                  {ques.options?.map((opt: any, idx: number) => (
                    <View key={idx} style={styles.optionItem}>
                      <Text style={styles.label}>Option - {String.fromCharCode(65 + idx)}</Text>
                      <View style={styles.optionRow}>
                        {/* Replace with real radio button if needed */}
                        <View style={styles.radioCircle}>
                          {ques.correct === idx && <View style={styles.selectedRb} />}
                        </View>
                        <TextInput
                          value={opt}
                          style={styles.input}
                          editable={false} // change to true if editing is needed
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={clickBack} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default QuestionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  questionBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  answerBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
  },
  answerLabel: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
  },
  optionsContainer: {
    marginTop: 12,
  },
  optionItem: {
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

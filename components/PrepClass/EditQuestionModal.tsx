import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput
} from 'react-native';
import {MathJaxSvg} from 'react-native-mathjax-html-to-svg';

interface EditQuestionModalProps {
  show: boolean;
  selectedQuestion: any;
  onCancel: () => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ show, selectedQuestion, onCancel }) => {
  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <View>
                <Text style={styles.title}>{ "Edit Question"}?</Text>
            </View>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>*Title</Text>
            <TextInput
                // value={title}
                // onChangeText={setTitle}
                placeholder="Enter check title"
                style={styles.textInput}
            />
            </View>
            <View>
                <MathJaxSvg 
                fontCache={true}
                fontSize={12}
                style={styles.questionText}
                >
                {selectedQuestion.body.Question}
                </MathJaxSvg>
            </View>
          
          

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditQuestionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '50%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 128,
    height: 128,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  cancelButton: {
    paddingHorizontal:20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    width: 140,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center'
  },
  questionText: {
    // flex: 1,
    marginLeft: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
});

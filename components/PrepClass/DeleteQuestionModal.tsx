import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

interface DeleteQuestionModalProps {
  show: boolean;
  resourceType: string;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({ show, resourceType, onCancel, onDelete }) => {
  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={require('../../assets/images/Deleted_large.png')} // Replace with your actual image path
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Delete {resourceType == "task" ? "Task" : "Question"}?</Text>
          <Text style={styles.subtitle}>Are you sure you want to proceed?</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteQuestionModal;

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
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#21c17c',
    width: 140,
  },
  deleteButtonText: {
    fontSize: 14,
    textAlign: 'center'
  },
});

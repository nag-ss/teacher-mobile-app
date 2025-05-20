import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
} from 'react-native';

interface AiCheckModalProps {
  visible: boolean; 
  onClose: () => void;
  goBack: () => void; 
  saveAICheckDetails: (AICheckDetails:any) => void;
}

const AiCheckModal = ({ visible, onClose, goBack, saveAICheckDetails }: AiCheckModalProps) => {
  const [title, setTitle] = useState('');
  const [checkType] = useState('Custom (Manual Input)');
  const [matchType, setMatchType] = useState({ exact: false, approximate: false });
  const [textInput, setTextInput] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>AI Check</Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter check title"
              style={styles.textInput}
            />
          </View>

          {/* Check Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check Type</Text>
            <View style={styles.checkTypeContainer}>
              <Text>{checkType}</Text>
            </View>
          </View>

          {/* Match Type */}
          <View style={styles.matchTypeRow}>
            <View style={styles.switchRow}>
              <Switch
                value={matchType.exact}
                onValueChange={() =>
                  setMatchType((prev) => ({ ...prev, exact: !prev.exact }))
                }
              />
              <Text style={styles.switchLabel}>Exact Match</Text>
            </View>
            <View style={styles.switchRow}>
              <Switch
                value={matchType.approximate}
                onValueChange={() =>
                  setMatchType((prev) => ({ ...prev, approximate: !prev.approximate }))
                }
              />
              <Text style={styles.switchLabel}>Approximate</Text>
            </View>
          </View>

          {/* Text Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Text Input</Text>
            <TextInput
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Type Here:"
              multiline
              style={styles.textArea}
            />
          </View>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={goBack}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => {
              saveAICheckDetails({title,  checkType, matchType, textInput }),
              setTitle(''), 
              setMatchType({exact: false, approximate: false})
              setTextInput('')
            }}>
              <Text style={{ color: 'white' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AiCheckModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    width: 32,
    height: 32,
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
  checkTypeContainer: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#8B5CF6',
    borderRadius: 9999,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
});

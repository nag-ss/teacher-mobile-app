import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import RadioGroup from 'react-native-radio-buttons-group';
interface AiCheckModalProps {
  visible: boolean; 
  onClose: () => void;
  goBack: () => void; 
  saveAICheckDetails: (AICheckDetails:any) => void;
}

const AiCheckModal = ({ visible, onClose, goBack, saveAICheckDetails }: AiCheckModalProps) => {
  const radioButtons = useMemo(() => ([
    {
        id: 'exact', // acts as primary key, should be unique and non-empty string
        label: 'Exact Match',
        value: 'exact'
    },
    {
        id: 'approx',
        label: 'Approximate Match',
        value: 'approx'
    }
  ]), []);
  
  
  
  const [title, setTitle] = useState('');
  const [checkType] = useState('Custom (Manual Input)');
  const [selectedId, setSelectedId] = useState('exact');
  const [textInput, setTextInput] = useState('');


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>AI Check</Text>
            <TouchableOpacity onPress={onClose}>
              <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.closeIcon} />
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
            <RadioGroup 
              radioButtons={radioButtons} 
              selectedId={selectedId}
              onPress={setSelectedId}
              layout='row'
            />
          </View>

          {/* Text Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Text Input</Text>
            <View style={{borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8 }}>
              <TextInput
                value={textInput}
                onChangeText={setTextInput}
                placeholder="Type Here:"
                multiline
                style={styles.textArea}
              />
            </View>
            
          </View>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={goBack}>
              <Text style={{textAlign: 'center'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => {
              saveAICheckDetails({title,  checkType, selectedId, textInput }),
              setTitle(''), 
              setTextInput('')
            }}>
              <Text style={{ textAlign: 'center' }}>Save</Text>
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
    width: '60%',
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
  closeIcon:{
    width: 24,
    height: 24
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
    backgroundColor: '#F5F5F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
    margin: 10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    width: 180,
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
    width: 180
  },
});

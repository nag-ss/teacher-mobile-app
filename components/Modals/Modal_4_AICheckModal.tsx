import React, { useState, useMemo, useEffect } from 'react';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import WritePadViewModal from '../PrepClass/WritePadView';
import { useDispatch } from 'react-redux';
import { translateAICheck } from '@/store/classSlice';

interface AiCheckModalProps {
  visible: boolean;
  taskType: string;
  selectedTask: any;
  onClose: () => void;
  goBack: () => void; 
  saveAICheckDetails: (AICheckDetails:any) => void;
}

const AiCheckModal = ({ selectedTask, visible, taskType, onClose, goBack, saveAICheckDetails }: AiCheckModalProps) => {
  const dispatch = useDispatch<any>();
  const radioButtons = useMemo(() => ([
    {
        id: 'exact', // acts as primary key, should be unique and non-empty string
        label: 'Exact Match',
        value: 'exact',
        color:"#21c17c"
    },
    {
        id: 'approx',
        label: 'Approximate Match',
        value: 'approx',
        color: "#21c17c"
    }
  ]), []);
  
  const [title, setTitle] = useState('');
  const [checkType] = useState('Custom (Manual Input)');
  const [selectedId, setSelectedId] = useState('approx');
  const [textInput, setTextInput] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [textInputError, setTextInputError] = useState('');
  const [showEditWriteModal, setShowEditWriteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const showEditWrite = () => {
    setShowEditWriteModal(true)
  }
  const hideEditWrite = () => {
    setShowEditWriteModal(false)
  }

  const updateText = async (url: string) => {
    const formData = new FormData();
  
    const file: any = {
        uri: url,
        type: 'image/png',
        name: 'upload.png',
    };
    // setImg("data:image/jpeg;base64,"+url)
    // hideEditWrite()
    formData.append('image', file);
    hideEditWrite()
    setLoading(true)
    let res =  await dispatch(translateAICheck(formData))
    console.log("res.payload img resp ")
    console.log(res.payload)
    // setTextInput(res.payload.translated_text)
    insertTextAtCursor(res.payload.translated_text)
    setLoading(false)
  }

  const insertTextAtCursor = (insertText: string) => {
    const { start, end } = selection;
    const before = start > 0 ? textInput[start - 1] : '';
    // Check char after cursor
    const after = end < textInput.length ? textInput[end] : '';

    // Add space before if needed
    const needsSpaceBefore = before && before !== ' ';
    // Add space after if needed
    const needsSpaceAfter = after && after !== ' ';

    let toInsert = insertText;
    if (needsSpaceBefore) toInsert = ' ' + toInsert;
    if (needsSpaceAfter) toInsert = toInsert + ' ';

    const newText = textInput.slice(0, start) + toInsert + textInput.slice(end);
    // Move cursor after inserted text
    const newCursorPosition = start + insertText.length;
    setTextInput(newText);
    setSelection({ start: newCursorPosition, end: newCursorPosition });
  };

  const cancelOrGoBack = () => {
    setTitle('')
    setTextInput('')
    setTextInputError('')
    setTitleError('')
    setLoading(false)
    goBack()
  }

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setSelectedId(selectedTask.instructions?.selectedId);
      setTextInput(selectedTask.instructions?.textInput);
    } else {
      setTitle('');
      setTextInput('');
    }
  }, [selectedTask]);

  const validateText = () => {
    if (!title) {
      setTitleError("Title is Required");
      return false;
    } 
    if (!textInput) {
      setTextInputError("Text Input is Required");
      return false;
    }
    setTitleError('');
    setTextInputError('');
    return true;
  };

  const saveTask = async () => {
    const isValid = validateText();
    if (isValid) { 
      setIsDisabled(true)
      await saveAICheckDetails({title, checkType, selectedId, textInput, taskId: selectedTask?.task_id })
      setTitle('')
      setTextInput('')
      setIsDisabled(false)
    }
    
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{taskType == 'AICheck' ? 'AI Check' : 'Class Work' }</Text>
            <TouchableOpacity onPress={cancelOrGoBack}>
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
              style={[styles.textInput, {borderColor: titleError ? 'red' : '#D1D5DB'}]}
            />
            {titleError && <Text style={{color : "red" }}>{titleError}</Text>}
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
            <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 4, alignItems: 'baseline'}}>
              <View>
                <Text style={styles.label}>Text Input</Text>
              </View>
              
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{marginRight: 8}}>Insert Formula</Text>
                <TouchableOpacity onPress={showEditWrite} style={{ height:35, width: 35, borderRadius: 999, backgroundColor: '#21c17c', justifyContent: 'center', alignItems: 'center'  }}>
                    <FontAwesome name="pencil" size={18} color="white" />
                </TouchableOpacity>
              </View>
              
            </View>
            
            <View style={{borderWidth: 1, borderColor: textInputError ? 'red' : '#D1D5DB', borderRadius: 8 }}>
              <TextInput
                value={textInput}
                onChangeText={setTextInput}
                selection={selection}
                onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
                placeholder="Type Here:"
                multiline
                style={styles.textArea}
              />
            </View>
            {textInputError && <Text style={{color : "red" }}>{textInputError}</Text>}
          </View>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelOrGoBack}>
              <Text style={{textAlign: 'center'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={isDisabled} style={styles.saveBtn} onPress={saveTask}>
              <Text style={{ textAlign: 'center' }}>{loading ? 'Processing' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <WritePadViewModal show={showEditWriteModal} onCancel={hideEditWrite} updateText={updateText} />
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
    padding: 24,
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
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#D1D5DB',
    padding: 10,
    fontSize: 14,
    height: 300,
    textAlignVertical: 'top',
    margin: 10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    width: 196,
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
    width: 196
  },
});

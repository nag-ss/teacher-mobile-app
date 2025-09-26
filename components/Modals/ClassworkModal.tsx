import React, { useState, useMemo, useEffect } from 'react';
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
import { RotateInDownLeft } from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import WritePadViewModal from '../PrepClass/WritePadView';
import { translateClasswork } from '@/store/classSlice';
import { useDispatch } from 'react-redux';
import RadioGroup from 'react-native-radio-buttons-group';

interface AiCheckModalProps {
  visible: boolean;
  taskType: string;
  selectedTask: any;
  onClose: () => void;
  goBack: () => void;
  goBackToTasksModal: () => void;
  saveAICheckDetails: (AICheckDetails:any) => void;
}

const ClassworkCheckModal = ({ selectedTask, visible, taskType, onClose, goBack, goBackToTasksModal, saveAICheckDetails }: AiCheckModalProps) => {
  const dispatch = useDispatch<any>();
  const [checkType] = useState('Custom (Manual Input)');
  // const radioButtons = useMemo(() => ([
  //   {
  //       id: 'exact', // acts as primary key, should be unique and non-empty string
  //       label: 'Exact Match',
  //       value: 'exact',
  //       color:"#21c17c"
  //   },
  //   {
  //       id: 'approx',
  //       label: 'Approximate Match',
  //       value: 'approx',
  //       color: "#21c17c"
  //   }
  // ]), []);

  const [title, setTitle] = useState('');
  // const [matchType, setMatchType] = useState('approx');
  const [textInput, setTextInput] = useState('');
  const [selectedTime, setSelectedTime] = useState(5);
  const [selectedMarks, setSelectedMarks] = useState(5);
  const [showMandatoryMsg, setShowMandatoryMsg] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showEditWriteModal, setShowEditWriteModal] = useState(false)
  const [img, setImg] = useState("")
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState({ start: 0, end: 0 });

    const showEditWrite = async () => {
      setShowEditWriteModal(true)
    }
    const hideEditWrite = () => {
      setShowEditWriteModal(false)
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
  
    const updateText = async (url: string) => {
      const formData = new FormData();
    
      const file: any = {
          uri: url,
          type: 'image/png',
          name: 'upload.png',
      };
      console.log("5")
      console.log("data:image/jpeg;base64,"+url)
      // setImg("data:image/jpeg;base64,"+url)
      // hideEditWrite()
      formData.append('image', file);
      hideEditWrite()
      setLoading(true)
      let res =  await dispatch(translateClasswork(formData))
      console.log("res.payload img resp ")
      console.log(res.payload)
      // setTextInput(res.payload.question_text)
      insertTextAtCursor(res.payload.question_text)
      setLoading(false)
    }

    // Options for the Grade and Section
  const timeOptions = [
    { label: '5 Mins', value: 5 },
    { label: '10 Mins', value: 10 },
    { label: '15 Mins', value: 15 },
    { label: '20 Mins', value: 20 },
    { label: '25 Mins', value: 25 },
    { label: '30 Mins', value: 30 },
    { label: '35 Mins', value: 35 },
    { label: '40 Mins', value: 40 },
    { label: '45 Mins', value: 45 },
    { label: '50 Mins', value: 50 },
    { label: '55 Mins', value: 55 },
  ];

  const marksOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
    { label: '25', value: 25 },
    { label: '30', value: 30 },
    { label: '35', value: 35 },
    { label: '40', value: 40 },
    { label: '45', value: 45 },
    { label: '50', value: 50 },
    { label: '55', value: 55 },
    { label: '60', value: 60 },
    { label: '65', value: 65 },
    { label: '70', value: 70 },
    { label: '75', value: 75 },
    { label: '80', value: 80 },
    { label: '85', value: 85 },
    { label: '90', value: 90 },
    { label: '95', value: 95 },
    { label: '100', value: 100 },
    
  ];
  
  const [marksOpen, setMarksOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const saveClassWork = async () => {
    if(!title || !selectedMarks || !selectedTime || !textInput) {
      setShowMandatoryMsg(true)
    } else {
      setShowMandatoryMsg(false)
      setIsDisabled(true)
      await saveAICheckDetails({title, matchType: 'approx', time: selectedTime, marks: selectedMarks, textInput, taskId: selectedTask?.task_id })
      setTitle(''), 
      // setMatchType('approx')
      setSelectedMarks(5)
      setSelectedTime(5)
      setTextInput('')
      setIsDisabled(false)
    }
    
  }

  const clearData = () => {
    setShowMandatoryMsg(false)
    setTitle('')
    setTextInput('')
    setSelectedMarks(5)
    setSelectedTime(5)
  }

  useEffect(() => {
      if (selectedTask) {
        console.log(selectedTask)
        setTitle(selectedTask.title);
        // setMatchType(selectedTask.instructions?.matchType);
        setTextInput(selectedTask.instructions?.textInput);
        setSelectedMarks(selectedTask.instructions?.marks)
        setSelectedTime(selectedTask.instructions?.time)
      } else {
        setTitle('');
        setTextInput('');
      }
    }, [selectedTask]);



  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Class Work Check</Text>
            <TouchableOpacity onPress={() => {
              clearData()
              onClose()
            }}>
              <Image source={require('../../assets/images/modal/state-layer.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>*Title</Text>
            <TextInput
              value={title}
              readOnly={selectedTask?.published_work_id}
              onChangeText={setTitle}
              placeholder="Enter check title"
              style={styles.textInput}
            />
          </View>

          {/* Check Type */}
          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Check Type</Text>
            <View style={styles.checkTypeContainer}>
              <Text>{checkType}</Text>
            </View>
          </View> */}

          <View style={[styles.inputGroup, styles.marksSection]}>
            <View style={{width: '49%', flexDirection: 'row',  justifyContent: 'space-between'}}>
              <View>
                <Text style={styles.marksLabel}>*Time:</Text>
              </View>
              <View style={{ width: '70%'}}>
                <DropDownPicker
                  placeholder="Select Time"
                  placeholderStyle={{ fontSize: 12 }}
                  open={timeOpen}
                  disabled={!!(selectedTask?.published_work_id)}
                  value={selectedTime}
                  items={timeOptions}
                  setOpen={setTimeOpen}
                  setValue={setSelectedTime}
                  // setItems={setItems}
                  style={{
                    borderColor: 'lightgray',      
                    borderRadius: 8,           
                  }}
                  dropDownContainerStyle={{
                    borderColor: 'lightgray'      
                  }}
                />
              </View>
            </View>
            <View style={{width: '49%', flexDirection: 'row',  justifyContent: 'space-between'}}>
              <View>
                <Text style={styles.marksLabel}>*Total Marks:</Text>
              </View>
              <View style={{ width: '60%'}}>
                <DropDownPicker
                  placeholder="Select Marks"
                  placeholderStyle={{ fontSize: 12 }}
                  disabled={!!(selectedTask?.published_work_id)}
                  open={marksOpen}
                  value={selectedMarks}
                  items={marksOptions}
                  setOpen={setMarksOpen}
                  setValue={setSelectedMarks}
                  // setItems={setItems}
                  style={{
                    borderColor: 'lightgray',      
                    borderRadius: 8,           
                  }}
                  dropDownContainerStyle={{
                    borderColor: 'lightgray'      
                  }}
                />
              </View>
            </View>
          </View>

          {/* Match Type */}
          <View style={styles.matchTypeRow}>
            {/* <View style={styles.switchRow}>
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
            </View> */}
            {/* <RadioGroup 
              radioButtons={radioButtons} 
              selectedId={matchType}
              onPress={setMatchType}
              layout='row'
              labelStyle={{width: 190}}
            /> */}
          </View>

          {/* Text Input */}

          <View style={styles.inputGroup}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                <Text style={styles.label}>*Text Input</Text>
                <TouchableOpacity onPress={showEditWrite} style={{ height:35, width: 35, borderRadius: 999, backgroundColor: '#21c17c', justifyContent: 'center', alignItems: 'center'  }}>
                    <FontAwesome name="pencil" size={18} color="white" />
                </TouchableOpacity>
              </View>
            <View style={{borderWidth: 1, borderColor: showMandatoryMsg ? 'red' : '#D1D5DB', borderRadius: 8 }}>
              <TextInput
                value={textInput}
                readOnly={selectedTask?.published_work_id}
                onChangeText={setTextInput}
                placeholder="Type Here:"
                multiline
                style={styles.textArea}
              />
            </View>
          </View>

          {
            showMandatoryMsg ? 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'red'}}>Please fill all the details</Text>
            </View> : null
          }
          {img && 
        <View style={{height: 50}}>
          <Image source={{uri: img}} />
        </View>
        
        }
          {/* Footer Buttons */}
          {!(selectedTask?.published_work_id) ? (<View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => {
              clearData()
              goBack()
            }}>
              <Text style={{textAlign: 'center'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={isDisabled} style={styles.saveBtn} onPress={() => {
              saveClassWork()
            }}>
              <Text style={{ textAlign: 'center' }}>{loading ? 'Processing..' : 'Save'}</Text>
            </TouchableOpacity>
          </View>): (<View style={styles.footerRight}>
            <TouchableOpacity style={[styles.saveBtn]} onPress={goBackToTasksModal}>
              <Text style={{textAlign: 'center'}}>Close</Text>
            </TouchableOpacity>
          </View>)}
          
        </View>
        
        
      </View>
      <WritePadViewModal show={showEditWriteModal} onCancel={hideEditWrite} updateText={updateText} />
    </Modal>
  );
};

export default ClassworkCheckModal;

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
    width: '70%',
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
    height: 300,
    textAlignVertical: 'top',
    margin: 10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    width: 230
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
    width: 230
  },
  marksSection: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  marksLabel: {
    marginTop: 15,
    marginRight: 15
  }
});

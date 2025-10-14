import React, { useState } from 'react';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EditWriteQuestionModal from './EditWriteQuestionModal';
import { useDispatch } from 'react-redux';
import { restoreQuestionId } from '@/store/classSlice';

interface EditQuestionModalProps {
  show: boolean;
  selectedQuestion: any;
  originalQuestionId: number;
  onCancel: () => void;
  updateEdit: () => void;
  replaceAgain: (id: number) => void;
}

const ReplaceEditQuestionModal: React.FC<EditQuestionModalProps> = ({ show, originalQuestionId, selectedQuestion, onCancel, updateEdit, replaceAgain }) => {
    const dispatch = useDispatch<any>();
    const [showEditWriteModal, setShowEditWriteModal] = useState(false)
    
      const showEditWrite = () => {
        setShowEditWriteModal(true)
      }
      const hideEditWrite = () => {
        setShowEditWriteModal(false)
      }
    const [question, setQuestion] = useState(selectedQuestion.body.Question)
    const onUpdate = () => {
        console.log("welcome to edit fun...")
        onCancel()
    }
    const openWriteModal = () => {
        console.log("welcome to edit fun...")
    }
    const updateQuestion = async () =>  {
        console.log("am in upd question")
        updateEdit()
    }
    const onReplace = async () => {
        await dispatch(restoreQuestionId(originalQuestionId))
        console.log("original question id ......", originalQuestionId)
        console.log("selected question id ......", selectedQuestion.question_id)
        replaceAgain(selectedQuestion.question_id)
    }
  return (
    <Modal visible={show} transparent animationType="fade">
      {selectedQuestion &&
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <View style={{marginBottom: 18.28}}>
                <Text style={styles.title}>{ "New Question"}</Text>
            </View>
            
            <View style={styles.inputGroup}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.label}>*Title</Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.markBox}>
                            <Text style={styles.markText}>Marks - 0{selectedQuestion.marks || 5}</Text>
                        </View>
                        <TouchableOpacity onPress={showEditWrite} style={{ height:35, width: 35, borderRadius: 999, backgroundColor: '#21c17c', justifyContent: 'center', alignItems: 'center'  }}>
                            <FontAwesome name="pencil" size={18} color="white" />
                        </TouchableOpacity>
                        
                    </View>
                    
                </View>
                
                <TextInput
                    value={selectedQuestion.body.Question}
                    onChangeText={setQuestion}
                    placeholder="Type Here:"
                    multiline
                    style={styles.textArea}
                />
            </View>
            {!selectedQuestion.is_objective ? 
            <View style={styles.inputGroup}>
                <Text style={styles.label}>*Answer</Text>
                <TextInput
                    value={selectedQuestion.answer.explanation}
                    onChangeText={setQuestion}
                    placeholder="Type Here:"
                    multiline
                    style={styles.textArea}
                />
            </View>
            :
            <View style={styles.optionsGrid}>
                {(selectedQuestion && selectedQuestion?.choice_body) && Object.keys(selectedQuestion?.choice_body).map((key:string) => (
                <View
                    key={key}
                    style={[
                    styles.optionBox,
                    key === selectedQuestion?.answer?.text && {
                        borderColor: '#059669',
                    },
                    ]}
                >
                    <MathJaxSvg 
                    fontCache={true}
                    fontSize={12}
                    >
                    {selectedQuestion?.choice_body[key]}
                    </MathJaxSvg>
                    {key === selectedQuestion?.answer.text && <AntDesign name="checkcircle" size={18} color='#21c17c' style={{ borderRadius: 999, backgroundColor: 'black'  }} />}
                </View>
                ))}
            </View> 
            }
          
          

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onReplace} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Replace</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onUpdate} style={styles.saveBtn}>
                    <Text style={styles.cancelButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
      }
      <EditWriteQuestionModal selectedQuestion={selectedQuestion} show={showEditWriteModal} onCancel={hideEditWrite} updateQuestion={updateQuestion} />
    </Modal>
  );
};

export default ReplaceEditQuestionModal;

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
    // width: '50%',
    // alignItems: 'center',
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
    justifyContent: 'flex-end', 
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
  textArea: {
    // backgroundColor: '#F5F5F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    // padding: 10,
    fontSize: 14,
    // height: 200,
    textAlignVertical: 'top',
    marginVertical: 13.7
  },
  optionsGrid: {
    marginTop: 10,
    padding: 10
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  markBox: {
    borderColor: '#21c17c',
    borderWidth: 0.6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    justifyContent: 'center'
  },
  markText: {
    fontSize: 9
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
    width: 140
  },
});

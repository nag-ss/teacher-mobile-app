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
import { editObjectiveQuestion, editSubjectiveQuestion } from '@/store/classSlice';

interface EditQuestionModalProps {
  show: boolean;
  selectedQuestion: any;
  onCancel: () => void;
  updateEdit: () => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ show, selectedQuestion, onCancel, updateEdit }) => {
    const dispatch = useDispatch<any>();
    const [showEditWriteModal, setShowEditWriteModal] = useState(false)
    const [selectedQuestionData, setSelectedQuestionData] = useState(selectedQuestion)
      const showEditWrite = () => {
        setShowEditWriteModal(true)
      }
      const hideEditWrite = () => {
        setShowEditWriteModal(false)
      }
    const [question, setQuestion] = useState(selectedQuestionData.body.Question)
    const onUpdate = async () => {
        console.log("welcome to edit fun...")
        if(selectedQuestionData.is_objective) {
            let req = {
                "question_id": selectedQuestionData.question_id,
                "question": selectedQuestionData.body.Question,
                "description": "",
                "choice_body": selectedQuestionData.choice_body,
                "choice_answer": selectedQuestionData.answer.text
              }
            console.log(req)
            await dispatch(editObjectiveQuestion(req))
        } else {
            let req = {
                "question_id": selectedQuestionData.question_id,
                "question": selectedQuestionData.body.Question,
                "description": "",
                "subjective_answer": selectedQuestionData.answer.explanation
              }
              console.log(req)
            await dispatch(editSubjectiveQuestion(req))
        }
        updateEdit()
    }
    const openWriteModal = () => {
        console.log("welcome to edit fun...")
    }
    const updateQuestion = async () =>  {
        console.log("am in upd question")
        updateEdit()
    }

    const updateAnswerText = async (key: string) => {
        console.log("update ans ....")
        let selData = JSON.parse(JSON.stringify(selectedQuestionData))
        selData.answer.text = key
        setSelectedQuestionData(selData)
    }

    const updateAnswerOption = async (key: string, value: string) => {
        let selData = JSON.parse(JSON.stringify(selectedQuestionData))
        selData.choice_body[key] = value
        setSelectedQuestionData(selData)
    }

    const setQuestionData = async(value: string) => {
        let selData = JSON.parse(JSON.stringify(selectedQuestionData))
        selData.body.Question = value
        setSelectedQuestionData(selData)
    }

    const setQuestionAnswer = async (value: string) => {
        let selData = JSON.parse(JSON.stringify(selectedQuestionData))
        selData.answer.explanation = value
        setSelectedQuestionData(selData)
        
    }
  return (
    <Modal visible={show} transparent animationType="fade">
      {selectedQuestionData &&
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <View>
                <Text style={styles.title}>{ "Question"}</Text>
            </View>
            
            <View style={styles.inputGroup}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.label}>*Title</Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.markBox}>
                            <Text style={styles.markText}>Marks - 0{selectedQuestionData.marks || 5}</Text>
                        </View>
                        <TouchableOpacity onPress={showEditWrite} style={{ height:35, width: 35, borderRadius: 999, backgroundColor: '#21c17c', justifyContent: 'center', alignItems: 'center'  }}>
                            <FontAwesome name="pencil" size={18} color="white" />
                        </TouchableOpacity>
                        
                    </View>
                    
                </View>
                
                <TextInput
                    value={selectedQuestionData.body.Question}
                    onChangeText={(v) => setQuestionData(v)}
                    placeholder="Type Here:"
                    multiline
                    style={styles.textArea}
                />
            </View>
            {!selectedQuestionData.is_objective ? 
            <View style={styles.inputGroup}>
                <Text style={styles.label}>*Answer</Text>
                <TextInput
                    value={selectedQuestionData.answer.explanation}
                    onChangeText={(v) => setQuestionAnswer(v)}
                    placeholder="Type Here:"
                    multiline
                    style={styles.textArea}
                />
            </View>
            :
            <View style={styles.optionsGrid}>
                {(selectedQuestionData && selectedQuestionData?.choice_body) && Object.keys(selectedQuestionData?.choice_body).map((key:string) => (
                <TouchableOpacity
                    onPress={() => updateAnswerText(key)}
                    key={key}
                    style={[
                    styles.optionBox,
                    key === selectedQuestionData?.answer?.text && {
                        borderColor: '#059669',
                    },
                    ]}
                >
                    {key === selectedQuestionData?.answer.text && <AntDesign name="checkcircle" size={18} color='#21c17c' style={{ borderRadius: 999, marginTop: 8, marginRight: 5 }} />}
                    <Text style={{marginTop: 8}}>{key + " )"}</Text>
                    <TextInput
                        value={selectedQuestionData?.choice_body[key]}
                        onChangeText={(v) => updateAnswerOption(key, v)}
                        placeholder="Type Here:"
                        // style={styles.textArea}
                    />
                    {/* <MathJaxSvg 
                    fontCache={true}
                    fontSize={12}
                    >
                    {selectedQuestion?.choice_body[key]}
                    </MathJaxSvg> */}
                    
                </TouchableOpacity>
                ))}
            </View> 
            }
          
          

            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onUpdate} style={styles.saveBtn}>
                    <Text style={styles.cancelButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
      }
      <EditWriteQuestionModal selectedQuestion={selectedQuestionData} show={showEditWriteModal} onCancel={hideEditWrite} updateQuestion={updateQuestion} />
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
    // width: '50%',
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
  textArea: {
    // backgroundColor: '#F5F5F6',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    height: 200,
    textAlignVertical: 'top',
    margin: 10
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
    // justifyContent: 'space-between'
  },
  markBox: {
    borderColor: '#21c17c',
    borderWidth: 0.6,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
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

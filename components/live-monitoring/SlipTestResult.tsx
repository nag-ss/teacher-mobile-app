import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import SlipTestQuestionResultModal from './SlipTestQuestionResult';
import SlipTestAnalysisModal from './SlipTestAnalysis';
import STAnalysisModal from './STAnalysis';

interface Props {
  visible: boolean;
  student: any;
  onClose: () => void;
}

const SlipTestResultModal = ({ visible, student, onClose }: Props) => {
  if (!student) return null;
  const { liveClass } = useSelector((state: any) => state.classes)
  const [token, setToken] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showAnalysisResult, setShowAnalysisResult] = useState(false)
  const [studentResult, setStudentResult] = useState({})

  const getStudentSTResult = async () => {
    
  }

  console.log("student")
  console.log(student)
  useEffect(() => {
    // getStudentSTResult()
    console.log("called r modal ....")
  }, [student.student_id])

  const closeModal = () => {
    setShowResult(false)
    setShowAnalysisResult(false)
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 18, fontWeight: '600'}}>Performance Summary</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.studentDetails}>
                <View style={[styles.iconView, {backgroundColor: 'lightgray', borderRadius: 10}]}>
                    <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/face.png')} />
                </View>
                <View style={styles.nameContnet}>
                    <View style={[styles.nameSection, {marginBottom: 9.14}]}>
                        <Text style={{marginRight: 10}}>{'Name:'}</Text>
                        <Text style={styles.name}>{student.student_name}</Text>
                    </View>
                    
                    <View style={styles.nameSection}>
                        <Text style={{marginRight: 10}}>{'Score:'}</Text>
                        <Text style={styles.name}>{student.score+"/"+student.total_marks}</Text>
                    </View>
                </View>
            </View>
            {
                (student.questions && student.questions.length) ?
                <View style={{marginTop: 13.7}}>
                    <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 13.7}}>Question Summary</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {student.questions.map((questionData: any, i: number) => (
                            <TouchableOpacity style={styles.questionsList} onPress={() => {setShowResult(true); setStudentResult(questionData)}} key={questionData.question_number.toString().padStart(2, '0')}>
                                <View>
                                    <Text>{'Q-'+(questionData.question_number.toString().padStart(2, '0'))}</Text>
                                    {/* <Text>{questionData.score}</Text> */}
                                </View>
                                <View style={{marginTop: 5}}>
                                    {
                                        questionData.question_type == 'subjective' ? 
                                        
                                    <Text style={{fontWeight: '600'}}>{questionData.marks_awarded + "/"+ questionData.max_marks}</Text> :
                                    <View>
                                        {!questionData.is_correct ?
                                            <Image style={{width: 20.5, height: 20.5}} source={require('../../assets/images/ss/close.png')} />
                                            : <Image style={{width: 20.5, height: 20.5}} source={require('../../assets/images/ss/Correct.png')} />
                                        }
                                    </View>
                                    }
                                </View>
                                
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                : null
            }
            <View style={{flexDirection: 'row', marginTop: 13.7, marginBottom: 13.7}}>
                <Text>AI Insight: </Text>
                <Text style={{fontWeight: '600'}}>{student.insight ? student.insight : ' --- '}</Text>
            </View>
          
            <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={() => {setShowAnalysisResult(true)}}>
                    <Text style={{ color: 'white' }}>View Details</Text>
                </TouchableOpacity>
            </View>

          
        </View>
      </View>
      {showResult ?
              <SlipTestQuestionResultModal
              visible={showResult}
              studentAnswer={studentResult}
              onClose={closeModal}
            /> : null
            }
      {/* showAnalysisResult ?
              <SlipTestAnalysisModal
              visible={showAnalysisResult}
              student={student}
              onClose={closeModal}
            /> : null
      */}
      { showAnalysisResult ?
              <STAnalysisModal
              visible={showAnalysisResult}
              student={student}
              onClose={closeModal}
            /> : null
      }
    </Modal>
  );
};

const styles = StyleSheet.create({
overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
},
modalContainer: {
    width: 436,
    maxHeight: '90%',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20
},
closeButton: {
    alignSelf: 'flex-end',
    // padding: 10,
    paddingRight: 10
  },
  closeText: {
    fontSize: 24,
    color: '#333',
  },
  studentDetails: {
    flexDirection: 'row'
  },
  iconView: {
    marginRight: 10,
    padding: 13.7,
    // backgroundColor: 'red'
  },
  icon: { fontSize: 30 },
  name: { fontWeight: '600' },
  status: { fontSize: 12, color: '#555' },
  nameContnet: {
    padding: 13.7,
    height: 65,
    justifyContent: 'center'
  },
  nameSection: {
    flexDirection: 'row',
    // marginBottom: 9.14
  },
  questionsList: {
    minWidth: 72,
    minHeight: 60,
    height: 64,
    borderColor: 'lightgray',
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 9.14,
    paddingHorizontal: 16,
    marginRight: 6.5
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
    width: '48%',
    alignItems: 'center'
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 8,
    width: '48%',
    alignItems: 'center'
  },
});

export default SlipTestResultModal;

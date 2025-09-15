import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

interface Props {
  visible: boolean;
  student: any;
  onClose: () => void;
}

const SlipTestResultModal = ({ visible, student, onClose }: Props) => {
  if (!student) return null;
  const { liveClass } = useSelector((state: any) => state.classes)
  const [token, setToken] = useState<string | null>(null)

  const getStudentSTResult = async () => {
    
  }
  useEffect(() => {
    // getStudentSTResult()
    console.log("called r modal ....")
  }, [student.student_id])

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
                <Text style={{fontSize: 24, fontWeight: '600'}}>Performance Summary</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.studentDetails}>
                <View style={styles.iconView}>
                    <Image style={{width: 50, height: 50}} source={require('../../assets/images/ss/Male.png')} />
                </View>
                <View style={styles.nameContnet}>
                    <View style={styles.nameSection}>
                        <Text style={{marginRight: 10, marginTop: 8}}>{'Name:'}</Text>
                        <Text style={styles.name}>{student.student_name}</Text>
                    </View>
                    
                    <View style={styles.nameSection}>
                        <Text style={{marginRight: 10, marginTop: 8}}>{'Score:'}</Text>
                        <Text style={styles.name}>{student.score+"/"+student.total_marks}</Text>
                    </View>
                </View>
            </View>
            {
                (student.questions && student.questions.length) ?
                <View>
                    <Text style={{fontSize: 20, fontWeight: '600'}}>Question Summary</Text>
                    <View style={{flexDirection: 'row', padding: 10, flexWrap: 'wrap'}}>
                        {student.questions.map((questionData: any, i: number) => (
                            <View style={styles.questionsList}>
                                <View>
                                    <Text>{'Q-'+(questionData.question_number)}</Text>
                                    <Text>{questionData.score}</Text>
                                </View>
                                <View>
                                    {
                                        questionData.question_type != 'objective' ? 
                                        <Text style={{fontWeight: '600'}}>{questionData.marks_awarded + "/"+ questionData.max_marks}</Text> :
                                        <View>
                                            {!questionData.is_correct ?
                                                <Image style={{width: 30, height: 30}} source={require('../../assets/images/ss/close.png')} />
                                                : <Image style={{width: 30, height: 30}} source={require('../../assets/images/ss/Correct.png')} />
                                            }
                                        </View>
                                    }
                                </View>
                                
                            </View>
                        ))}
                    </View>
                </View>
                : null
            }
            <View style={{flexDirection: 'row'}}>
                <Text>AI Insight: </Text>
                <Text style={{fontWeight: '600'}}>{student.insight}</Text>
            </View>
          
            <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={onClose}>
                    <Text style={{ color: 'white' }}>View Details</Text>
                </TouchableOpacity>
            </View>

          
        </View>
      </View>
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
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
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
    padding: 20,
  },
  icon: { fontSize: 30 },
  name: { fontWeight: '600', marginTop: 8 },
  status: { fontSize: 12, color: '#555' },
  nameContnet: {
    padding: 20,
  },
  nameSection: {
    flexDirection: 'row'
  },
  questionsList: {
    minWidth: '19%',
    borderRightColor: 'lightgray',
    borderRightWidth: 1,
    alignItems: 'center',
    marginBottom: 10
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

export default SlipTestResultModal;

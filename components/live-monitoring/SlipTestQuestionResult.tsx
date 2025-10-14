import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

interface Props {
  visible: boolean;
  studentAnswer: any;
  onClose: () => void;
}

const SlipTestQuestionResultModal = ({ visible, studentAnswer, onClose }: Props) => {
  if (!studentAnswer) return null;
  const { liveClass } = useSelector((state: any) => state.classes)
  const [token, setToken] = useState<string | null>(null)

  const getStudentSTResult = async () => {
    
  }
  console.log("studentAnswer")
  console.log(studentAnswer)
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20.5}}>
                <Text style={{fontSize: 18, fontWeight: '600'}}>{'Q-'+studentAnswer.question_number.toString().padStart(2, '0')} Analysis</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>

            
            <View style={styles.studentDetails}>
                <View style={styles.iconView}>
                    <Image style={{width: 27.4, height: 34.28}} source={require('../../assets/images/ss/q_level_analysis_a.png')} />
                </View>
                <View style={styles.nameContnet}>
                    <View style={styles.nameSection}>
                        <Text style={{marginRight: 10, marginTop: 8}}>{'Result:'}</Text>
                        <Text style={styles.name}>{'Correct'}</Text>
                    </View>
                    
                    <View style={styles.nameSection}>
                        <Text style={{marginRight: 10, marginTop: 8}}>{'Accuracy:'}</Text>
                        <Text style={styles.name}>{'100% (5 of 5 steps correct)'}</Text>
                    </View>
                </View>
            </View>
            <View style={{backgroundColor: '#BDEDD7', borderRadius: 10, paddingHorizontal: 13.7}}>
                <View style={styles.aiinsightSection}>
                    <Text>AI Insight: 
                    <Text style={{fontWeight: '600', lineHeight: 20}}> The student demonstrated strong understanding of the concept and executed all steps correctly with no calculation errors.</Text>
                    </Text>
                </View>
                
                <View style={styles.aiinsightSection}>
                    <Text style={{fontWeight: '600'}}> Strengths </Text> 
                    <View style={{flexDirection: 'row', padding: 5}}>
                        <Image style={{width: 20.5, height: 20.5}} source={require('../../assets/images/ss/Correct.png')} />
                        <Text>Correct diagram interpretation.</Text>
                    </View>
                </View>

                <View style={styles.aiinsightSection}>
                    <Text style={{fontWeight: '600'}}> Improvements Needed </Text> 
                    <View style={{flexDirection: 'row', padding: 5}}>
                        <Image style={{width: 20.5, height: 20.5}} source={require('../../assets/images/ss/close.png')} />
                        <Text>Correct diagram interpretation.</Text>
                    </View>
                </View>
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
    flexDirection: 'row',
    marginBottom: 20.5
  },
  iconView: {
    height: 54.5,
    width: 54.5,
    marginRight: 10,
    // padding: 13.7,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  icon: { fontSize: 30 },
  name: { fontWeight: '600', marginTop: 8 },
  status: { fontSize: 12, color: '#555' },
  nameContnet: {
    // padding: 20,,
    // backgroundColor: 'red',
    height: 54.5,
    marginTop: -5
  },
  nameSection: {
    flexDirection: 'row'
  },
  aiinsightSection: {
    marginBottom: 9.14,
    paddingVertical: 9.14
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

export default SlipTestQuestionResultModal;

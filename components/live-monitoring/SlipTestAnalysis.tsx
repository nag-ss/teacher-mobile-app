import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import ProgressCircle from './ProgressCircle';
import ProgressBar from '../dashboard/Progressbar';

interface Props {
  visible: boolean;
  student: any;
  onClose: () => void;
}

const RatingRow = ({ label, value }: any) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.circles}>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.circle,
              { backgroundColor: i < value ? '#21C17C' : '#DCDCDC' }
            ]}
          />
        ))}
      </View>
    </View>
  );
  
const SlipTestAnalysisModal = ({ visible, student, onClose }: Props) => {
  if (!student) return null;
  const { liveClass } = useSelector((state: any) => state.classes)
  const [token, setToken] = useState<string | null>(null)

  const getStudentSTResult = async () => {
    
  }
  console.log("studentAnswer")
  console.log(student)
  
  const data = [
    { label: 'Understanding', value: 3 },
    { label: 'Approach', value: 2 },
    { label: 'Accuracy', value: 4 },
    { label: 'Final Answer', value: 1 },
    { label: 'Presentation', value: 2 },
  ];

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
                <Text style={{fontSize: 18, fontWeight: '600'}}>{'Test'} Analysis</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>

            
            <View style={styles.studentDetails}>
                <View style={styles.nameContnet}>
                    <View style={styles.nameSection}>
                        <Text style={{marginRight: 10, marginTop: 8}}>{'Student:'}</Text>
                        <Text style={styles.name}>{student.student_name}</Text>
                    </View>
                    
                    <View style={styles.nameSection}>
                        <Text style={{marginRight: 10, marginTop: 8}}>{'Topic:'}</Text>
                        <Text style={styles.name}>{'Intergers'}</Text>
                    </View>
                    <View style={styles.nameSection}>
                        <Text style={{marginRight: 10, marginTop: 8}}>{'Date:'}</Text>
                        <Text style={styles.name}>{'2025-10-12'}</Text>
                    </View>
                </View>
            </View>
            <View  style={styles.keyMetricsSection}>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontWeight: '600'}}>Key Metrics</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: '48%', marginRight: 10}}>
                        <View style={styles.percentSection}>
                            <Text style={{}}>Percentage </Text>
                            <ProgressCircle progress={70} score={75} size={40} strokeWidth={4} color={'green'} />
                        </View>
                        <View style={styles.percentSection}>
                            <Text style={{}}>Total Score </Text>
                            <View style={{width: '25%'}}>
                                <View style={styles.progressBarContainer}>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: Math.round(50*(60/100)) }]} />
                                    </View>
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <Text>50/100</Text>
                                </View>
                            </View>
                            
                        </View>
                    </View>
                    <View style={{width: '48%'}}>
                    {data.map(({ label, value }) => (
                        <RatingRow key={label} label={label} value={value} />
                    ))}
                    </View>
                </View>
                
            </View>

            <View  style={styles.keyMetricsSection}>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>Insights</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: '48%', marginRight: 10}}>
                        <View style={styles.insightSection}>
                            <Text style={{fontWeight: '600', marginBottom: 18.28}}>Areas of Improvements </Text>
                            <View style={{width: '90%', flexDirection: 'row', marginBottom: 10}}>
                                <View style={styles.insightSectionContent}>
                                    <Text>1</Text>
                                </View>
                                <View>
                                    <Text style={styles.iText}>
                                        Include detailed calculations for the centroid’s coordinates.
                                    </Text>
                                </View>
                            </View>
                            <View style={{width: '90%', flexDirection: 'row', marginBottom: 10}}>
                                <View style={styles.insightSectionContent}>
                                    <Text>2</Text>
                                </View>
                                <View>
                                    <Text style={styles.iText}>
                                        Include detailed calculations for the centroid’s coordinates.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{width: '48%', marginRight: 10}}>
                        <View style={styles.insightSection}>
                            <Text style={{fontWeight: '600', marginBottom: 18.28}}>Areas of Improvements </Text>
                            <View style={{width: '90%', flexDirection: 'row', marginBottom: 10}}>
                                <View style={styles.insightSectionContent}>
                                    <Text>1</Text>
                                </View>
                                <View>
                                    <Text style={styles.iText}>
                                        Include detailed calculations for the centroid’s coordinates.
                                    </Text>
                                </View>
                            </View>
                            <View style={{width: '90%', flexDirection: 'row', marginBottom: 10}}>
                                <View style={styles.insightSectionContent}>
                                    <Text>2</Text>
                                </View>
                                <View>
                                    <Text style={styles.iText}>
                                        Include detailed calculations for the centroid’s coordinates.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: '48%', marginRight: 10}}>
                        <View style={styles.insightSection}>
                            <Text style={{fontWeight: '600', marginBottom: 18.28}}>Areas of Improvements </Text>
                            <View style={{width: '90%', flexDirection: 'row', marginBottom: 10}}>
                                <View style={styles.insightSectionContent}>
                                    <Text>1</Text>
                                </View>
                                <View>
                                    <Text style={styles.iText}>
                                        Include detailed calculations for the centroid’s coordinates.
                                    </Text>
                                </View>
                            </View>
                            <View style={{width: '90%', flexDirection: 'row', marginBottom: 10}}>
                                <View style={styles.insightSectionContent}>
                                    <Text>2</Text>
                                </View>
                                <View>
                                    <Text style={styles.iText}>
                                        Include detailed calculations for the centroid’s coordinates.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{width: '48%', marginRight: 10}}>
                        <View style={styles.insightSection}>
                            <Text style={{fontWeight: '600', marginBottom: 18.28}}>Areas of Improvements </Text>
                            <View style={{width: '90%', flexDirection: 'row', marginBottom: 10}}>
                                <View style={styles.insightSectionContent}>
                                    <Text>1</Text>
                                </View>
                                <View>
                                    <Text style={styles.iText}>
                                        Include detailed calculations for the centroid’s coordinates.
                                    </Text>
                                </View>
                            </View>
                            <View style={{width: '90%', flexDirection: 'row', marginBottom: 10}}>
                                <View style={styles.insightSectionContent}>
                                    <Text>2</Text>
                                </View>
                                <View>
                                    <Text style={styles.iText}>
                                        Include detailed calculations for the centroid’s coordinates.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                
            </View>
            
            <View  style={styles.keyMetricsSection}>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>Feedback</Text>
                </View>
                <View style={{}}>
                    <Text  style={styles.iText}>
                        The Student demonstrated a good understanding of the relationship between the medians and the centroid of a triangle. The explanation of how the medians intersect at the centroid was clear, and the use of the 2:1 ratio was correctly mentioned. However, the calculation of the centroid’s coordinates was not fully detailed, which affected the final answer’s accuracy.
                    </Text>
                </View>
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
    width: '80%',
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
    marginTop: -5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameSection: {
    flexDirection: 'row',
    width: '33%'
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
  keyMetricsSection: {
    backgroundColor: '#fff',
    padding: 18.28,
    borderRadius: 10,
    marginTop: 13.7
    // flexDirection: 'row'
  },
  percentSection: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 18.28,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 72,
    marginBottom: 13.7

  },
  progressBarContainer: {
    width: '100%',
    height: 16,
    justifyContent: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 8,
    backgroundColor: '#21C17C',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  label: {
    flex: 1,
    fontSize: 12,
    color: '#222',
  },
  circles: {
    flexDirection: 'row',
    // gap: 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: '#DCDCDC', // default gray
  },
  insightSection: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 18.28,
    borderRadius: 10,
    // height: 72,
    marginBottom: 13.7
  },
  insightSectionContent: {
    backgroundColor: 'green', 
    marginRight: 10, 
    height: 30, 
    width: 30, 
    alignItems: 'center', 
    padding: 5, 
    borderRadius: 100
},
iText: {
    color: 'gray'
}
});

export default SlipTestAnalysisModal;

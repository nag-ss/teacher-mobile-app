import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getSlipTestPerformance } from '@/store/liveMonitoringSlice';

//test url
// const webViewBaseUrl = 'https://superstudent.z13.web.core.windows.net'
//prod url
const webViewBaseUrl = 'https://superslateappstorage.z29.web.core.windows.net'
interface Props {
  visible: boolean;
  student: { student_name: string; status: string, student_id: number, class_schedule_id: number } | null;
  onClose: () => void;
}

const STAnalysisModal = ({ visible, student, onClose }: Props) => {
  if (!student) return null;
  const dispatch = useDispatch<any>()
  const { liveClass } = useSelector((state: any) => state.classes)
  const { studentPerformance, selectedTask } = useSelector((state: any) => state.liveMonitor)
  const {  } = useSelector((state: any) => state.liveMonitor)
  const [token, setToken] = useState<string | null>(null)
  const [pdfUrlLink, setPdfUrlLink] = useState('')

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    setToken(userToken)
    // console.log('https://superstudent.z13.web.core.windows.net/?token='+token+'&student='+student.student_id+'&class='+liveClass.class_schedule_id)
  }

  console.log("studentPerformance.download_url")
  console.log(studentPerformance?.download_url)
    const getDetails = async () => {
        console.log(selectedTask)
        console.log("selectedTask")
        const reqObj: any = {student_id: student.student_id, published_quiz_id: selectedTask.published_quiz_id}
        dispatch(getSlipTestPerformance(reqObj))
    }
  useFocusEffect(useCallback(() => {
      console.log("calling focus effect ....")
      getDetails()
    }, [])
    )

    useEffect(() => {
        if(studentPerformance) {
            // const pdfUrl = "https://example.com/sample.pdf"; // Replace with your cloud URL
            const pdfUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(studentPerformance.download_url)}`;
            setPdfUrlLink(pdfUrl)
        }
    }, [studentPerformance])

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        {
          (studentPerformance && studentPerformance.download_url) &&
          <WebView
                source={{ uri: pdfUrlLink }}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator size="large" />}
                style={{ flex: 1 }}
            />
          
        }
        
        {/* Add more student info here */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: '#f9f9f9',
    justifyContent: 'flex-start',
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#444',
  },
  webViewContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  }
});

export default STAnalysisModal;

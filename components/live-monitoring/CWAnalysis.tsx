import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getClassWorkPerformance } from '@/store/liveMonitoringSlice';

//test url
// const webViewBaseUrl = 'https://superstudent.z13.web.core.windows.net'
//prod url
const webViewBaseUrl = 'https://superslateappstorage.z29.web.core.windows.net'
interface Props {
  visible: boolean;
  student: { student_name: string; status: string, student_id: number, class_schedule_id: number, student_work_id: number } | null;
  onClose: () => void;
}

const StudentModal = ({ visible, student, onClose }: Props) => {
  if (!student) return null;
  const dispatch = useDispatch<any>()
  const { liveClass } = useSelector((state: any) => state.classes)
  const { studentCWPerformance } = useSelector((state: any) => state.liveMonitor)
  const [token, setToken] = useState<string | null>(null)
  const [pdfUrlLink, setPdfUrlLink] = useState('')

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    setToken(userToken)
    // console.log('https://superstudent.z13.web.core.windows.net/?token='+token+'&student='+student.student_id+'&class='+liveClass.class_schedule_id)
  }

    const getDetails = async () => {
        const reqObj: any = {student_work_id: student.student_work_id}
        console.log("req obj cw eval")
        dispatch(getClassWorkPerformance(reqObj))
    }
  useFocusEffect(useCallback(() => {
      getDetails()
    }, [])
    )
    useEffect(() => {
        if(studentCWPerformance) {
            console.log("studentCWPerformance")
            console.log(studentCWPerformance)
            // const pdfUrl = "https://example.com/sample.pdf"; // Replace with your cloud URL
            const pdfUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(studentCWPerformance.download_url)}`;
            setPdfUrlLink(pdfUrl)
            console.log("pdf url ", pdfUrl)
        }
    }, [studentCWPerformance])

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        {
          studentCWPerformance &&
          <WebView
                          source={{ uri: studentCWPerformance.download_url }}
                          startInLoadingState={true}
                          renderLoading={() => <ActivityIndicator size="large" />}
                          style={{ flex: 1 }}
                      />
        }
        {
          !studentCWPerformance &&
          <View
            style={{flex:1, justifyContent: 'center', alignItems: 'center'}}
            
           >
            <Text style={{fontWeight:  '600'}}>Loading Results .... </Text>
           </View>
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

export default StudentModal;

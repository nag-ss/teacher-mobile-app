import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

//test url
const webViewBaseUrl = 'https://superstudent.z13.web.core.windows.net'
//prod url
// const webViewBaseUrl = 'https://superslateappstorage.z29.web.core.windows.net'
interface Props {
  visible: boolean;
  student: { student_name: string; status: string, student_id: number, class_schedule_id: number } | null;
  onClose: () => void;
}

const StudentModal = ({ visible, student, onClose }: Props) => {
  if (!student) return null;
  const { liveClass } = useSelector((state: any) => state.classes)
  const [token, setToken] = useState<string | null>(null)

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    setToken(userToken)
    // console.log('https://superstudent.z13.web.core.windows.net/?token='+token+'&student='+student.student_id+'&class='+liveClass.class_schedule_id)
  }
  useEffect(() => {
    getToken()
  }, [])

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        {
          token &&
          <WebView
            style={styles.webViewContainer}
            source={{ uri: webViewBaseUrl+'/?token='+token+'&student='+student.student_id+'&class='+liveClass.class_schedule_id }}
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

export default StudentModal;

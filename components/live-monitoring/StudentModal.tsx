import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

interface Props {
  visible: boolean;
  student: { student_name: string; status: string } | null;
  onClose: () => void;
}

const StudentModal = ({ visible, student, onClose }: Props) => {
  if (!student) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <WebView
            style={styles.webViewContainer}
            source={{ uri: 'https://www.google.com/' }}
        />
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

import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Button,
  findNodeHandle,
  PanResponder
} from 'react-native';
import {MathJaxSvg} from 'react-native-mathjax-html-to-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SignatureCanvas from 'react-native-signature-canvas';
import { changeQuestionFromImage } from '@/store/classSlice';
import { useDispatch } from 'react-redux';
import * as FileSystem from 'expo-file-system';
// import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import ExpoDraw from 'expo-draw';
import { captureRef } from 'react-native-view-shot';

// import RNFS from 'react-native-fs';


interface EditQuestionModalProps {
  show: boolean;
  onCancel: () => void;
  updateText: (url: string) => void;
}

const WritePadViewModal: React.FC<EditQuestionModalProps> = ({ show, updateText, onCancel }) => {
    const dispatch = useDispatch<any>();
    const [signature, setSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [imageUri, setImageUri] = useState('');

  const [enabled, setEnabled] = React.useState(false);
    const panResponder = React.useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: (evt) => {
          // Stylus on Android: toolType === 2
          console.log("evt")
          console.log(evt.nativeEvent.force)
          if ('toolType' in evt.nativeEvent)
            return evt.nativeEvent.toolType === 2;
          // iOS stylus heuristic: altitudeAngle set
          if ('altitudeAngle' in evt.nativeEvent)
            return evt.nativeEvent.altitudeAngle !== undefined;
          return false;
        },
        onPanResponderGrant: () => setEnabled(true),
        onPanResponderRelease: () => setEnabled(false),
        onPanResponderTerminate: () => setEnabled(false),
      })
    ).current;

  const ref: any = useRef();

  const eraseRef = useRef(null);
  const clearRef = useRef(null);

  const handleSignature = async (signature: any) => {
    console.log('Signature captured:');
    setIsLoading(true)
    setSignature(signature);
    // setIsLoading(false);
    // console.log(signature)
    // console.log(selectedQuestion)
    const formData = new FormData();
    // formData.append('question_id', selectedQuestion.question_id);
    // formData.append('image', atob(signature.split(",")[1]));
    // const blob = base64ToBlob(signature);
    // const path = await saveBase64Image(signature)
    // const filePath = `${RNFS.DocumentDirectoryPath}/temp_image.jpg`;
// 
    // await RNFS.writeFile(filePath, signature, 'base64');


    // const file: any = {
    //     uri: signature,
    //     type: 'image/jpeg',
    //     name: 'upload.jpg',
    // };
    // console.log("5")
    // formData.append('image', file);
    // console.log("6")
    
    // await dispatch(changeQuestionFromImage(formData));
    console.log("after change ...")
    setIsLoading(false)
    // updateText()
  };

  const handleEmpty = () => {
    console.log('Signature is empty');
    setIsLoading(false);
  };

  const handleClear = () => {
    console.log('Signature cleared');
    setSignature(null);
    onCancel()
  };

  const handleError = (error: any) => {
    console.error('Signature pad error:', error);
    setIsLoading(false);
  };

  const handleEnd = () => {
    setIsLoading(true);
    ref.current?.readSignature();
  };

  const onUpdate = () => {

  }

  const updateStrokeColor = () => {
    setStrokeColor(strokeColor == '#fff' ? '#000000' : '#fff')
    setStrokeColor(strokeColor == 'red' ? '#000000' : 'red')
  }

  const canvasRef = useRef(null);
//   const viewRef = useRef(null);

  const viewRef = useRef<any>(null);

  const handleSaveImage = async () => {
    if (!viewRef.current) {
      console.warn('View ref is null, cannot capture');
      return;
    }
    const node = findNodeHandle(viewRef.current);
    if (!node) {
      console.warn('Could not find node handle');
      return;
    }
    try {
        const localUri = await captureRef(viewRef, {
            format: 'png',
            quality: 0.9,
            result: 'tmpfile', // saves to temp file for easier upload
          });
    
          const uri = localUri.startsWith('file://') ? localUri : 'file://' + localUri;
       
      updateText(uri)
    } catch (e) {
      console.error('Error capturing image:', e);
    }
  };

  return (
    <Modal visible={show} transparent animationType="fade">
      { 
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <View>
                <Text style={styles.title}>{ "Write Here"}</Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 16}}>
                
                <TouchableOpacity style={styles.editorButton} onPress={() => clearRef.current && clearRef.current()} >
                    <Text>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editorButton} onPress={() => eraseRef.current && eraseRef.current()} >
                    <Text>Undo</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.editorButton} onPress={updateStrokeColor} >
                    <Text>Erase</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{height: 400, marginBottom: 16}}>
                <View 
                ref={viewRef}
  collapsable={false}
  style={{ height: 400, backgroundColor: '#fff', borderWidth: 1 , borderRadius: 10, borderColor: 'lightgray'}} 
   >
                    <ExpoDraw
                        
                        containerStyle={{backgroundColor: '#fff', borderWidth: 1, borderColor: 'lightgray', borderRadius: 10}}
                        rewind={(undo: any) => {eraseRef.current = undo}}
                        clear={(clear: any) => {clearRef.current = clear}}
                        color={strokeColor}
                        strokeWidth={3}
                        enabled={true}
                    />
                
                </View>
            </View>
            
            <View style={[styles.buttonRow]}>
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveImage} style={styles.saveBtn}>
                    <Text style={styles.cancelButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
      }
    </Modal>
  );
};

export default WritePadViewModal;

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
    width: '90%',
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
    marginBottom: 16,
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
    justifyContent: 'space-between'
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
  editorButton: {
    paddingHorizontal:20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
  },
  preview: {
    marginTop: 15,
    height: 200,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
  },
});

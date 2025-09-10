import React, { useRef, useState } from 'react';
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
import SignatureCanvas from 'react-native-signature-canvas';
import { changeQuestionFromImage } from '@/store/classSlice';
import { useDispatch } from 'react-redux';
import * as FileSystem from 'expo-file-system';
// import RNFS from 'react-native-fs';


interface EditQuestionModalProps {
  show: boolean;
  selectedQuestion: any;
  onCancel: () => void;
  updateQuestion: () => void;
}

const EditWriteQuestionModal: React.FC<EditQuestionModalProps> = ({ show, selectedQuestion, updateQuestion, onCancel }) => {
    const dispatch = useDispatch<any>();
    const [signature, setSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const webStyle = `.m-signature-pad {
  position: fixed;
  margin:auto; 
  top: 0; 
  width:100%;
  height:90%
}
body,html { 
  position:relative; 
}
.m-signature-pad--footer .button {
  color: black
}
.m-signature-pad--footer .clear {
  background-color: #fff; /* Clear button color */
  border-color: lightgray
}
.m-signature-pad--footer .save {
  background-color: #10B981; /* Save button color */
}`
  const ref: any = useRef();

  function base64ToBlob(base64: any) {
    console.log("1")
    let parts = base64.split(',');
    let mime = parts[0].match(/:(.*?);/)[1];
    let bstr = atob(parts[1]);
    console.log("2")
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    console.log("3")
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    console.log("4")
    return new Blob([u8arr], { type: mime });
  }

  const saveBase64Image = async (base64String: string) => {
    const path = FileSystem.cacheDirectory + 'signature.png';
    await FileSystem.writeAsStringAsync(path, base64String, { encoding: FileSystem.EncodingType.Base64 });
    return path;
  };

  const handleSignature = async (signature: any) => {
    console.log('Signature captured:');
    setSignature(signature);
    // setIsLoading(false);
    // console.log(signature)
    // console.log(selectedQuestion)
    const formData = new FormData();
    formData.append('question_id', selectedQuestion.question_id);
    // formData.append('image', atob(signature.split(",")[1]));
    // const blob = base64ToBlob(signature);
    // const path = await saveBase64Image(signature)
    // const filePath = `${RNFS.DocumentDirectoryPath}/temp_image.jpg`;
// 
    // await RNFS.writeFile(filePath, signature, 'base64');


    const file: any = {
        uri: signature,
        type: 'image/jpeg',
        name: 'upload.jpg',
    };
    console.log("5")
    formData.append('image', file);
    console.log("6")
    const req = {
        question_id: selectedQuestion.question_id,
        image: atob(signature.split(",")[1])
    }
    await dispatch(changeQuestionFromImage(formData));
    console.log("after change ...")
    updateQuestion()
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
  return (
    <Modal visible={show} transparent animationType="fade">
      {selectedQuestion &&
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <View>
                <Text style={styles.title}>{ "Edit Question"}?</Text>
            </View>
            
            <View style={{  height: 500 }}>
                <SignatureCanvas
                    // ref={ref}
                    // onEnd={handleEnd}
                    onOK={handleSignature}
                    // onEmpty={handleEmpty}
                    onClear={handleClear}
                    // onError={handleError}
                    // autoClear={false}
                    descriptionText="Write Question"
                    clearText="Clear"
                    confirmText={"Save"}
                    // penColor="#000000"
                    // backgroundColor="rgba(255,255,255,0)"
                    // webviewProps={{
                    // // Custom WebView optimization
                    // cacheEnabled: true,
                    // androidLayerType: "hardware",
                    // }}
                    webStyle={webStyle}
                />
            </View>
            

          

            {/* <View style={[styles.buttonRow]}>
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onUpdate} style={styles.saveBtn}>
                    <Text style={styles.cancelButtonText}>Save</Text>
                </TouchableOpacity>
            </View> */}
        </View>
      </View>
      }
    </Modal>
  );
};

export default EditWriteQuestionModal;

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
    width: '100%',
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
});

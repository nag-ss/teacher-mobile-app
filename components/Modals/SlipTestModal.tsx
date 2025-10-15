import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import QuestionCard from '@/components/PrepClass/QuestionCard';
import DeleteQuestionModal from '@/components/PrepClass/DeleteQuestionModal';
import QuestionModal from '@/components/PrepClass/QuestionsModal';
import ReplaceQuestionModal from '@/components/PrepClass/ReplaceQuestionModal'
import { publishQuiz, getClassQuiz, deleteQuestion, replaceQuestion } from '@/store/classSlice';
// import questions from '../../data/Questions';

const { width } = Dimensions.get('window');
interface SlipTestDetailsModalProps { 
  selectedClass:any;
  selectedTask: any;
  new_quiz: boolean;
  visible: boolean;
  saveSlipTest: (task_id: number) => void;
  cancelSlipTest: (task_id: number) => void;
  closeSlipTest: () => void;
  // onClose: () => void;
  // goBack: () => void;
  // addTask: () => void;
  // deleteTask: (task_id: number, task_type: string) => void;
  // editTask: (task_id: number, task_type: string) => void;
  // viewQuiz: (quiz_id: number) => void;
}

const SlipTestDetailsModal = ({  selectedClass, selectedTask, new_quiz, visible, saveSlipTest, cancelSlipTest }: SlipTestDetailsModalProps) => {

  const dispatch = useDispatch<any>();
  const { quiz_details } = useSelector((state: any) => state.classes);
  const {questions, title} = quiz_details;
  const [activeDropdown, setActiveDropdown] = useState(-1);
  const [isDeleteQuestionModal, setDeleteQuestionModal] = useState(false);
  const [isQuestionModal, setQuestionModal] = useState(false);
  const [isReplaceQuestionModal, setReplaceQuestionModal] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [questionIdToDelete, setQuestionIdToDelete] = useState(-1);
  const [questionIdToReplace, setQuestionIdToReplace] = useState(-1);

  const editQuestion = (id: number) => {
    const question = (questions.filter((q: { question_id: number; }) => q.question_id == id))[0]
    setSelectedQuestion(question);
    setQuestionModal(true);
  };

  const deleteClicked = (id: number) => {
    setQuestionIdToDelete(id);
    setDeleteQuestionModal(true);
  };

  const confirmDelete = async() => {
    console.log(quiz_details);
    // Remove the hardcoded value
    const quiz_id = quiz_details.quiz_id;  
    await dispatch(deleteQuestion(questionIdToDelete))
    await dispatch(getClassQuiz(quiz_id));

    setDeleteQuestionModal(false);
  }

  const replaceClicked = (id: number) => {
    console.log(id);
    setQuestionIdToReplace(id);
    setReplaceQuestionModal(true);
  }

  const confirmReplace = async() => {
    const quiz_id = quiz_details.quiz_id;
    console.log(questionIdToReplace);
    await dispatch(replaceQuestion({question_id: questionIdToReplace, additional_context: "I want this question changed"}))
    await dispatch(getClassQuiz(quiz_id));
    setReplaceQuestionModal(false);
    setActiveDropdown(-1);
  }

  const refreshQuiz = async () => {
    console.log("calling refresh .....", quiz_details.quiz_id)
    await dispatch(getClassQuiz(quiz_details.quiz_id));
  }

  const renderQuestionCard = ({ item, index }: any) => {
    return (<QuestionCard newQuiz={new_quiz} item={item} task={selectedTask} index={index} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} editQuestion={editQuestion} deleteQuestion={deleteClicked} replaceQuestionFun={replaceClicked} refreshQuiz={refreshQuiz} />)
  }

  return (
    <View>
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.content}>
              <View style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'white', borderRadius: 10, marginBottom: 16}}>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.pageTitle}>{title} Preview</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 12, marginRight: 2}} >Topic:</Text>
                  <Text style={{fontSize: 12, fontWeight: 'bold', marginRight: 10}}>{quiz_details.topic}</Text>
                  <Text style={{fontSize: 12, marginRight: 2}}>Subtopic:</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 12}}>{quiz_details.sub_topic}</Text>
                </View>
              </View>
              
              <View style={{ backgroundColor: 'white', borderRadius: 10}}>
                <Text style={{fontSize: 16, marginLeft: 20, fontWeight: 'bold', marginTop: 8, marginBottom: 8}}>Questions</Text>
                <FlatList
                  data={questions}
                  keyExtractor={(item) => item.question_id.toString()}
                  renderItem={renderQuestionCard}
                  scrollEnabled={false}
                />
                {/* Pagination */}
                {/* <View style={styles.pagination}>
                  <TouchableOpacity style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../assets/images/back-icon.png')} style={{width: 12, height: 12,  padding: 5}} />
                    <Text style={styles.paginationLeftText}>Previous</Text>
                  </TouchableOpacity>
                  <View style={styles.pageNumbers}>
                    {[1, 2, '...', 9, 10].map((p, i) => (
                      <TouchableOpacity
                        key={i}
                        style={p==1 ? styles.pageButtonActive : styles.pageButton}
                      >
                        <Text style={p === 1 ? styles.pageButtonTextActive : styles.pageButtonText}>{String(p).padStart(2, '0')}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#21c17c', padding: 5, borderRadius: 4}}>
                    <Text style={styles.paginationRightText}>Next</Text>
                    <Image source={require('../../assets/images/arrow_forward_ios.png')} style={{width: 12, height: 12}} />
                  </TouchableOpacity>
                </View> */}

                {!(selectedTask?.published_quiz_id) ? (<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginLeft: 8, marginBottom: 16 }}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => cancelSlipTest(quiz_details.task_id)}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={() => saveSlipTest(quiz_details.task_id)}>
                    <Text>Save</Text>
                  </TouchableOpacity>
                </View>) : (<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', margin: 10 }}>
                  <TouchableOpacity style={styles.saveButton} onPress={() => saveSlipTest(quiz_details.task_id)}>
                    <Text>Close</Text>
                  </TouchableOpacity>
                </View>)}
              </View>
            </ScrollView>    
          </View>  
        </View>
      </Modal>
      <DeleteQuestionModal
        show={isDeleteQuestionModal}
        resourceType='question'
        onCancel={() => setDeleteQuestionModal(false)}
        onDelete={confirmDelete}
      />
      <QuestionModal
        ques={selectedQuestion}
        show={isQuestionModal}
        onCancel={() => setQuestionModal(false)}
      />
      
      <ReplaceQuestionModal 
        show={isReplaceQuestionModal}
        resourceType='question'
        onCancel={() => setReplaceQuestionModal(false)}
        onReplace={confirmReplace}
      />
    </View>
  );
};

export default SlipTestDetailsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 18.28,
    width: '90%',
    maxHeight: '90%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#6B7280',
    marginBottom: 16,
  },
  correctText: {
    color: '#059669',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  paginationLeftText: {
    marginLeft: 5,
    fontSize: 11,
    paddingRight: 5
  },
  paginationRightText: {
    marginRight: 5,
    fontSize: 11,
    paddingLeft: 5
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 4,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 2,
  },
  pageButtonActive: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#21c17c',
    marginHorizontal: 2,
  },
  pageButtonText: {
    fontSize: 10
  },
  pageButtonTextActive: {
    color: '#FFF',
    fontSize: 10
  },
  saveButton: {
    backgroundColor: '#21c17c',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 8,
    marginLeft: 9.14,
    marginRight: 16,
    alignItems: 'center',
    width: 150
  },
  cancelButton: {
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#21c17c',
    borderRadius: 8,
    marginLeft: 16,
    alignItems: 'center',
    width: 150
  },
});

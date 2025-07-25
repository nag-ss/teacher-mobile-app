import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import QuestionCard from '@/components/PrepClass/QuestionCard';
import DeleteQuestionModal from '@/components/PrepClass/DeleteQuestionModal';
import QuestionModal from '@/components/PrepClass/QuestionsModal';
import ReplaceQuestionModal from '@/components/PrepClass/ReplaceQuestionModal'
import { publishQuiz, getClassQuiz, deleteQuestion, replaceQuestion } from '@/store/classSlice';
import questions from '../../data/Questions';

const SlipTestPage = ({route, navigation} : {route: any; navigation: any}) => {
  const {new_quiz, selectedClass} = route.params;
  // const new_quiz = true;
  const dispatch = useDispatch<any>();
  const { quiz_details } = useSelector((state: any) => state.classes);
  const {questions} = quiz_details;
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
    const quiz_id = quiz_details.quiz_id || 35;
    console.log(questionIdToReplace);
    await dispatch(replaceQuestion({question_id: questionIdToReplace, additional_context: "I want this question changed"}))
    await dispatch(getClassQuiz(quiz_id));
    setReplaceQuestionModal(false);
  }

  const renderQuestionCard = ({ item, index }: any) => {
    return (<QuestionCard newQuiz={new_quiz} item={item} index={index} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} editQuestion={editQuestion} deleteQuestion={deleteClicked} replaceQuestion={replaceClicked} />)
  }

  const publishQuizTask = async() => {
    // const the_quiz = {
    //   start_time: quiz_details.start_date, 
    //   quiz_id: quiz_details.quiz_id, 
    //   quiz_type: "SlipTest", 
    //   duration: quiz_details.duration, 
    //   division_id: selectedClass.division_id,
    //   task_id: quiz_details.task_id
    // }
    // await dispatch(publishQuiz(the_quiz));
    navigation.navigate('Home');  
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'white', borderRadius: 10, marginBottom: 10}}>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => console.log("I was pressed")}>
              <Image source={require('../../assets/images/back-icon.png')} style={{ width: 12, height: 12, marginRight: 5}} />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Slip Test Preview</Text>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 12, marginRight: 2}} >Topic:</Text>
            <Text style={{fontSize: 12, fontWeight: 'bold', marginRight: 10}}>{quiz_details.topic}</Text>
            <Text style={{fontSize: 12, marginRight: 2}}>Subtopic:</Text>
            <Text style={{fontWeight: 'bold', fontSize: 12}}>{quiz_details.sub_topic}</Text>
            <Image source={require('../../assets/images/ss/Notification.png')} style={{ width: 22, height: 22}} />
          </View>
        </View>
        
        <View style={{ backgroundColor: 'white', borderRadius: 10}}>
          <Text style={{fontSize: 16, marginLeft: 20, fontWeight: 'bold', marginTop: 10}}>Questions</Text>
          <FlatList
            data={questions}
            keyExtractor={(item) => item.question_id.toString()}
            renderItem={renderQuestionCard}
            scrollEnabled={false}
          />
          {/* Pagination */}
          <View style={styles.pagination}>
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
          </View>

          { new_quiz && (<View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24}}>
            <TouchableOpacity style={styles.saveButton} onPress={publishQuizTask}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>)}
        </View>
      </ScrollView>

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

export default SlipTestPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
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
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10
  },
  saveButtonText: {
    marginLeft: 50,
    marginRight: 50
  }
});

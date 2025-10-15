import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Pressable
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MathJaxSvg} from 'react-native-mathjax-html-to-svg';
import EditQuestionModal from './EditQuestionModal';
import ReplaceQuestionModal from './ReplaceQuestionModal';
import { useDispatch } from 'react-redux';
import { replaceQuestion } from '@/store/classSlice';
import ReplaceEditQuestionModal from './ReplaceEditQuestionModal';

const { width } = Dimensions.get('window');

interface QuestionCardProps {
  item: any;
  index: number;
  activeDropdown: number;
  newQuiz: boolean;
  task: any;
  setActiveDropdown: (id: number) => void;
  editQuestion: (id: number) => void;
  deleteQuestion: (id: number) => void;
  replaceQuestionFun: (id: number) => void;
  refreshQuiz: () => void;
};

const QuestionCard = ({item, index, task, activeDropdown, newQuiz, setActiveDropdown, editQuestion, deleteQuestion, replaceQuestionFun, refreshQuiz}: QuestionCardProps) => {
  // console.log("question =====")
  // console.log(item)
  const dispatch = useDispatch<any>();
  const [showEditModal, setShowEditModal] = useState(false)
  const [showReplaceEditModal, setShowReplaceEditModal] = useState(false)
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState<any>(0)
  const [isReplaceQuestionModal, setIsReplaceQuestionModal] = useState(false)
  const [replacedQuestion, setReplacedQuestion] = useState<any>();
  const [selectedQuestion, setSelectedQuestion] = useState(item)
  const [selectedQuestionOriginal, setSelectedQuestionOriginal] = useState(0)

  const showEdit = () => {
    setShowEditModal(true)
  }
  const hideEdit = () => {
    setShowEditModal(false)
    setShowReplaceEditModal(false)
    setIsReplaceQuestionModal(false)
    updateEdit()
  }
  const updateEdit = () => {
    console.log(" upd edit calling refresh ....")
    refreshQuiz()
  }
  const replaceQuestionData = (id: number) => {
    setSelectedQuestionNumber(id)
    setIsReplaceQuestionModal(true)
  }

  const confirmReplace = async(newQuestionId: number = 0) => {
    console.log("selectedQuestionNumber new", newQuestionId)
    const questionId = newQuestionId ? newQuestionId : selectedQuestionNumber
    let replaceResponse = await dispatch(replaceQuestion({question_id: questionId, additional_context: "I want this question changed"}))
    console.log("replaceResponse.payload")
    console.log(replaceResponse.payload)
    setReplacedQuestion(replaceResponse.payload)
    setSelectedQuestion(replaceResponse.payload.new_question)
    setSelectedQuestionOriginal(replaceResponse.payload.original_question_id)
    setShowReplaceEditModal(true)
    // await dispatch(getClassQuiz(quiz_id));
      // setReplaceQuestionModal(false);
      // setActiveDropdown(-1);
    }

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setActiveDropdown(-1)}>
        <View style={styles.cardHeader}>
          <View style={styles.indexBox}>
            <Text style={styles.indexText}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <MathJaxSvg 
            fontCache={true}
            fontSize={12}
            style={styles.questionText}
          >
            {item.body.Question}
          </MathJaxSvg>
          <View style={styles.markBox}>
            <Text style={styles.markText}>Marks - {item.marks < 10 ? "0" + item.marks : item.marks}</Text>
          </View>
          { !(task?.published_quiz_id) && (<TouchableOpacity style={{backgroundColor: '#F5F5F5', borderRadius: 999}} onPress={() => setActiveDropdown(activeDropdown === index ? -1 : index)}>
            <Feather name="more-vertical" size={20} color="#4B5563" />
          </TouchableOpacity>)}
        </View>
      </Pressable>
      

      {/* {taskOptionsVisible && (<View style={{...styles.actionBox, marginTop: mt}}>
              {item.task_type != 'SlipTest' && (<TouchableHighlight underlayColor='#bdedd7' style={{borderBottomWidth: 0.5}} onPress={() => editTask(item.task_id, item.task_type)}>
                <Text style={styles.actionButton}>Edit</Text>
              </TouchableHighlight>)}
              <TouchableHighlight underlayColor='#bdedd7' onPress={() => deleteTask(item.task_id, item.task_type)}>
                <Text style={styles.actionButton}>Delete</Text>
              </TouchableHighlight>
            </View>)} */}

      {activeDropdown === index && (
        <View style={styles.dropdown}>
          <TouchableHighlight underlayColor='#bdedd7' onPress={() => {
              setActiveDropdown(-1);
              showEdit()
            }} style={[styles.dropdownItem, {borderBottomWidth: 0.5}]}>
            <Text>Edit</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#bdedd7' onPress={() => {
              setActiveDropdown(-1);
              replaceQuestionData(item.question_id)
            }} style={[styles.dropdownItem, {borderBottomWidth: 0.5}]}>
            <Text>Replace</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#bdedd7' onPress={() => {
              setActiveDropdown(-1);
              deleteQuestion(item.question_id)
            }} style={styles.dropdownItem}>
            <Text>Delete</Text>
          </TouchableHighlight>
        </View>
      )}

      {/* Subjective Answer */}
      {!item.is_objective && (
        <View style={{}}>
          <View style={styles.answerBox}>
            <Text style={{ fontSize: 12 }}>Answer: </Text>
            <MathJaxSvg
              fontCache={true}
              fontSize={12}
            >
              {item.answer.explanation}
            </MathJaxSvg>
          </View>
        </View>
      )}

      {/* Objective Options */}
      {item.is_objective && (
        <View style={{}}>
          {Object.keys(item.choice_body).map((key:string) => (
            <View
              key={key}
              style={[
                styles.optionBox,
                key === item.answer?.text && {
                  borderColor: '#059669',
                },
              ]}
            >
              <View style={{display: 'flex', flexDirection: 'row', maxWidth: '97%', alignItems:  'center'}}>
                <Text style={{fontSize: 12, marginRight: 8}}>{key}&#41;</Text>
                <MathJaxSvg 
                  fontCache={true}
                  fontSize={12}
                >
                  {item.choice_body[key]}
                </MathJaxSvg>
              </View>
              
              {key === item.answer.text && <AntDesign name="checkcircle" size={18} color='#21c17c' style={{ borderRadius: 999, backgroundColor: 'black', maxHeight: 19 }} />}
            </View>
          ))}
        </View>
      )}
      <EditQuestionModal selectedQuestion={selectedQuestion} show={showEditModal} onCancel={hideEdit} updateEdit={updateEdit} />
      <ReplaceEditQuestionModal originalQuestionId={selectedQuestionOriginal} selectedQuestion={selectedQuestion} show={showReplaceEditModal} onCancel={hideEdit} updateEdit={updateEdit} replaceAgain={confirmReplace} />
      <ReplaceQuestionModal 
        show={isReplaceQuestionModal}
        resourceType='question'
        
        onCancel={() => setIsReplaceQuestionModal(false)}
        onReplace={confirmReplace}
      />
    </View>
  );
}

export default QuestionCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    // margin: 16,
    padding: 13.7,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    // backgroundColor: 'red'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 9.14
  },
  indexBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderColor: '#E5E7EB',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontWeight: 'bold',
  },
  questionText: {
    flex: 1,
    marginLeft: 10,
    // paddingRight: 10
  },
  markBox: {
    borderColor: '#888888',
    borderWidth: 0.6,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
  },
  markText: {
    fontSize: 9
  },
  dropdown: {
    zIndex: 100,
    display: 'flex', 
    position: 'absolute', 
    backgroundColor: 'white',
    marginLeft: 510, 
    borderWidth: 1, 
    borderRadius: 8,
    marginTop: 32,
  },
  dropdownItem: {
    padding: 8,
  },
  answerBox: {
    backgroundColor: '#f5f5f5',
    borderColor: '#b8b8b8',
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 8,
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9.14
  }
});
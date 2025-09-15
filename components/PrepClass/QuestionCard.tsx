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
  setActiveDropdown: (id: number) => void;
  editQuestion: (id: number) => void;
  deleteQuestion: (id: number) => void;
  replaceQuestionFun: (id: number) => void;
  refreshQuiz: () => void;
};

const QuestionCard = ({item, index, activeDropdown, newQuiz, setActiveDropdown, editQuestion, deleteQuestion, replaceQuestionFun, refreshQuiz}: QuestionCardProps) => {
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

  const confirmReplace = async(id = 0) => {
    console.log("selectedQuestionNumber", selectedQuestionNumber)
      let replaceResponse = await dispatch(replaceQuestion({question_id: (id ? id : selectedQuestionNumber), additional_context: "I want this question changed"}))
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
            <Text style={styles.markText}>Marks - 0{item.marks || 5}</Text>
          </View>
          {newQuiz && (<TouchableOpacity style={{backgroundColor: '#F5F5F5', borderRadius: 999}} onPress={() => setActiveDropdown(activeDropdown === index ? -1 : index)}>
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
          <TouchableHighlight underlayColor='#bdedd7' onPress={() => showEdit()} style={styles.dropdownItem}>
            <Text>Edit</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#bdedd7' onPress={() => replaceQuestionData(item.question_id)} style={styles.dropdownItem}>
            <Text>Replace</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor='#bdedd7' onPress={() => deleteQuestion(item.question_id)} style={styles.dropdownItem}>
            <Text>Delete</Text>
          </TouchableHighlight>
        </View>
      )}

      {/* Subjective Answer */}
      {!item.is_objective && (
        <View style={{margin: 10}}>
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
        <View style={styles.optionsGrid}>
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
              <MathJaxSvg 
                fontCache={true}
                fontSize={12}
              >
                {item.choice_body[key]}
              </MathJaxSvg>
              {key === item.answer.text && <AntDesign name="checkcircle" size={18} color='#21c17c' style={{ borderRadius: 999, backgroundColor: 'black'  }} />}
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
    margin: 10,
    marginBottom: 20,
    borderColor: '#E5E7EB',
    borderWidth: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    margin: 10
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
  dropdown: {
    zIndex: 100,
    display: 'flex', 
    position: 'absolute', 
    backgroundColor: 'white',
    marginLeft: 570, 
    borderWidth: 1, 
    borderRadius: 8,
    marginTop: 40,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.5
  },
  answerBox: {
    backgroundColor: '#f5f5f5',
    borderColor: '#b8b8b8',
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
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
  }
});
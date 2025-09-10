import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SummaryModal from '@/components/Modals/Modal_1_SummaryModal';
import ClassTaskCardPop from '@/components/Modals/Modal_2_ClassTaskModal';
import NewTaskModal from '@/components/Modals/Modal_3_CreateTaskModal';
import AiCheckModal from '@/components/Modals/Modal_4_AICheckModal';
import GenerateSlipTestModal from '@/components/Modals/Modal_5_GenerateSlipTest';
import TestSettingsModal from '@/components/Modals/Modal_6_SlipTestDetails';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { 
  addTaskToClass, 
  getTeacherClassTasks, 
  deleteTeacherClassTask, 
  editTeacherClassTask, 
  addSlipTestToClass,
  updateSlipTest, 
  getClassQuiz,
  getClassTopicSubTopics,
  setClassTopicSubTopic
} from '@/store/classSlice';
import DeleteQuestionModal from '@/components/PrepClass/DeleteQuestionModal';
import LoadingSlipTestModal from '@/components/PrepClass/LoadingSlipTestModal';
import ClassworkCheckModal from '../Modals/ClassworkModal';
import SlipTestDetailsModal from '../Modals/SlipTestModal';
// import {Topics} from '../../data/Topic_SubTopic';

type ProfileScreenNavigationProp = DrawerNavigationProp<any, any>; 
type MyComponentProps = {
  item: any; // ideally replace `any` with the actual type
  selectedClass: any;
};

const ClassPrep = forwardRef<any, MyComponentProps>(({ item, selectedClass }, ref) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const dispatch = useDispatch<any>();
  const { classTasks, topics } = useSelector((state: any) => state.classes);
  const {user} = useSelector((state: any) => state.user);
  
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [topic, setTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [taskType, setTaskType] = useState("AICheck");
  const [taskIDToDelete, setTaskIDToDelete] = useState<number>(-1)
  const [taskIDToEdit, setTaskIDToEdit] = useState<number>(-1)

  const [showModal1SummaryModal, setShowModal1SummaryModal] = useState(false);
  const [showModal2TasksModal, setShowModal2TasksModal] = useState(false);
  const [showModal3NewTasksModal, setShowModal3NewTaskModal] = useState(false);
  const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
  const [showClassWorkModal, setShowClassWorkModal] = useState(false);
  const [showModal5GenerateSlipTestModal, setShowModal5GenerateSlipTestModal] = useState(false);
  const [showModal6SlipTestSettingsModal, setShowModal6SlipTestSettingsModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false)
  const [showLoadingQuizModal, setShowLoadingQuizModal] = useState(false);
  const [showSlipTestDetailsModal, setShowSlipTestDetailsModal] = useState(false);
  const [isNewQuiz, setIsNewQuiz] = useState(false);

  const setSelectedClass = async() => {
    console.log("Action from Parent!", "You triggered this from parent.");
    const tasksObject = {
      class_schedule_id: selectedClass.class_schedule_id,
      teacher_id: user.id,
      subject_id: selectedClass.subject_id,
      division_id: selectedClass.division_id,
    }

    console.log("selectedClass");
    console.log(selectedClass);

    await dispatch(getTeacherClassTasks(tasksObject))
    await dispatch(getClassTopicSubTopics({subject_id: selectedClass.subject_id, division_id: selectedClass.division_id}))
    
    if (selectedClass?.class_details[0]?.topic) {
      setTopic(selectedClass?.class_details[0]?.topic)
      setSubTopic(selectedClass?.class_details[0]?.sub_topic[0])
      setShowModal2TasksModal(true) 
    } else {
      setShowModal1SummaryModal(true)
    }
  };
    
  useImperativeHandle(ref, () => ({
    setSelectedClass,
  }));
      
  const setTopicSubTopicAndMoveToNext = async(topic: any, subTopic: any) => {
    await dispatch(setClassTopicSubTopic({
      class_schedule_id: selectedClass.class_schedule_id,
      subject_topic_id: subTopic.id
    }))
    setTopic(topic.topic)
    setSubTopic(subTopic.sub_topic)
    setShowModal1SummaryModal(false)
    setShowModal2TasksModal(true)
  }
  
  const backToSummaryModal = () => {
    setShowModal2TasksModal(false)
    setShowModal1SummaryModal(true)
  }

  const showAddTaskModal = () => {
    setShowModal2TasksModal(false)
    setShowModal3NewTaskModal(true)
  }

  const backToShowDetailsModal = () => {
    setShowModal3NewTaskModal(false)
    setShowModal2TasksModal(true)
  }

  const gotoTask = (taskTitle: string) => {
    if(taskTitle == 'AICheck' ) {
      setShowModal3NewTaskModal(false)
      setSelectedTask(null);
      setShowModal4AICheckModal(true)
      setTaskType(taskTitle)
    } else if(taskTitle == 'Classwork') {
      setShowModal3NewTaskModal(false)
      setSelectedTask(null);
      setShowModal4AICheckModal(false)
      setShowClassWorkModal(true)
      setTaskType(taskTitle)
    } else if(taskTitle == 'SlipTest') {
      setShowModal3NewTaskModal(false)
      setShowModal5GenerateSlipTestModal(true)
      setTaskType(taskTitle)
    } else {
      // setCreateTaskModalOpen(false)
      // setShowCWTaskModal(true)
      alert("Task type unidentifiable")
    }
  }

  const backToNewTasksModal = () => {
    setShowModal4AICheckModal(false)
    setShowClassWorkModal(false)
    setShowModal3NewTaskModal(true)
  }

  const goToSlipTestDetails = () => {
    setShowModal5GenerateSlipTestModal(false)
    setShowModal6SlipTestSettingsModal(true)
  }

  const saveAICheckDetails = async(aiCheckDetails: any) => { 
    const data: any = {
      title: aiCheckDetails.title,
      instructions: {
        ...aiCheckDetails
      },
      task_type: taskType,
      subject_id: selectedClass.subject_id,
      division_id: selectedClass.division_id,
      teacher_id: user.id,
      class_schedule_id: selectedClass.class_schedule_id,
      start_date: selectedClass.date,
      end_date: selectedClass.date,
    }

    console.log(data);
    
    if(aiCheckDetails.taskId) {
      await dispatch(editTeacherClassTask({id: aiCheckDetails.taskId, ...data}))
    } else {
      await dispatch(addTaskToClass(data))
    }

    const tasksObject = {
      class_schedule_id: selectedClass.class_schedule_id,
      teacher_id: user.id,
      subject_id: selectedClass.subject_id,
      division_id: selectedClass.division_id,
    }
    await dispatch(getTeacherClassTasks(tasksObject))
    setShowModal4AICheckModal(false)
    setShowModal2TasksModal(true)
  }

  const saveClassWorkCheckDetails = async(aiCheckDetails: any) => { 
    const data: any = {
      title: aiCheckDetails.title,
      instructions: {
        ...aiCheckDetails
      },
      task_type: taskType,
      subject_id: selectedClass.subject_id,
      division_id: selectedClass.division_id,
      teacher_id: user.id,
      class_schedule_id: selectedClass.class_schedule_id,
      start_date: selectedClass.date,
      end_date: selectedClass.date,
    }

    console.log(data);
    
    if(aiCheckDetails.taskId) {
      await dispatch(editTeacherClassTask({id: aiCheckDetails.taskId, ...data}))
    } else {
      await dispatch(addTaskToClass(data))
    }

    const tasksObject = {
      class_schedule_id: selectedClass.class_schedule_id,
      teacher_id: user.id,
      subject_id: selectedClass.subject_id,
      division_id: selectedClass.division_id,
    }
    await dispatch(getTeacherClassTasks(tasksObject))
    setShowClassWorkModal(false)
    setShowModal2TasksModal(true)
  }

  const saveSlipTestDetails = async(slipTestDetails: any) => {
      setShowModal6SlipTestSettingsModal(false)
      setShowLoadingQuizModal(true)
      let difficulty = slipTestDetails.difficulty;
      if (difficulty > 6) {
        difficulty = 6
      } else if (difficulty == 0) {
        difficulty = 1
      }
      if (selectedTask && selectedTask.task_type == 'SlipTest') {
        console.log('I am editing a quiz');
        console.log(selectedTask);
        const quizDetails: any = {
          title: selectedTask.title, 
          task_type: "SlipTest", 
          start_date: selectedTask.start_date,
          end_date: selectedTask.end_date,
          quiz_id: selectedTask.quiz_id,
          task_id: selectedTask.task_id,
          instructions: {
            objective_questions: slipTestDetails.mcqCount,
            subjective_questions: slipTestDetails.subCount,
            total_questions: slipTestDetails.totalQuestions,
            total_marks: slipTestDetails.marks,
          },
          subject_id: selectedClass.subject_id,
          division_id: selectedClass.division_id,
          // division_id: 37,
          teacher_id: user.id,
          class_schedule_id: selectedTask.class_schedule_id,
          quiz: {
            title: selectedTask.quiz_details.title,
            start_date: selectedTask.quiz_details.start_date, // Change the hard coded start date
            duration: slipTestDetails.duration,
            is_auto: true,
            asset_link: {},
            topic: topic,
            // topic: 'Integer',
            sub_topic: subTopic,
            // sub_topic: 'Addition, Subtraction, Division, Multiplication',
            skills: {},
            quiz_type: "SlipTest",
            is_public: true,
            difficulty_id: difficulty, // Set difficulty to that coming from the UI,not set since the backend only has difficulty upto 7 
            school_id: user.school_id,
            division_id: selectedClass.division_id,
            subject_id: selectedClass.subject_id,
            is_notified: false,
            instructions: {
              objective_questions: slipTestDetails.mcqCount,
              subjective_questions: slipTestDetails.subCount,
              total_questions: slipTestDetails.totalQuestions,
              total_marks: slipTestDetails.marks,
            }
          }
        };
        await dispatch(updateSlipTest(quizDetails));
      } else {
        console.log('I am creating a quiz');
        // const quiz_title = `Slip Test ${Math.floor(Math.random() * 1000)}`;
        const quiz_title = slipTestDetails.title;
        const quizDetails: any = {
          title: quiz_title, 
          task_type: "SlipTest", 
          start_date: moment().format("YYYY-MM-DD"),
          end_date: moment().add(10, 'days').format("YYYY-MM-DD"),
          instructions: {
            objective_questions: slipTestDetails.mcqCount,
            subjective_questions: slipTestDetails.subCount,
            total_questions: slipTestDetails.totalQuestions,
            total_marks: slipTestDetails.marks,
          },
          subject_id: selectedClass.subject_id,
          division_id: selectedClass.division_id,
          // division_id: 37,
          teacher_id: user.id,
          class_schedule_id: selectedClass.class_schedule_id,
          quiz: {
            title: quiz_title,
            start_date: moment().format().split("+")[0],
            duration: slipTestDetails.duration,
            is_auto: true,
            asset_link: {},
            topic: topic,
            // topic: 'Integer',
            sub_topic: subTopic,
            // sub_topic: 'Addition, Subtraction, Division, Multiplication',
            skills: {},
            quiz_type: "SlipTest",
            is_public: true,
            difficulty_id: difficulty, // Set difficulty to that coming from the UI,not set since the backend only has difficulty upto 7 
            school_id: user.school_id,
            division_id: selectedClass.division_id,
            subject_id: selectedClass.subject_id,
            is_notified: false,
            instructions: {
              objective_questions: slipTestDetails.mcqCount,
              subjective_questions: slipTestDetails.subCount,
              total_questions: slipTestDetails.totalQuestions,
              total_marks: slipTestDetails.marks,
            },
          }
        };
        console.log(quizDetails);
        await dispatch(addSlipTestToClass(quizDetails));
      }
      console.log('Closing quiz modal')
      setSelectedTask(null)
      setTaskType('');
      await dispatch(getTeacherClassTasks({
        class_schedule_id: selectedClass.class_schedule_id,
        teacher_id: user.id,
        subject_id: selectedClass.subject_id,
        division_id: selectedClass.division_id,
      }))
      setShowLoadingQuizModal(false);
      setIsNewQuiz(true)
      setShowSlipTestDetailsModal(true);
    };

  const deleteTask = (task_id: number, task_type: string) => {
    setShowModal2TasksModal(false)
    setTaskIDToDelete(task_id)
    setTaskType(task_type)
    setShowDeleteQuestionModal(true)
    console.log(task_id, task_type);
  }
  
  const editTask = (task_id: number, task_type: string) => {  
    console.log(task_type);
    console.log(task_id);
    setShowModal2TasksModal(false)
    setTaskIDToEdit(task_id)
    setTaskType(task_type)
    const currTask = (classTasks?.filter((tsk: any) => tsk.task_id == task_id))[0];
    setSelectedTask(currTask);
    console.log(currTask);
    if (task_type == 'AICheck') {
      setShowModal4AICheckModal(true);
    } else if (task_type == 'Classwork') {
      setShowClassWorkModal(true);
    } else if (task_type == 'SlipTest') {
      setShowModal5GenerateSlipTestModal(true);
      setTopic(currTask.quiz_details?.topic);
      setSubTopic(currTask.quiz_details?.sub_topic)
    }
  }

  const viewQuiz = async(quiz_id: number) => {
    console.log(quiz_id);
    // dispatch get quiz
    await dispatch (getClassQuiz(quiz_id));
    setShowModal2TasksModal(false);
    
    // navigation.navigate('SlipTest', { new_quiz: false, selectedClass: selectedClass });
    setIsNewQuiz(false);
    setShowSlipTestDetailsModal(true);
  }

  const confirmDeleteTask = async() => {
    console.log('Task Deleted ' + taskIDToDelete + ' of type ' + taskType);
    await dispatch(deleteTeacherClassTask(taskIDToDelete));
    await dispatch(getTeacherClassTasks({
      class_schedule_id: selectedClass.class_schedule_id,
      teacher_id: user.id,
      subject_id: selectedClass.subject_id,
      division_id: selectedClass.division_id,
    }))
    setShowDeleteQuestionModal(false);
    setShowModal2TasksModal(true);
  }

  const cancelDeleteTask = async() => {

    // delete the task
    setShowDeleteQuestionModal(false)
    setShowModal2TasksModal(true)
  }

  const setTaskToEmpty = () => {
    console.log("Setting task to empty");
    setSelectedTask(null);
    setTaskType('');
  }

  const closeModal4AICheck = () => {
    setShowModal4AICheckModal(false);
    setTaskToEmpty();
  }

  const closeModal5GenerateSlipTest = () => {
    setShowModal5GenerateSlipTestModal(false);
    setTaskToEmpty();
  }

  const closeModal6 = () => {
    setShowModal6SlipTestSettingsModal(false);
    setTaskToEmpty();
  }
  
  const updateTopic = (item: any) => {
    setTopic(item.topic)
  }

  const updateSubTopic = (subTopic: string) => {
    console.log(subTopic)
    setSubTopic(subTopic)
  }

  const saveSlipTest = async (new_quiz: any) => {
    setShowSlipTestDetailsModal(false);
    if (new_quiz) {
      const tasksObject = {
        class_schedule_id: selectedClass.class_schedule_id,
        teacher_id: user.id,
        subject_id: selectedClass.subject_id,
        division_id: selectedClass.division_id,
      }
      await dispatch(getTeacherClassTasks(tasksObject));
    }
    
    setShowModal2TasksModal(true)
  }

  // const getDetails = async () => {
    // await dispatch(getLiveClass())
    // await dispatch(getScheduleClasses())
    // await dispatch(getTeacherClassTasks({
    //   class_schedule_id: selectedClass.class_schedule_id,
    //   teacher_id: user.id,
    //   subject_id: selectedClass.subject_id,
    //   division_id: selectedClass.division_id,
    // }))
  // };
  
  // useEffect(() => {
  //   getDetails()
  // }, []);

  return (
    <View>
      <SummaryModal parentProps={item} selectedClass={selectedClass} visible={showModal1SummaryModal} onClose={() => setShowModal1SummaryModal(false)} setTopicSubTopicAndMoveToNext={setTopicSubTopicAndMoveToNext} topicsList={topics} />  
      <ClassTaskCardPop topic={topic} subTopic={subTopic} selectedClass={selectedClass} classTasks={classTasks} visible={showModal2TasksModal} onClose={() => setShowModal2TasksModal(false)} goBack={backToSummaryModal} addTask={showAddTaskModal} deleteTask={deleteTask} editTask={editTask} viewQuiz={viewQuiz} />
      <NewTaskModal visible={showModal3NewTasksModal} onClose={() => setShowModal3NewTaskModal(false)} goBack={backToShowDetailsModal} clickedNext={gotoTask} />
      <AiCheckModal selectedTask={selectedTask} visible={showModal4AICheckModal} taskType={taskType} onClose={closeModal4AICheck} goBack={backToNewTasksModal} saveAICheckDetails={saveAICheckDetails} />
      <ClassworkCheckModal selectedTask={selectedTask} visible={showClassWorkModal} taskType={taskType} onClose={closeModal4AICheck} goBack={backToNewTasksModal} saveAICheckDetails={saveClassWorkCheckDetails} />
      <GenerateSlipTestModal selectedTopic={topic} selectedSubTopic={subTopic} selectedClass={selectedClass} updateTopic={updateTopic} updateSubTopic={updateSubTopic} visible={showModal5GenerateSlipTestModal} onClose={closeModal5GenerateSlipTest} clickedNext={goToSlipTestDetails} topicsList={topics} />
      <TestSettingsModal selectedTask={selectedTask} visible={showModal6SlipTestSettingsModal} onClose={closeModal6} generateSlipTest={saveSlipTestDetails} />
      <DeleteQuestionModal
          show={showDeleteQuestionModal}
          resourceType='task'
          onCancel={() => cancelDeleteTask()}
          onDelete={() => confirmDeleteTask()}
        />
      <LoadingSlipTestModal show={showLoadingQuizModal} />
      <SlipTestDetailsModal visible={showSlipTestDetailsModal} saveSlipTest={saveSlipTest} selectedClass={selectedClass} new_quiz={isNewQuiz}/>
    </View>
  );
});

export default ClassPrep;

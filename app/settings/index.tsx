import React, {useState, useEffect} from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SummaryModal from '@/components/Modals/Modal_1_SummaryModal';
import ClassTaskCardPop from '@/components/Modals/Modal_2_ClassTaskModal';
import NewTaskModal from '@/components/Modals/Modal_3_CreateTaskModal';
import AiCheckModal from '@/components/Modals/Modal_4_AICheckModal';
import GenerateSlipTestModal from '@/components/Modals/Modal_5_GenerateSlipTest';
import TestSettingsModal from '@/components/Modals/Modal_6_SlipTestDetails';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getLiveClass, 
  getScheduleClasses, 
  addTaskToClass, 
  getTeacherClassTasks, 
  deleteTeacherClassTask, 
  editTeacherClassTask, 
  addSlipTestToClass,
  updateSlipTest, 
  getClassQuiz
} from '@/store/classSlice';
import DeleteQuestionModal from '@/components/PrepClass/DeleteQuestionModal';
import LoadingSlipTestModal from '@/components/PrepClass/LoadingSlipTestModal';
import moment from 'moment';

const topicsList = ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]
const subTopicsList = ["Sub Topic 1", "Sub Topic 2", "Sub Topic 3", "Sub Topic 4"]

type Props = {
  navigation: DrawerNavigationProp<any, any>;
};

const Settings: React.FC<Props> = ({navigation}) => {

  const dispatch = useDispatch<any>();
  const { liveClass: selectedClass, classTimeline, classTasks } = useSelector((state: any) => state.classes);
  const {user} = useSelector((state: any) => state.user);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [topic, setTopic] = useState(topicsList[0]);
  const [subTopic, setSubTopic] = useState(subTopicsList[0]);
  const [taskType, setTaskType] = useState("AICheck");
  const [taskIDToDelete, setTaskIDToDelete] = useState<number>(-1)
  const [taskIDToEdit, setTaskIDToEdit] = useState<number>(-1)

  const [showModal1SummaryModal, setShowModal1SummaryModal] = useState(false);
  const [showModal2TasksModal, setShowModal2TasksModal] = useState(false);
  const [showModal3NewTasksModal, setShowModal3NewTaskModal] = useState(false);
  const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
  const [showModal5GenerateSlipTestModal, setShowModal5GenerateSlipTestModal] = useState(false);
  const [showModal6SlipTestSettingsModal, setShowModal6SlipTestSettingsModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false);
  const [showLoadingQuizModal, setShowLoadingQuizModal] = useState(false);

  const showDetailsModal = () => {
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
    if(taskTitle == 'AICheck' || taskTitle == 'Classwork' ) {
      setShowModal3NewTaskModal(false)
      setSelectedTask(null);
      setShowModal4AICheckModal(true)
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
      subject_id: 1,
      division_id: 43,
      teacher_id: user.id,
      class_schedule_id: 98,
      start_date: classTimeline[0].date,
      end_date: classTimeline[0].date,
    }
    if(aiCheckDetails.taskId) {
      await dispatch(editTeacherClassTask({id: aiCheckDetails.taskId, ...data}))
    } else {
      await dispatch(addTaskToClass(data))
    }
    await dispatch(getTeacherClassTasks())
    setShowModal4AICheckModal(false)
  }

  const saveSlipTestDetails = async(slipTestDetails: any) => {
    setShowModal6SlipTestSettingsModal(false)
    setShowLoadingQuizModal(true)
    if (selectedTask && selectedTask.task_type == 'SlipTest') {
      console.log('I am editing a quiz');
      console.log(selectedTask);
      const quizDetails: any = {
        title: selectedTask.title, 
        task_type: "SlipTest", 
        start_date: "2025-06-20",
        end_date: "2025-06-20",
        quiz_id: selectedTask.quiz_id,
        task_id: selectedTask.task_id,
        instructions: {
          objective_questions: slipTestDetails.mcqCount,
          subjective_questions: slipTestDetails.subCount,
          total_questions: slipTestDetails.totalQuestions,
          total_marks: slipTestDetails.marks,
        },
        subject_id: 1,
        division_id: 43,
        // division_id: 37,
        teacher_id: user.id,
        class_schedule_id: selectedTask.class_schedule_id,
        quiz: {
          title: selectedTask.quiz_details.title,
          start_date: "2025-06-20T07:07:22.632Z", // Change the hard coded start date
          duration: slipTestDetails.duration,
          is_auto: true,
          asset_link: {},
          // topic: topic,
          topic: 'Integer',
          // sub_topic: subTopic,
          sub_topic: 'Addition, Subtraction, Division, Multiplication',
          skills: {},
          quiz_type: "SlipTest",
          is_public: true,
          difficulty_id: slipTestDetails.difficulty, // Set difficulty to that coming from the UI,not set since the backend only has difficulty upto 7 
          school_id: user.school_id,
          division_id: selectedTask.division_id,
          subject_id: 1,
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
      console.log('I am creating a quiz')
      const quiz_title = `Slip Test ${Math.floor(Math.random() * 1000)}`
      const quizDetails: any = {
        title: quiz_title, 
        task_type: "SlipTest", 
        start_date: "2025-06-20",
        end_date: "2025-06-20",
        instructions: {
          objective_questions: slipTestDetails.mcqCount,
          subjective_questions: slipTestDetails.subCount,
          total_questions: slipTestDetails.totalQuestions,
          total_marks: slipTestDetails.marks,
        },
        subject_id: 1,
        division_id: 43,
        // division_id: 37,
        teacher_id: user.id,
        class_schedule_id: 98,
        quiz: {
          title: quiz_title,
          start_date: "2025-06-20T07:07:22.632Z", // Change the hard coded start date
          duration: slipTestDetails.duration,
          is_auto: true,
          asset_link: {},
          // topic: topic,
          topic: 'Integer',
          // sub_topic: subTopic,
          sub_topic: 'Addition, Subtraction, Division, Multiplication',
          skills: {},
          quiz_type: "SlipTest",
          is_public: true,
          difficulty_id: (slipTestDetails.difficulty <= 7) ? slipTestDetails.difficulty: 7, // Set difficulty to that coming from the UI,not set since the backend only has difficulty upto 7 
          school_id: user.school_id,
          division_id: 43,
          subject_id: 1,
          is_notified: false,
          instructions: {
            objective_questions: slipTestDetails.mcqCount,
            subjective_questions: slipTestDetails.subCount,
            total_questions: slipTestDetails.totalQuestions,
            total_marks: slipTestDetails.marks,
          },
        }
      };
      await dispatch(addSlipTestToClass(quizDetails));
    }
    console.log('Closing quiz modal')
    setSelectedTask(null)
    setTaskType('');
    await dispatch(getTeacherClassTasks())
    setShowLoadingQuizModal(false);
    navigation.navigate('SlipTest', {new_quiz: true});
  };

  const getDetails = async () => {
    await dispatch(getLiveClass())
    await dispatch(getScheduleClasses())
    await dispatch(getTeacherClassTasks())
    // console.log("I am getting Scheduled Classes")
    console.log(selectedClass)
    // console.log(scheduleClasses)
  };

  const updateTopic = (topic: string) => {
    console.log(topic)
    setTopic(topic)
  }

  const updateSubTopic = (subTopic: string) => {
    console.log(subTopic)
    setSubTopic(subTopic)
  }

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
    if (task_type == 'AICheck' || task_type == 'Classwork') {
      setShowModal4AICheckModal(true);
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
    navigation.navigate('SlipTest', { new_quiz: false });
  }

  const confirmDeleteTask = async() => {
    console.log('Task Deleted ' + taskIDToDelete + ' of type ' + taskType);
    await dispatch(deleteTeacherClassTask(taskIDToDelete));
    await dispatch(getTeacherClassTasks())
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

  useEffect(() => {
    getDetails()
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={() => setShowModal1SummaryModal(true)} title="Open Summary" />
        <SummaryModal topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} updateTopic={updateTopic} updateSubTopic={updateSubTopic} visible={showModal1SummaryModal} onClose={() => setShowModal1SummaryModal(false)} clickedNext={showDetailsModal} />
        <ClassTaskCardPop topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} classTasks={classTasks} visible={showModal2TasksModal} onClose={() => setShowModal2TasksModal(false)} goBack={backToSummaryModal} addTask={showAddTaskModal} deleteTask={deleteTask} editTask={editTask} viewQuiz={viewQuiz} />
        <NewTaskModal visible={showModal3NewTasksModal} onClose={() => setShowModal3NewTaskModal(false)} goBack={backToShowDetailsModal} clickedNext={gotoTask} />
        <AiCheckModal selectedTask={selectedTask} visible={showModal4AICheckModal} taskType={taskType} onClose={closeModal4AICheck} goBack={backToNewTasksModal} saveAICheckDetails={saveAICheckDetails} />
        <GenerateSlipTestModal topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} updateTopic={updateTopic} updateSubTopic={updateSubTopic} visible={showModal5GenerateSlipTestModal} onClose={closeModal5GenerateSlipTest} clickedNext={goToSlipTestDetails} />
        <TestSettingsModal selectedTask={selectedTask} visible={showModal6SlipTestSettingsModal} onClose={closeModal6} generateSlipTest={saveSlipTestDetails} />
        <DeleteQuestionModal
          show={showDeleteQuestionModal}
          resourceType='task'
          onCancel={() => cancelDeleteTask()}
          onDelete={() => confirmDeleteTask()}
        />
        <LoadingSlipTestModal show={showLoadingQuizModal} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Settings;

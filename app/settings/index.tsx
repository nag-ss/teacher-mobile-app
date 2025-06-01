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
import { getLiveClass, getScheduleClasses, addTaskToClass, getTeacherClassTasks } from '@/store/classSlice';
import DeleteQuestionModal from '@/components/PrepClass/DeleteQuestionModal';
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

  const [topic, setTopic] = useState(topicsList[0]);
  const [subTopic, setSubTopic] = useState(subTopicsList[0]);
  const [taskType, setTaskType] = useState("AI");
  const [taskIDToDelete, setTaskIDToDelete] = useState<number | null>(null)

  const [showModal1SummaryModal, setShowModal1SummaryModal] = useState(false);
  const [showModal2TasksModal, setShowModal2TasksModal] = useState(false);
  const [showModal3NewTasksModal, setShowModal3NewTaskModal] = useState(false);
  const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
  const [showModal5GenerateSlipTestModal, setShowModal5GenerateSlipTestModal] = useState(false);
  const [showModal6SlipTestSettingsModal, setShowModal6SlipTestSettingsModal] = useState(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false)

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
    if(taskTitle == 'AI' || taskTitle == 'Classwork' ) {
      setShowModal3NewTaskModal(false)
      setShowModal4AICheckModal(true)
    } else if(taskTitle == 'Slip Test') {
      setShowModal3NewTaskModal(false)
      setShowModal5GenerateSlipTestModal(true)
    } else {
        // setCreateTaskModalOpen(false)
        // setShowCWTaskModal(true)
        alert("Classwork Clicked")
    }
    setTaskType(taskTitle)
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
    const task_type = (taskType == "AI") ? "AICheck" : "ClassWork"; 
    const data: any = {
      title: aiCheckDetails.title,
      instructions: {
        ...aiCheckDetails
      },
      task_type: task_type,
      subject_id: 1,
      division_id: 43,
      teacher_id: user.id,
      class_schedule_id: 98,
      start_date: classTimeline[0].date,
      end_date: classTimeline[0].date,
    }
    await dispatch(addTaskToClass(data))
    setShowModal4AICheckModal(false)
  }

  const saveSlipTestDetails = async(slipTestDetails: any) => {
    const quizDetails: any = {
      title: `Slip Test ${Math.floor(Math.random() * 100)}`, 
      task_type: "SlipTest", 
      start_date: classTimeline[0].date,
      end_date: classTimeline[0].date,
      instructions: {
        multipleChoice: slipTestDetails.mcqCount,
        longQuestions: slipTestDetails.subCount,
        totalQuestions: slipTestDetails.totalQuestions,
        marks: slipTestDetails.marks,
        duration: slipTestDetails.duration,
        difficulty: slipTestDetails.difficulty
      },
      subject_id: 1,
      division_id: 43,
      teacher_id: user.id,
      class_schedule_id: 98,
      quiz: {
        title: `Slip Test ${Math.floor(Math.random() * 100)}`,
        start_date: "2025-05-02T07:07:22.632Z", // Change the hard coded start date
        duration: slipTestDetails.duration,
        is_auto: true,
        asset_link: {},
        topic: topic,
        sub_topic: subTopic,
        skills: {},
        quiz_type: "SlipTest",
        is_public: true,
        difficulty_id: 1, // Set difficulty to that coming from the UI,not set since the backend only has difficulty upto 7 
        school_id: user.school_id,
        division_id: 43,
        subject_id: 1,
        is_notified: false
      }
    };
    await dispatch(addTaskToClass(quizDetails)) 
    setShowModal6SlipTestSettingsModal(false)
    navigation.navigate('SlipTest');
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

  const deleteItem = (task_id: number) => {
    setShowModal2TasksModal(false)
    setTaskIDToDelete(task_id)
    setShowDeleteQuestionModal(true)
    console.log(task_id);
  }

  const confirmDeleteTask = async() => {

    console.log('Task Deleted ' + taskIDToDelete);
    setShowDeleteQuestionModal(false)
    setShowModal2TasksModal(true)
  }

  const cancelDeleteTask = async() => {

    // delete the task
    setShowDeleteQuestionModal(false)
    setShowModal2TasksModal(true)
  }


  useEffect(() => {
    getDetails()
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={() => setShowModal1SummaryModal(true)} title="Open Summary" />
        <SummaryModal topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} updateTopic={updateTopic} updateSubTopic={updateSubTopic} visible={showModal1SummaryModal} onClose={() => setShowModal1SummaryModal(false)} clickedNext={showDetailsModal} />
        <ClassTaskCardPop topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} classTasks={classTasks} visible={showModal2TasksModal} onClose={() => setShowModal2TasksModal(false)} goBack={backToSummaryModal} addTask={showAddTaskModal} deleteItem={deleteItem} />
        <NewTaskModal visible={showModal3NewTasksModal} onClose={() => setShowModal3NewTaskModal(false)} goBack={backToShowDetailsModal} clickedNext={gotoTask} />
        <AiCheckModal visible={showModal4AICheckModal} taskType={taskType} onClose={() => setShowModal4AICheckModal(false)} goBack={backToNewTasksModal} saveAICheckDetails={saveAICheckDetails} />
        <GenerateSlipTestModal topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} updateTopic={updateTopic} updateSubTopic={updateSubTopic} visible={showModal5GenerateSlipTestModal} onClose={() => setShowModal5GenerateSlipTestModal(false)} clickedNext={goToSlipTestDetails} />
        <TestSettingsModal visible={showModal6SlipTestSettingsModal} onClose={() => setShowModal6SlipTestSettingsModal(false)} generateSlipTest={saveSlipTestDetails} />
        <DeleteQuestionModal
          show={showDeleteQuestionModal}
          resourceType='task'
          onCancel={() => cancelDeleteTask()}
          onDelete={() => confirmDeleteTask()}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Settings;

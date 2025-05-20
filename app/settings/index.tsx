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
import moment from 'moment';

const topicsList = ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]
const subTopicsList = ["Sub Topic 1", "Sub Topic 2", "Sub Topic 3", "Sub Topic 4"]

type Props = {
  navigation: DrawerNavigationProp<any, any>;
};

const Settings: React.FC<Props> = ({navigation}) => {

  const dispatch = useDispatch<any>();
  const { liveClass: selectedClass, classTimeline } = useSelector((state: any) => state.classes);
  const {user} = useSelector((state: any) => state.user);

  const [topic, setTopic] = useState(topicsList[0]);
  const [subTopic, setSubTopic] = useState(subTopicsList[0]);
  const [taskType, setTaskType] = useState("AI");

  const [showModal1SummaryModal, setShowModal1SummaryModal] = useState(false);
  const [showModal2TasksModal, setShowModal2TasksModal] = useState(false);
  const [showModal3NewTasksModal, setShowModal3NewTaskModal] = useState(false);
  const [showModal4AICheckModal, setShowModal4AICheckModal] = useState(false);
  const [showModal5GenerateSlipTestModal, setShowModal5GenerateSlipTestModal] = useState(false);
  const [showModal6SlipTestSettingsModal, setShowModal6SlipTestSettingsModal] = useState(false);


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
    if(taskTitle == 'AI') {
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
    console.log(aiCheckDetails)
    const data: any = {
      title: aiCheckDetails.title,
      instructions: {...aiCheckDetails},
      task_type: "AICheck",
      subject_id: 1,
      division_id: 1,
      teacher_id: user.id,
      class_schedule_id: 97,
      start_date: classTimeline[0].date,
      end_date: classTimeline[0].date,
    }
    
    await dispatch(addTaskToClass(data))
    
    setShowModal4AICheckModal(false)

  }

  const saveSlipTestDetails = async(slipTestDetails: any) => {
    console.log(user);
    const quizDetails: any = {
      title: `Slip Test ${Math.floor(Math.random() * 100)}`, 
      task_type: "SlipTest", 
      start_date: classTimeline[0].date,
      end_date: classTimeline[0].date,
      instructions: {
        text: {
          Q1:"How to generate Quiz"
        },
        mcqs: 10,
        longQuestions: 10,
        totalQuestions: 20
      },
      subject_id: 1,
      division_id: 1,
      teacher_id: user.id,
      class_schedule_id: 97,
      quiz: {
        title: `Slip Test ${Math.floor(Math.random() * 100)}`,
        start_date: "2025-05-02T07:07:22.632Z",
        duration: 15,
        is_auto: true,
        asset_link: {},
        topic: topic,
        sub_topic: subTopic,
        skills: {},
        quiz_type: "SlipTest",
        is_public: true,
        difficulty_id: 1,
        school_id: user.school_id,
        division_id: 1,
        subject_id: 1,
        is_notified: false
      }
    };
    console.log(classTimeline)
    console.log(quizDetails)
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

  useEffect(() => {
    getDetails()
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={() => setShowModal1SummaryModal(true)} title="Open Summary" />
        <SummaryModal topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} updateTopic={updateTopic} updateSubTopic={updateSubTopic} visible={showModal1SummaryModal} onClose={() => setShowModal1SummaryModal(false)} clickedNext={showDetailsModal} />
        <ClassTaskCardPop topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} visible={showModal2TasksModal} onClose={() => setShowModal2TasksModal(false)} goBack={backToSummaryModal} addTask={showAddTaskModal} />
        <NewTaskModal visible={showModal3NewTasksModal} onClose={() => setShowModal3NewTaskModal(false)} goBack={backToShowDetailsModal} clickedNext={gotoTask} />
        <AiCheckModal visible={showModal4AICheckModal} onClose={() => setShowModal4AICheckModal(false)} goBack={backToNewTasksModal} saveAICheckDetails={saveAICheckDetails} />
        <GenerateSlipTestModal topic={topic} subTopic={subTopic} selectedClass={(classTimeline.length != 0) ? classTimeline[0]: selectedClass} updateTopic={updateTopic} updateSubTopic={updateSubTopic} visible={showModal5GenerateSlipTestModal} onClose={() => setShowModal5GenerateSlipTestModal(false)} clickedNext={goToSlipTestDetails} />
        <TestSettingsModal visible={showModal6SlipTestSettingsModal} onClose={() => setShowModal6SlipTestSettingsModal(false)} generateSlipTest={saveSlipTestDetails} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Settings;

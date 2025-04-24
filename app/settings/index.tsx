import React, {useState} from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SummaryModal from '@/components/Modals/Modal_1_SummaryModal';
import ClassTaskCardPop from '@/components/Modals/Modal_2_ClassTaskModal';
import NewTaskModal from '@/components/Modals/Modal_3_CreateTaskModal';
import AiCheckModal from '@/components/Modals/Modal_4_AICheckModal';
import GenerateSlipTestModal from '@/components/Modals/Modal_5_GenerateSlipTest';
import TestSettingsModal from '@/components/Modals/Modal_6_SlipTestDetails'; 

const Settings = () => {
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
  }

  const backToNewTasksModal = () => {
    setShowModal4AICheckModal(false)
    setShowModal3NewTaskModal(true)
  }

  const goToSlipTestDetails = () => {
    setShowModal5GenerateSlipTestModal(false)
    setShowModal6SlipTestSettingsModal(true)
  }

  const saveSlipTestDetails = () => {  
    setShowModal6SlipTestSettingsModal(false)
    console.log('Navigating to /teacher/sliptest');
  };


  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={() => setShowModal1SummaryModal(true)} title="Open Summary" />
        <SummaryModal visible={showModal1SummaryModal} onClose={() => setShowModal1SummaryModal(false)} clickedNext={showDetailsModal} />
        <ClassTaskCardPop visible={showModal2TasksModal} onClose={() => setShowModal2TasksModal(false)} goBack={backToSummaryModal} addTask={showAddTaskModal} />
        <NewTaskModal visible={showModal3NewTasksModal} onClose={() => setShowModal3NewTaskModal(false)} goBack={backToShowDetailsModal} clickedNext={gotoTask} />
        <AiCheckModal visible={showModal4AICheckModal} onClose={() => setShowModal4AICheckModal(false)} goBack={backToNewTasksModal} />
        <GenerateSlipTestModal visible={showModal5GenerateSlipTestModal} onClose={() => setShowModal5GenerateSlipTestModal(false)} clickedNext={goToSlipTestDetails} />
        <TestSettingsModal visible={showModal6SlipTestSettingsModal} onClose={() => setShowModal6SlipTestSettingsModal(false)} generateSlipTest={saveSlipTestDetails} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Settings;

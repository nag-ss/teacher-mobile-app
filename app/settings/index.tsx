import React, {useState} from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SummaryModal from '@/components/Modals/Modal_1_SummaryModal';
import ClassTaskCardPop from '@/components/Modals/Modal_2_ClassTaskModal';
import NewTaskModal from '@/components/Modals/Modal_3_CreateTaskModal' 

const Settings = () => {
  const [showModal1SummaryModal, setShowModal1SummaryModal] = useState(false);
  const [showModal2TasksModal, setShowModal2TasksModal] = useState(false);
  const [showModal3NewTasksModal, setShowModal3NewTaskModal] = useState(false);

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
        // setCreateTaskModalOpen(false)
        // setShowAITaskModal(true)
        alert("AI Clicked")
    } else if(taskTitle == 'Slip Test') {
        // setCreateTaskModalOpen(false)
        // setCreateSlipTestModal(true)
        alert("Slip Test Clicked")
    } else {
        // setCreateTaskModalOpen(false)
        // setShowCWTaskModal(true)
        alert("Classwork Clicked")
    }
}
  

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={() => setShowModal1SummaryModal(true)} title="Open Summary" />
        <SummaryModal visible={showModal1SummaryModal} onClose={() => setShowModal1SummaryModal(false)} clickedNext={showDetailsModal} />
        <ClassTaskCardPop visible={showModal2TasksModal} onClose={() => setShowModal2TasksModal(false)} goBack={backToSummaryModal} addTask={showAddTaskModal} />
        <NewTaskModal visible={showModal3NewTasksModal} onClose={() => setShowModal3NewTaskModal(false)} goBack={backToShowDetailsModal} clickedNext={gotoTask} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Settings;

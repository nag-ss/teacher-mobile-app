import React, {useState} from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SummaryModal from '@/components/Modals/SummaryModal';
import ClassTaskCardPop from '@/components/Modals/ClassTaskModal';

const Home = () => {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);

  const showDetailsModal = () => {
    setShowSummaryModal(false)
    setShowTasksModal(true)
  }

  const backToSummaryModal = () => {
    setShowTasksModal(false)
    setShowSummaryModal(true)
    
  }

  

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={() => setShowSummaryModal(true)} title="Open Summary" />
        <SummaryModal visible={showSummaryModal} onClose={() => setShowSummaryModal(false)} clickedNext={showDetailsModal} />
        <ClassTaskCardPop visible={showTasksModal} onClose={() => setShowTasksModal(false)} goBack={backToSummaryModal} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;

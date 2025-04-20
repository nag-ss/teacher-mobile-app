import React, {useState} from 'react';
import { Text, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SummaryModal from '@/components/Modals/SummaryModal';

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={() => setShowModal(true)} title="Open Summary" />
        <SummaryModal visible={showModal} onClose={() => setShowModal(false)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;

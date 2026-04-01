import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AiSuggestion from '@/components/classes/AiSuggestion/AiSuggestion';
import LiveMonitorHeader from '@/components/live-monitoring/LiveMonitorHeader';
import { studentAiItems } from '@/data/Classdata';

const StudentPerformance = () => {
  const route = useRoute<any>();
  const studentName = route?.params?.studentName ?? 'Student Performance';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} nestedScrollEnabled>
      <LiveMonitorHeader
        title={studentName}
        centerTitle
        showStudentsCount={false}
        showNotificationsIcon
        notificationButtonStyle={styles.notificationButton}
      />
      <View style={styles.suggestionsWrap}>
        <AiSuggestion items={studentAiItems} variant="student" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsWrap: {
    marginTop: 8,
  },
});

export default StudentPerformance;

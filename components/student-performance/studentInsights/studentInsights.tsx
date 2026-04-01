import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StudentInsightCard from './studentInsightCard';

const StudentInsights = () => {
  return (
    <View style={styles.siRoot}>
      <Text style={styles.siHeading}>Engagement and Behavior Insights</Text>
      <StudentInsightCard />
    </View>
  );
};

const styles = StyleSheet.create({
  siRoot: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  siHeading: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    paddingBottom: 16,
  },
});

export default StudentInsights;
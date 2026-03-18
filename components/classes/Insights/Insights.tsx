import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SumarryCard from '@/components/classes/Insights/InsightsCard';

const Insights = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Engagement and Behavior Insights</Text>
      <SumarryCard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
  },
});

export default Insights;
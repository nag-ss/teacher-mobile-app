import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AiSuggestionCard from '@/components/classes/AiSuggestion/AiSuggestionCard';

const AiSuggestion = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Recommendations</Text>
      <AiSuggestionCard />
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
    color: '#111827',
  },
});

export default AiSuggestion;


import React from 'react';
import { View, StyleSheet } from 'react-native';
import QuizCardOutline from '@/components/classes/QuizSection/QuizCard';
import TableHeaderControls from '@/components/classes/shared/Header';

const QuizTable = () => {
  return (
    <View style={styles.container}>
      <TableHeaderControls title="Quiz Performance" searchDisabled />

      <QuizCardOutline />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  // header/search/sort/filter styles live in TableHeaderControls
});

export default QuizTable;


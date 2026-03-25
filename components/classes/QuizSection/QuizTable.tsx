import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import QuizCardOutline, { type QuizCardData } from '@/components/classes/QuizSection/QuizCard';
import TableHeaderControls from '@/components/classes/shared/Header';
import { QUIZ_CARD_SEARCH_KEYS, useFilteredBySearch } from '@/components/classes/shared/tableSearchFilter';
import { classQuizCards } from '@/data/Classdata';

const QuizTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const quizCards = useMemo(() => classQuizCards as QuizCardData[], []);
  const filteredQuizCards = useFilteredBySearch(quizCards, searchTerm, QUIZ_CARD_SEARCH_KEYS);

  return (
    <View style={styles.container}>
      <TableHeaderControls
        title="Quiz Performance"
        query={searchTerm}
        onChangeQuery={setSearchTerm}
        searchPlaceholder="Search quizzes"
      />

      <QuizCardOutline cards={filteredQuizCards} />
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


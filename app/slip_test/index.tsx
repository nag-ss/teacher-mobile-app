import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';


import DeleteQuestionModal from '@/components/PrepClass/DeleteQuestionModal';
import QuestionModal from '@/components/PrepClass/QuestionsModal';

const questions = [
  {
    id: 1,
    type: 'subjective',
    question: 'What is the Definition of Friction?',
    marks: 5,
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  },
  {
    id: 2,
    type: 'objective',
    question: 'What is the Definition of Friction?',
    marks: 5,
    options: ['Natural science', 'Natural science', 'Natural science', 'Natural science'],
    correct: 3,
  },
];

const SlipTestPage = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isDeleteTaskModal, setDeleteTaskModal] = useState(false);
  const [isQuestionModal, setQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const editQuestion = (id: number) => {
    setSelectedQuestion(questions[id - 1]);
    setQuestionModal(true);
  };

  const deleteQuestion = (id: number) => {
    setDeleteTaskModal(true);
  };

  const renderQuestionCard = ({ item, index }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.indexBox}>
          <Text style={styles.indexText}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <Text style={styles.questionText}>{item.question}</Text>
        <View style={styles.markBox}>
          <Text style={styles.markText}>Marks - 0{item.marks}</Text>
        </View>
        <TouchableOpacity onPress={() => setActiveDropdown(activeDropdown === index ? null : index)}>
          <Feather name="more-vertical" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {activeDropdown === index && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => editQuestion(item.id)} style={styles.dropdownItem}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.dropdownItem}>
            <Text>Replace</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteQuestion(item.id)} style={styles.dropdownItem}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Subjective Answer */}
      {item.type === 'subjective' && (
        <View style={styles.answerBox}>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Answer: </Text>
            {item.answer}
          </Text>
        </View>
      )}

      {/* Objective Options */}
      {item.type === 'objective' && (
        <View style={styles.optionsGrid}>
          {item.options?.map((opt: string, idx: number) => (
            <View
              key={idx}
              style={[
                styles.optionBox,
                idx === item.correct && {
                  borderColor: '#059669',
                },
              ]}
            >
              <Text style={idx === item.correct ? styles.correctText : {}}>
                {String.fromCharCode(65 + idx)}) {opt}
              </Text>
              {idx === item.correct && <Feather name="check-circle" size={18} color="#059669" />}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Slip Test Preview</Text>
        <Text style={styles.subtext}>Review and finalize the test before publishing.</Text>

        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderQuestionCard}
          scrollEnabled={false}
        />

        {/* Pagination */}
        <View style={styles.pagination}>
          <TouchableOpacity>
            <Text style={styles.paginationText}>← Previous</Text>
          </TouchableOpacity>
          <View style={styles.pageNumbers}>
            {[1, 2, '...', 9, 10].map((p, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.pageButton,
                  p === 1 && { backgroundColor: '#10B981' },
                ]}
              >
                <Text style={p === 1 ? styles.pageButtonTextActive : styles.pageButtonText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity>
            <Text style={styles.paginationText}>Next →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      <DeleteQuestionModal
        show={isDeleteTaskModal}
        onCancel={() => setDeleteTaskModal(false)}
        onDelete={() => setDeleteTaskModal(false)}
      />
      <QuestionModal
        ques={selectedQuestion}
        show={isQuestionModal}
        onCancel={() => setQuestionModal(false)}
      />
    </View>
  );
};

export default SlipTestPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#6B7280',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  indexBox: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontWeight: 'bold',
    color: '#374151',
  },
  questionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  markBox: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  markText: {
    color: '#047857',
    fontWeight: '500',
  },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFF',
    display: 'flex',
  },
  dropdownItem: {
    padding: 10,
    flexDirection: 'row-reverse',
  },
  answerBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  optionsGrid: {
    marginTop: 10,
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  correctText: {
    color: '#059669',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  paginationText: {
    color: '#6B7280',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 4,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 2,
  },
  pageButtonText: {
    color: '#374151',
  },
  pageButtonTextActive: {
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

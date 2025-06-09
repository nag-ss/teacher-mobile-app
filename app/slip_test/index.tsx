import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import QuestionCard from '@/components/PrepClass/QuestionCard';
import DeleteQuestionModal from '@/components/PrepClass/DeleteQuestionModal';
import QuestionModal from '@/components/PrepClass/QuestionsModal';
// import questions from '../../data/Questions';

const SlipTestPage = () => {
  const dispatch = useDispatch<any>();
  const { quiz_details } = useSelector((state: any) => state.classes);
  const {questions} = quiz_details;
  const [activeDropdown, setActiveDropdown] = useState(-1);
  const [isDeleteTaskModal, setDeleteTaskModal] = useState(false);
  const [isQuestionModal, setQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const editQuestion = (id: number) => {
    const question = (questions.filter((q: { question_id: number; }) => q.question_id == id))[0]
    setSelectedQuestion(question);
    setQuestionModal(true);
  };

  const replaceQuestion = (id: number) => {
    console.log("The question to be replaced is " + id);
  } 

  const deleteQuestion = (id: number) => {
    setDeleteTaskModal(true);
  };

  const renderQuestionCard = ({ item, index }: any) => {
    return (<QuestionCard item={item} index={index} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} editQuestion={editQuestion} deleteQuestion={deleteQuestion} replaceQuestion={replaceQuestion} />)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Slip Test Preview</Text>
        <Text style={styles.subtext}>Review and finalize the test before publishing.</Text>

        <FlatList
          data={questions}
          keyExtractor={(item) => item.question_id.toString()}
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
        resourceType='question'
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

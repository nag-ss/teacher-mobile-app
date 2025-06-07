import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {MathJaxSvg} from 'react-native-mathjax-html-to-svg';

const { width } = Dimensions.get('window');

interface QuestionCardProps {
  item: any;
  index: number;
  activeDropdown: number;
  setActiveDropdown: (id: number) => void;
  editQuestion: (id: number) => void;
  deleteQuestion: (id: number) => void;
  replaceQuestion: (id: number) => void;
};

const QuestionCard = ({item, index, activeDropdown, setActiveDropdown, editQuestion, deleteQuestion}: QuestionCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.indexBox}>
          <Text style={styles.indexText}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <MathJaxSvg 
          fontCache={true}
          fontSize={16}
        >
          {item.body.Question}
        </MathJaxSvg>
        
        <View style={styles.markBox}>
          <Text style={styles.markText}>Marks - 0{item.marks}</Text>
        </View>
        <TouchableOpacity onPress={() => setActiveDropdown(activeDropdown === index ? -1 : index)}>
          <Feather name="more-vertical" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {activeDropdown === index && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => editQuestion(item.question_id)} style={styles.dropdownItem}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.dropdownItem}>
            <Text>Replace</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteQuestion(item.question_id)} style={styles.dropdownItem}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Subjective Answer */}
      {!item.is_objective && (
        <View style={styles.answerBox}>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Answer: </Text>
              {item.answer.explanation}
          </Text>
        </View>
      )}

      {/* Objective Options */}
      {item.is_objective && (
        <View style={styles.optionsGrid}>
          {item.choice_body?.map((opt: string, idx: number) => (
            <View
              key={idx}
              style={[
                styles.optionBox,
                idx === item.correct && {
                  borderColor: '#059669',
                },
              ]}
            >
              <MathJaxSvg 
                fontCache={true}
                fontSize={16}
              >
                {opt}
              </MathJaxSvg>
              {idx === item.correct && <Feather name="check-circle" size={18} color="#059669" />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default QuestionCard;

const styles = StyleSheet.create({
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
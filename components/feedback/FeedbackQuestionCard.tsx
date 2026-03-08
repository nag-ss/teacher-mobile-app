import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '@/constants/Colors';

export type FeedbackQuestionType = 'multiple_choice' | 'text';

export interface FeedbackQuestionCardProps {
  index: number;
  question: string;
  type: FeedbackQuestionType;
  options?: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocusField?: () => void;
}

/**
 * Reuses the same UI pattern as PrepClass/QuestionCard:
 * - Numbered index box, question text
 * - Multiple choice: option rows (A, B, C...) with selected state
 * - Text: text area only
 */
const FeedbackQuestionCard = ({
  index,
  question,
  type,
  options = [],
  value,
  onChange,
  placeholder = '',
  onFocusField,
}: FeedbackQuestionCardProps) => {
  const answerPlaceholder = placeholder || 'Answer :';
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.indexBox}>
          <Text style={styles.indexText}>{String(index).padStart(2, '0')}</Text>
        </View>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      {type === 'text' ? (
        <View style={styles.answerBox}>
          <TextInput
            style={styles.textArea}
            placeholder={answerPlaceholder}
            placeholderTextColor="#9E9E9E"
            value={value}
            onChangeText={onChange}
            onFocus={onFocusField}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          {options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const selected = value === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionBox,
                  selected && styles.optionBoxSelected,
                  i < options.length - 1 && styles.optionBoxMargin,
                ]}
                onPress={() => {
                  onChange(opt);
                  onFocusField?.();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionLetter}>{letter})</Text>
                  <Text style={styles.optionText}>{opt}</Text>
                </View>
                {selected && (
                  <AntDesign
                    name="checkcircle"
                    size={18}
                    color={Colors.primaryColor}
                    style={styles.optionCheck}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default FeedbackQuestionCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 13.7,
    marginBottom: 16,
    marginHorizontal: 0,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 9.14,
  },
  indexBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderColor: '#E5E7EB',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontFamily: 'Montserrat_500Medium',
    color: '#222',
    fontSize: 14,
  },
  questionText: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 4,
    fontFamily: 'Montserrat_500Medium',
    color: '#222',
    lineHeight: 24,
    fontSize: 14,
  },
  answerBox: {
    width: '100%',
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    padding: 12,
    minHeight: 160,
  },
  textArea: {
    width: '100%',
    fontFamily: 'Montserrat_400Regular',
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingTop: 0,
    fontSize: 12,
    lineHeight: 20,
    color: '#222',
    minHeight: 140,
    textAlign: 'justify',
  },
  optionsContainer: {
    marginTop: 4,
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionBoxSelected: {
    borderColor: '#059669',
  },
  optionBoxMargin: {
    marginBottom: 9.14,
  },
  optionContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  optionLetter: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    marginRight: 8,
    color: '#444',
  },
  optionText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#222',
    flex: 1,
  },
  optionCheck: {
    marginLeft: 8,
  },
});

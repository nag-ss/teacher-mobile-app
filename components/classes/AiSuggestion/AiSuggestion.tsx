import React from 'react';
import { StyleSheet } from 'react-native';
import QuickActions, { QuickActionItem } from '@/components/dashboard/QuickActions';

const aiSuggestionItems: QuickActionItem[] = [
  {
    icon: require('@/assets/images/cast_for_education.png'),
    title: 'Reteach Trigonometry',
    description: '30% of students scored below 50% in the last quiz.  students are struggling with recent topics.',
    cta: 'Schedule Review',
  },
  {
    icon: require('@/assets/images/ss/Warning.png'),
    title: 'Low Assignment Completion',
    description: '40% of students missed the last two assignments.',
    cta: 'Remind Students',
  },
  {
    icon: require('@/assets/images/ss/p2p.png'),
    title: 'Provide 1-on-1 Support',
    description: '3 students are struggling with recent topics.',
    cta: 'Message Students',
  },
];

const AiSuggestion = () => {
  return (
    <QuickActions
      title="AI Recommendations"
      items={aiSuggestionItems}
      containerStyle={styles.container}
      headerTextStyle={styles.title}
      cardsContainerStyle={styles.cardsContainer}
      cardStyle={styles.card}
      titleStyle={styles.cardTitle}
      subTitleStyle={styles.cardDesc}
      buttonContainerStyle={styles.buttonContainer}
      buttonStyle={styles.button}
      buttonTitleStyle={styles.buttonText}
      iconStyle={styles.icon}
      iconWrapperStyle={styles.iconWrapper}
      showIconWrapper
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  title: {
    padding: 0,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18.28,
    color: '#111827',
    paddingBottom: 16,
  },
  cardsContainer: {
    gap: 12,

  },
  card: {
    borderRadius: 12,
    borderColor: '#D1D5DB',
    padding: 16,
    marginHorizontal: 0,
  },
  cardTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: '#111827',
  },
  cardDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#6B7280',
    height: 'auto',
    paddingBottom: 10,
    lineHeight: 16,
  },
  button: {
    height: 'auto',
    borderRadius: 8,
    borderColor: '#9FD5C2',
  },
  buttonContainer: {
    paddingVertical: 0,
    marginTop: 'auto',
  },
  buttonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
    color: '#111827',
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9FD5C2',
    backgroundColor: '#fff',
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 0,
  },
});

export default AiSuggestion;


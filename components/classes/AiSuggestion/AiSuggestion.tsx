import React from 'react';
import { StyleSheet } from 'react-native';
import QuickActions, { QuickActionItem } from '@/components/dashboard/QuickActions';

const aiSuggestionItems: QuickActionItem[] = [
  {
    icon: require('@/assets/images/cast_for_education.png'),
    title: 'Reteach Trigonometry',
    description: '30% of students scored below 50% in the last quiz.',
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
    fontSize: 18,
    color: '#111827',
  },
  cardsContainer: {
    marginTop: 12,
    gap: 12,
  },
  card: {
    minHeight: 180,
    borderRadius: 12,
    borderColor: '#D1D5DB',
    padding: 14,
    marginHorizontal: 0,
  },
  cardTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  cardDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    height: 48,
  },
  button: {
    height: 36,
    borderRadius: 8,
    borderColor: '#9FD5C2',
  },
  buttonText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#111827',
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9FD5C2',
    backgroundColor: '#fff',
    marginRight: 10,
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


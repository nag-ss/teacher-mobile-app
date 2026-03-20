import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

const QuizCardOutline = () => {
  const quizCards = [
    {
      title: 'Trigonometry',
      scheduledAt: 'May 5th',
      status: 'Upcoming in 3 days',
      details: [
        { label: 'Topics', value: 'Pythagorean Theorem, Identities' },
        { label: 'Total Marks', value: '50' },
        { label: 'Duration', value: '30 min' },
      ],
      nextSteps: ['Remind Students to Prepare.', 'Recommend Study Material.'],
      buttonText: 'Notify Students',
    },
    {
      title: 'Algebra Basics',
      scheduledAt: 'Mar 25th',
      status: 'Completed',
      details: [
        { label: 'Average Score', value: '78%' },
        { label: 'Highest Score', value: '95%' },
        { label: 'Lowest Score', value: '45%' },
      ],
      nextSteps: [
        'Reteach Quadratic Equations (30% scored low)',
        'Assign Extra Practice for Weak Students',
      ],
      buttonText: 'View Results',
    },
    {
      title: 'Algebra Basics',
      scheduledAt: 'Mar 25th',
      status: 'Completed',
      details: [
        { label: 'Topics Covered', value: '78%' },
        { label: 'Highest Score', value: '95%' },
        { label: 'Lowest Score', value: '45%' },
      ],
      nextSteps: [
        'Reteach Quadratic Equations (30% scored low)',
        'Assign Extra Practice for Weak Students',
      ],
      buttonText: 'View Results',
    },
  ];

  return (
    <View style={styles.row}>
      <View style={styles.cards}>
        {quizCards.map((card, cardIndex) => (
          <View key={`${card.title}-${cardIndex}`} style={styles.card}>
            <View style={styles.headerRow}>
              <View style={styles.iconWrap}>
                <Image source={require('@/assets/images/ss/Quiz.png')} style={styles.iconImg} />
              </View>
              <View style={styles.headerTextWrap}>
                <Text style={styles.title}>{card.title}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Scheduled at</Text>
                  <Text style={styles.metaSep}>:</Text>
                  <Text style={styles.metaValue}>{card.scheduledAt}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Status</Text>
                  <Text style={styles.metaSep}>:</Text>
                  <Text style={styles.metaValue}>{card.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {card.details.map((detail, detailIndex) => (
              <View key={`${detail.label}-${detailIndex}`} style={styles.infoRow}>
                <View style={styles.infoLabelGroup}>
                  <Text numberOfLines={1} style={styles.infoLabel}>
                    {detail.label}
                  </Text>
                  <Text style={styles.infoSep}>:</Text>
                </View>
                <Text numberOfLines={1} style={styles.infoValue}>
                  {detail.value}
                </Text>
              </View>
            ))}

            <Text style={styles.stepsTitle}>Suggested Next Steps</Text>
            {card.nextSteps.map((step, stepIndex) => (
              <Text key={`${step.slice(0, 12)}-${stepIndex}`} style={styles.stepsItem}>
                • {step}
              </Text>
            ))}

            <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>{card.buttonText}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  cards: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 0,
    alignItems: 'stretch',
  },
  card: {
    flex: 1,
    minHeight: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    padding: 10,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: '#111827',
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaLabel: {
    width: 74,
    fontFamily: 'Roboto_400Regular',
    fontSize: 9,
    color: '#6B7280',
  },
  metaSep: {
    width: 8,
    textAlign: 'center',
    fontFamily: 'Roboto_400Regular',
    fontSize: 9,
    color: '#6B7280',
  },
  metaValue: {
    flex: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: 8,
    color: '#111827',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginVertical: 7,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 4,
  },
  infoLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 9,
    color: '#6B7280',
  },
  infoSep: {
    marginLeft: 2,
    marginRight: 8,
    fontFamily: 'Roboto_400Regular',
    fontSize: 9,
    color: '#6B7280',
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Roboto_400Regular',
    fontSize: 8,
    color: '#111827',
  },
  stepsTitle: {
    marginTop: 9,
    marginBottom: 4,
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#111827',
  },
  stepsItem: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 8,
    lineHeight: 13,
    color: '#111827',
    marginBottom: 2,
  },
  actionBtn: {
    marginTop: 'auto',
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#79CBB5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 9,
    color: '#111827',
  },
});

export default QuizCardOutline;


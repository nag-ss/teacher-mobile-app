import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

type QuizCard = {
  title: string;
  scheduledAt: string;
  status: string;
  details: { label: string; value: string }[];
  nextSteps: string[];
  buttonText: string;
};

const QuizCardOutline = () => {
  const cardsPerPage = 3;
  const pageGap = 10;
  const [containerWidth, setContainerWidth] = useState(0);

  const quizCards: QuizCard[] = useMemo(
    () => [
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
        title: 'Geometry',
        scheduledAt: 'Apr 10th',
        status: 'Upcoming in 2 weeks',
        details: [
          { label: 'Topics', value: 'Triangles, Similarity' },
          { label: 'Total Marks', value: '40' },
          { label: 'Duration', value: '25 min' },
        ],
        nextSteps: ['Practice triangle proofs.', 'Review similarity formulas.'],
        buttonText: 'Notify Students',
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
        nextSteps: ['Reteach Quadratic Equations (30% scored low)', 'Assign Extra Practice'],
        buttonText: 'View Results',
      },
    ],
    []
  );

  const pages = useMemo(() => {
    const chunked: QuizCard[][] = [];
    for (let i = 0; i < quizCards.length; i += cardsPerPage) {
      chunked.push(quizCards.slice(i, i + cardsPerPage));
    }
    return chunked;
  }, [quizCards, cardsPerPage]);

  return (
    <View style={styles.row} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <FlatList
        horizontal
        data={pages}
        keyExtractor={(_, index) => `page-${index}`}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={containerWidth ? containerWidth + pageGap : 1}
        snapToAlignment="start"
        decelerationRate="fast"
        style={styles.carousel}
        ItemSeparatorComponent={() => <View style={{ width: pageGap }} />}
        renderItem={({ item: pageCards, index: pageIndex }) => {
          const placeholders = cardsPerPage - pageCards.length;

          return (
            <View
              key={`page-${pageIndex}`}
              style={[styles.page, containerWidth ? { width: containerWidth } : undefined]}
            >
              <View style={styles.cards}>
                {pageCards.map((card, cardIndex) => (
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
                          <Text numberOfLines={1} style={styles.metaValue}>
                            {card.scheduledAt}
                          </Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaLabel}>Status</Text>
                          <Text style={styles.metaSep}>:</Text>
                          <Text numberOfLines={1} style={styles.metaValue}>
                            {card.status}
                          </Text>
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
                    <View style={styles.stepsList}>
                      {card.nextSteps.map((step, stepIndex) => (
                        <Text key={`${step.slice(0, 12)}-${stepIndex}`} style={styles.stepsItem}>
                          • {step}
                        </Text>
                      ))}
                    </View>

                    <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
                      <Text style={styles.actionBtnText}>{card.buttonText}</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {Array.from({ length: placeholders }).map((_, placeholderIndex) => (
                  <View
                    key={`placeholder-${placeholderIndex}`}
                    style={[styles.card, styles.cardPlaceholder]}
                  />
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
  carousel: {
    flex: 1,
  },
  cards: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 0,
    alignItems: 'stretch',
  },
  page: {
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    padding: 10,
    overflow: 'hidden',
  },
  cardPlaceholder: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
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
    marginBottom: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
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
    marginVertical: 6,
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
    marginRight: 0,
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
    paddingTop: 8,
    paddingBottom: 4,
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#111827',
  },
  stepsItem: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 8,
    lineHeight: 13,
    color: '#111827',
    paddingBottom: 0,
  },
  stepsList: {
    paddingBottom: 8,
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


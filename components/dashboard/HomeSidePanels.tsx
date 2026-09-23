import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TODAY_EVENTS = [
  { time: '4:00 PM', title: 'Parent-teacher meeting' },
  { time: '5:00 PM', title: 'Dept. sync — Mathematics' },
];

const ATTENTION_ITEMS = [
  {
    dotColor: '#D65B44',
    highlight: '3 students',
    rest: " below 50% in yesterday's Quiz",
  },
  {
    dotColor: '#E8A317',
    highlight: '5 quizzes',
    rest: ' pending evaluation',
  },
];

const HomeSidePanels = () => {
  return (
    <View style={styles.container}>
      <View style={styles.eventsCard}>
        <Text style={styles.eventsTitle}>Today's events</Text>
        <View style={styles.eventsList}>
          {TODAY_EVENTS.map((event) => (
            <View key={event.time + event.title} style={styles.eventItem}>
              <Text style={styles.eventTime}>{event.time}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.attentionCard}>
        <Text style={styles.attentionTitle}>Needs your attention</Text>
        <View style={styles.attentionList}>
          {ATTENTION_ITEMS.map((item, index) => (
            <React.Fragment key={item.highlight}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.attentionWrapper}>
                <View style={styles.attentionItem}>
                  <View style={styles.dotAligner}>
                    <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
                  </View>
                  <Text style={styles.attentionText}>
                    <Text style={styles.attentionHighlight}>{item.highlight}</Text>
                    <Text style={styles.attentionRest}>{item.rest}</Text>
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  eventsCard: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 16,
    padding: 24,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.0156863,
    shadowRadius: 16,
    elevation: 1,
  },
  attentionCard: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 16,
    padding: 24,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.0156863,
    shadowRadius: 16,
    elevation: 1,
  },
  eventsTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_600SemiBold',
    includeFontPadding: false,
  },
  attentionTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_600SemiBold',
    includeFontPadding: false,
  },
  eventsList: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    padding: 0,
    gap: 16,
  },
  eventItem: {
    gap: 4,
  },
  eventTime: {
    fontSize: 13,
    lineHeight: 16,
    color: '#21C17C',
    fontFamily: 'Inter_600SemiBold',
    includeFontPadding: false,
  },
  eventTitle: {
    alignSelf: 'stretch',
    fontSize: 14,
    lineHeight: 17,
    color: '#4A4844',
    fontFamily: 'Inter_500Medium',
    includeFontPadding: false,
  },
  attentionList: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    padding: 0,
  },
  attentionWrapper: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    padding: 0,
  },
  attentionItem: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
  },
  dotAligner: {
    width: 8,
    height: 13,
    alignItems: 'flex-start',
    paddingTop: 5,
    flexGrow: 0,
    flexShrink: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  attentionText: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4A4844',
    fontFamily: 'Inter_400Regular',
  },
  attentionHighlight: {
    color: '#4A4844',
    fontFamily: 'Inter_600SemiBold',
  },
  attentionRest: {
    color: '#4A4844',
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: '#D9D6CF',
  },
});

export default HomeSidePanels;

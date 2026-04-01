import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import KeyHighlightCard from '@/components/student-performance/keyHighlight/KeyHighlightCard';

const KeyHighlightGrid = () => {
  return (
    <View style={styles.khShell}>
      <Text style={styles.khHeading}> Key Highlights </Text>
      <View style={styles.khGrid}>
        <KeyHighlightCard
          title="Overall Performance"
          value=""
          description="Student's cumulative grade till now in the subject."
          circularProgress={{ percent: 85 }}
        />
        <KeyHighlightCard
          title="Attendance Record"
          value=""
          description="Percentage of days present in class."
          progress={{ current: 90, total: 100 }}
        />
        <KeyHighlightCard
          title="Last Assignment Score"
          value=""
          description="Latest submitted assignment score - 95%"
          icon={require('@/assets/images/star_rate.png')}
        />
        <KeyHighlightCard
          title="Last Quiz Score"
          value=""
          description="Most recent quiz score and completion status - 88%"
          icon={require('@/assets/images/quiz.png')}
        />
        <KeyHighlightCard
          title="Engagement Level"
          value=""
          description="Student's participation in discussions & activities - High Engagement."
          icon={require('@/assets/images/bar_chart.png')}
        />
        <KeyHighlightCard
          title="Learning Behavior"
          value=""
          description="Student's consistency in participation & submissions - High Participation."
          icon={require('@/assets/images/thumb_up.png')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  khShell: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  khHeading: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  khGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default KeyHighlightGrid;

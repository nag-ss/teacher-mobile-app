import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MetricsCard from '@/components/classes/MetricsSection/MetricsCard';

const MetricsGrid = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.sectionHeading}> Key Metrics </Text>
        <View style={styles.grid}>
            <MetricsCard
              title="Class Average Score"
              value=""
              description="The average score of the class across all subjects."
              circularProgress={{ percent: 75 }}
            />
            <MetricsCard
              title="Attendance Rate"
              value=""
              description="The percentage of students attending classes regularly."
              progress={{ current: 95, total: 100 }}
            />
            <MetricsCard
              title="Pending Assignments"
              value=""
              description="Students yet to submit the assignment - 03 Nos"
              icon={require('@/assets/images/notification_important.png')}
            />
            <MetricsCard
              title="Upcoming Deadlines"
              value=""
              description="Number of assignments due soon - 02. Quiz evaluation in - 02 days"
              icon={require('@/assets/images/calendar_month.png')}
            />
            <MetricsCard
              title="Top Performer"
              value=""
              description="The highest-performing student in the class - Aarav Patel | 95%"
              icon={require('@/assets/images/star_rate.png')}
            />
            <MetricsCard
              title="Struggling Students"
              value=""
              description="Number of students scoring below 50% in recent assessments - 05"
              icon={require('@/assets/images/warning.png')}
            />
        </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  sectionHeading: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default MetricsGrid;

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MetricsCard from '@/components/classes/MetricsCard';

const MetricsGrid = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.sectionHeading}> Key Metrics </Text>
        <View style={styles.grid}>
            <MetricsCard title="Class Average Score" value="75%" description="The average score of the class across all subjects." />
            <MetricsCard title="Attendance Rate" value="95" description="The percentage of students attending classes regularly." />
            <MetricsCard title="Pending Assignments" value="3 Nos" description="Students yet to submit the assignment - 03 Nos" />
            <MetricsCard title="Upcoming Deadlines" value="02" description="Number of assignments due soon - 02. Quiz evaluation in - 02 days" />
            <MetricsCard title="Top Performer" value="" description="The highest-performing student in the class - Aarav Patel | 95%" />
            <MetricsCard title="Struggling Students" value="05" description="Number of students scoring below 50% in recent assessments - 05" />
        </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold'
    },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default MetricsGrid;

import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RecentActivityCard from './RecentActivityCard';

const activities = [
  {image: 'activityAnalytics', title: "Class Performance Update", text: "Average Score improved by 5% in last test"},
  {image: 'activityEngagement', title: "Student Engagement Summary", text: "85% students participated in last session"},
//   {image: 'activityStruggle', text: "Assignment Completion Rate - 92%"},
//   {image: 'activityTrend', text: "Quiz Results - Average score 78%"}
];

const RecentActivity = () => (
  <View style={styles.container}>
    <View style={styles.headerContent}>
        <Text style={styles.title}>Recent Activity</Text>
        
        <View style={styles.viewAllContent}>
            <Text style={{marginRight: -30}}>View All</Text>
            <SvgLoader svgFilePath='rightArrow' height={20} />
        </View>
    </View>
    
    {activities.map((activity, idx) => (
      <RecentActivityCard key={idx} image={activity.image} title={activity.title} text={activity.text} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  viewAllContent: {
    flexDirection: 'row',
    marginLeft: 5
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    marginBottom: 4,
  }
});

export default RecentActivity;

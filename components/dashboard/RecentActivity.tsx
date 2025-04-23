import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RecentActivityCard from './RecentActivityCard';

const activities = [
  {image: 'activityAnalytics', text: "Class Performance Update - Score improved by 5%"},
  {image: 'activityEngagement', text: "Student Engagement Summary - 85% participated"},
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
      <RecentActivityCard key={idx} image={activity.image}  text={activity.text} />
    ))}
  </View>
);

const styles = StyleSheet.create({
    container: {
    padding: 16,
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

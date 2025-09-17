import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RecentActivityCard from './RecentActivityCard';
import PerformanceDetailCard from './PerformanceDetailCard';

const activities = [
  {image: 'TrendUp', title: "Class Performance Update", text: "Average class score: 72% (+5%)"},
  {image: 'Average', title: "Student Engagement Summary", text: "Top 5 students: scoring above 90%"},
  {image: 'TrendDown', title: "Student Engagement Summary", text: "Lowest performing topic: Fractions (avg. 48%)"},
//   {image: 'activityStruggle', text: "Assignment Completion Rate - 92%"},
//   {image: 'activityTrend', text: "Quiz Results - Average score 78%"}
];

const PerformanceSummary = () => (
  <View style={styles.container}>
    <View style={styles.headerContent}>
        <Text style={styles.title}>Performance Summary</Text>
        
        <View style={styles.viewAllContent}>
            {/* <Text style={{marginRight: 10}}>View All</Text> */}
            {/* <SvgLoader svgFilePath='rightArrow' height={20} /> */}
            <Image style={{width: 20, height: 20}} source={require('../../assets/images/ss/rightArrow.png')} />
        </View>
    </View>
    
    {activities.map((activity, idx) => (
      <PerformanceDetailCard key={idx} image={activity.image} title={activity.title} text={activity.text} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    paddingBottom: 5,
    marginVertical: 5,
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

export default PerformanceSummary;

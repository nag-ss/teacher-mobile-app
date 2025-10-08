import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RecentActivityCard from './RecentActivityCard';
import PerformanceDetailCard from './PerformanceDetailCard';

const activities = [
  {image: 'Analytics', title: "Class Performance Update", text: "Low engagement: Only 60% took notes in last class."},
  {image: 'Feedback', title: "Student Engagement Summary", text: "3 students scored <50% in Algebra quiz."},
  {image: 'WarningNew', title: "Student Engagement Summary", text: "Assignment deadline missed by 4 students."},
  // {image: 'p2p', title: "Student Engagement Summary", text: "Intervention: 1-on-1 sessions scheduled with 2 students."},
  // {image: 'WarningNew', title: "Student Engagement Summary", text: "Connectivity issue flagged in last live class (8 students dropped)."},
];

const ImportantAlerts = () => (
  <View style={styles.container}>
    <View style={styles.headerContent}>
        <Text style={styles.title}>Important Alerts</Text>
        
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
    padding: 13.7,
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
    marginBottom: 9.14,
  },
  text: {
    marginBottom: 4,
  }
});

export default ImportantAlerts;

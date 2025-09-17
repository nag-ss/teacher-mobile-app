import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RecentActivityCard from './RecentActivityCard';
import PerformanceDetailCard from './PerformanceDetailCard';

const activities = [
  {image: 'Announcement', title: "Class Performance Update", text: "Parent-teacher meeting scheduled Friday 4 PM."},
  {image: 'Alert', title: "Student Engagement Summary", text: "5 quizzes pending evaluation (due in 2 days)."},
  {image: 'Alert', title: "Student Engagement Summary", text: "2 assignments need review (submitted yesterday)."},
];

const TeacherTodos = () => (
  <View style={styles.container}>
    <View style={styles.headerContent}>
        <Text style={styles.title}>Teacher Todo's</Text>
        
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

export default TeacherTodos;

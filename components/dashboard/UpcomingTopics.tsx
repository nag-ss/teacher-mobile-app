import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProgressBar from './Progressbar';
import ClassGradeSelection from './ClassGradeSelection';
import SvgLoader from '@/utils/SvgLoader';
import { Colors } from '@/constants/Colors';

const UpcomingTopics = () => (
  <View style={[styles.card, {flexDirection: 'row'}]}>
    <View style={styles.iconSection}>
      <View style={styles.iconContent}>
          {/* <SvgLoader svgFilePath="iconUpcoming" width={50} height={50}  /> */}
          <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/Upcoming.png')}  />
      </View>
    </View>
    
    <View style={{}}>
        <Text style={styles.title}>Upcoming Topics</Text>
        <Text>• Quadratic Equations</Text>
        <Text>• Trigonometry </Text>
    </View>
    
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subTitle: {
    marginTop: 12,
    fontWeight: '600',
  },
  iconSection: {
    // justifyContent: 'center', 
    // alignItems: 'center', 
  },
  iconContent: {
    height: 50, 
    width: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10, 
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: Colors.primaryColor
  }
});

export default UpcomingTopics;

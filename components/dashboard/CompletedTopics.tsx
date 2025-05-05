import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProgressBar from './Progressbar';
import ClassGradeSelection from './ClassGradeSelection';
import SvgLoader from '@/utils/SvgLoader';
import { Colors } from '@/constants/Colors';

const CompletedTopics = () => (
  <View style={[styles.card, {flexDirection: 'row'}]}>
    <View style={styles.iconContent}>
        {/* <SvgLoader svgFilePath="iconCompleted" width={50} height={50}  /> */}
        <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/Completed.png')} />
    </View>
    <View style={{height: 60}}>
        <Text style={styles.title}>Completed Topics</Text>
        <Text>• Pythagorean Theorem</Text>
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

export default CompletedTopics;

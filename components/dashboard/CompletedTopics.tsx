import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid } from 'react-native';
import ProgressBar from './Progressbar';
import ClassGradeSelection from './ClassGradeSelection';
import SvgLoader from '@/utils/SvgLoader';

const CompletedTopics = () => (
  <View style={[styles.card, {flexDirection: 'row'}]}>
    <View style={{marginRight: 5}}>
        <SvgLoader svgFilePath="iconCompleted" width={50} height={50}  />
    </View>
    <View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subTitle: {
    marginTop: 12,
    fontWeight: '600',
  }
});

export default CompletedTopics;

import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid } from 'react-native';
import ProgressBar from './Progressbar';
import ClassGradeSelection from './ClassGradeSelection';

const ClassProgress = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Class Progress</Text>
    <ClassGradeSelection />
    <ProgressBar progress={45} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    // padding: 16,
    borderRadius: 12,
    marginBottom: 16,
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

export default ClassProgress;

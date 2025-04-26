import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid } from 'react-native';
import ProgressBar from './Progressbar';
import ClassGradeSelection from './ClassGradeSelection';
import SvgLoader from '@/utils/SvgLoader';

const RecentActivityCard = ({image, title, text}: any) => (
  <View style={[styles.card, {flexDirection: 'row'}]}>
    <View style={{marginRight: 5}}>
        <SvgLoader svgFilePath={image} width={50} height={50}  />
    </View>
    <View style={{flex: 1, height: 50}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{text}</Text>
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
    fontSize: 12,
    // marginBottom: 8,
  },
  subTitle: {
    // marginTop: 10,
    fontSize: 10
  }
});

export default RecentActivityCard;

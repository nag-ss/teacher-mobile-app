import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProgressBar from './Progressbar';
import ClassGradeSelection from './ClassGradeSelection';
import SvgLoader from '@/utils/SvgLoader';
import { Colors } from '@/constants/Colors';

const RecentActivityCard = ({image, title, text}: any) => {
    const imgesUrls: any = {
        'Analytics': require('../../assets/images/ss/Analytics.png'),
        'Warning': require('../../assets/images/ss/Warning.png'),
        'Correct': require('../../assets/images/ss/Correct.png'),
        'Engagement': require('../../assets/images/ss/Engagement.png'),
    }
    return (
  <View style={[styles.card, {flexDirection: 'row'}]}>
    <View style={styles.iconSection}>
      <View style={styles.iconContent}>
          {/* <SvgLoader svgFilePath={image} width={50} height={50}  /> */}
          <Image style={{width: 40, height: 40}} source={imgesUrls[image]} />
      </View>
    </View>
    
    <View style={{flex: 1}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{text}</Text>
    </View>
    
  </View>
)};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    // backgroundColor: 'red',
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
  },
  iconSection: {
    justifyContent: 'center', 
    alignItems: 'center', 
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

export default RecentActivityCard;

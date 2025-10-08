import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ProgressBar from './Progressbar';
import ClassGradeSelection from './ClassGradeSelection';
import SvgLoader from '@/utils/SvgLoader';
import { Colors } from '@/constants/Colors';

const PerformanceDetailCard = ({image, title, text}: any) => {
    const imgesUrls: any = {
        'Analytics': require('../../assets/images/ss/Analytics.png'),
        'Warning': require('../../assets/images/ss/Warning.png'),
        'Correct': require('../../assets/images/ss/Correct.png'),
        'Engagement': require('../../assets/images/ss/Engagement.png'),
        'TrendUp': require('../../assets/images/ss/TrendUp.png'),
        'TrendDown': require('../../assets/images/ss/TrendDown.png'),
        'Average': require('../../assets/images/ss/Average.png'),
        'Announcement': require('../../assets/images/ss/Announcement.png'),
        'Alert': require('../../assets/images/ss/Alert.png'),
        'Feedback': require('../../assets/images/ss/Feedback.png'),
        'WarningNew': require('../../assets/images/ss/WarningNew.png'),
        'p2p': require('../../assets/images/ss/p2p.png'),
    }
    return (
  <View style={[styles.card, {flexDirection: 'row'}]}>
    <View style={styles.iconSection}>
      <View style={styles.iconContent}>
          {/* <SvgLoader svgFilePath={image} width={50} height={50}  /> */}
          <Image style={{width: 25, height: 25}} source={imgesUrls[image]} />
      </View>
    </View>
    
    <View style={{flex: 1, justifyContent: 'center'}}>
        {/* <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{title}</Text> */}
        <Text style={styles.subTitle}>{text}</Text>
    </View>
    
  </View>
)};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    // backgroundColor: 'red',
    padding: 9.14,
    marginBottom: 9.14,
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
   fontSize: 10,
    color: 'gray'
  },
  iconSection: {
    // justifyContent: 'center', 
    // alignItems: 'center', 
  },
  iconContent: {
    height: 25, 
    width: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 13.7, 
    // borderWidth: 1, 
    borderRadius: 5, 
    // borderColor: Colors.primaryColor
  }
});

export default PerformanceDetailCard;

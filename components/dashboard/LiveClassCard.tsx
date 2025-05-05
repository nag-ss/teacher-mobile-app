import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button, Badge } from 'react-native-elements';  // Import components from react-native-elements
import { MaterialIcons } from '@expo/vector-icons'; // For the "Live" icon
import SvgLoader from '@/utils/SvgLoader';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveClass } from '@/store/classSlice';
import moment from 'moment';

const LiveSessionCard = () => {
  const dispatch = useDispatch<any>();
  const { liveClass } = useSelector((state: any) => state.classes)

  const classData = {
    "class_id": 0,
    "date": "2025-05-05",
    "period": "string",
    "start_time": "06:03:29.464Z",
    "end_time": "06:03:29.464Z",
    "school_name": "string",
    "division_name": "string",
    "section_name": "string",
    "subject_name": "string",
    "teacher_first_name": "string",
    "teacher_last_name": "string",
    "assets": [
      {
        "asset_link": "string",
        "asset_type": "string"
      }
    ],
    "class_details": [
      {
        "Topic": "string",
        "Sub_topic": []
      }
    ]
  }
  const getDetails = async () => {
    await dispatch(getLiveClass())
  }
  useEffect(() => {
    getDetails()
  }, [])
  return (
    <View style={[styles.cardContainer, {opacity: liveClass.start_time ? 1 : 0.4 }]} pointerEvents={liveClass.start_time ? 'auto' : 'none'}>
      {/* Image and Text */}
      <View style={styles.sessionDetails}>
        {/* <SvgLoader svgFilePath="liveclass" width={200} height={200} style={styles.sessionImage}  /> */}
        <Image style={{width: 200, height: 200}} source={require('../../assets/images/ss/LiveClass.png')} />
        <View style={styles.textContainer}>
          <Text style={styles.time}>
            {liveClass.start_time ? (moment(liveClass.start_time, 'HH:mm:ss').format('HH:mm a')) : moment().format('HH:mm a')} - 
            {liveClass.end_time ? moment(liveClass.end_time, 'HH:mm:ss').format('HH:mm a') : moment().add(30, 'minutes').format('HH:mm a')}
          </Text>
          <View>
            <Text style={styles.subject}>
              {(liveClass.class_details && liveClass.class_details.length) ? liveClass.class_details[0].Topic : ''}
            </Text>
            <Text style={styles.category}>{liveClass.subject_name}</Text>
          </View>
          
          {/* Join Button */}
          <Button
            title="Join now"
            buttonStyle={styles.joinButton}
            titleStyle={styles.buttonTitle}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 1,
    // opacity: 0.4
    
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 1,  // For Android shadow
  },
  liveBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 15,
    // backgroundColor: 'red',
    justifyContent: 'space-between'
  },
  time: {
    fontSize: 14,
    color: '#555',
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  category: {
    fontSize: 14,
    color: '#888',
  },
  joinButton: {
    backgroundColor: '#21C17C',
    borderRadius: 8,
    marginTop: 15,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LiveSessionCard;

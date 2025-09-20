import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { Badge } from 'react-native-elements'; // For "Live" badge
import SvgLoader from '@/utils/SvgLoader';
import ClassPrep from './ClassPrep';
import moment from 'moment';
import { Colors } from '@/constants/Colors';


const TimelineCard = ({idx, item, height, currentDate, selectedClass}: any) => {
  const timelimeIntervalHeight = 35
  const [isLoad, setIsLoad] = useState(moment(new Date()).format('YYYY-MM-DD') == currentDate ? true : false)
  const [topic, setTopic] = useState(null);
  const [subTopic, setSubTopic] = useState(null);
  // const isLoad = true;
  const classPrepRef = useRef<any>();

  console.log("height ======= ", height)

  const subjectImageSize: any = {
    1: {height: 25, width: 20, fontSize: 8, headFontSize: 11},
    2: {height: 45, width: 45, fontSize: 8, headFontSize: 11},
    3: {height: 70, width: 65, fontSize: 11, headFontSize: 13},
    4: {height: 70, width: 65, fontSize: 12, headFontSize: 13},
  }
  const contentHeight = height > 4 ? 4 : height
  const openClassPrep = () => {
    // console.log("welcome to class ....")
    // console.log(moment(new Date()).format('YYYY-MM-DD'), currentDate);
    // fetch class tasks
    console.log(item)
    if(!item.isClassOver) {
      classPrepRef.current?.setSelectedClass()
    }
    // classPrepRef.current?.setSelectedClass()
    
    // if(moment(new Date()).format('YYYY-MM-DD') == currentDate) {
    //   console.log("I am in the if loop")
      
    // }
  }

  const updateTopicSubTopic = (topic: any, subTopic: any) => {
    setTopic(topic.topic)
    setSubTopic(subTopic.sub_topic)
    console.log(subTopic)
  }

  useEffect(() => {
    if(selectedClass?.class_details[0]?.topic && selectedClass?.class_details[0]?.sub_topic[0]) {
      setTopic(selectedClass?.class_details[0].topic)
      setSubTopic(selectedClass?.class_details[0]?.sub_topic[0])
    }
  }, [selectedClass]);

  return (
    <TouchableOpacity key={idx} style={[styles.classCard, {height: height*timelimeIntervalHeight, borderColor: item.live ? Colors.primaryColor : '', backgroundColor: item.isClassOver ? 'grey' : '#fff', opacity: item.isClassOver ? 0.4 : 0 }]} onPress={openClassPrep}>
        <View style={[styles.classHeader]}>
            {/* <SvgLoader svgFilePath="chemistry" width={height == 1 ? 50 : 70} height={height == 1 ? 50 :70}  /> */}
            <Image style={{width: subjectImageSize[contentHeight].width, height: subjectImageSize[contentHeight].height}} source={require('../../assets/images/ss/Chemistry.png')} />
            <View style={{height: (subjectImageSize[contentHeight].height + 10), marginLeft: 10, flexDirection: height == 1 ? 'row' : 'column', justifyContent: 'center', alignItems: 'center', width: 220}}>
                <Text style={[styles.classTime, {fontSize: subjectImageSize[contentHeight].fontSize}]}>{item.time}</Text>
                <Text style={[styles.topic, {fontSize: subjectImageSize[contentHeight].headFontSize}]} numberOfLines={1}>{topic} - {subTopic}</Text>
                {/* <Text style={styles.classSubject}>{item.subject}</Text> */}
                <Text style={[styles.classCategory, {fontSize: subjectImageSize[contentHeight].fontSize}]}>{item.category}</Text>
            </View>
            
        </View>
        {item.live && (
            <Badge status="error" containerStyle={styles.liveBadge} />
        )}
        {/* Used to view older classes */}
        {/* {true ? 
          <ClassPrep item={item} selectedClass={selectedClass} updateTopicSubTopic={updateTopicSubTopic} ref={classPrepRef} />
        : null} */} 
        {isLoad ? 
          <ClassPrep item={item} selectedClass={selectedClass} updateTopicSubTopic={updateTopicSubTopic} ref={classPrepRef} />
        : null}
    </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({
  classCard: {
    padding: 15,
    // marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: 'lightgray',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 5,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginLeft: 10,
  },
  classCategory: {
    fontSize: 14,
    // color: '#888',
    marginTop: 5,
    fontWeight: 'bold',
  },
  classTime: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    fontWeight: 'bold',
  },
  topic: {
    fontSize: 16,
    fontWeight: 'bold',
    // width: 250
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
});

export default TimelineCard;

import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { Badge } from 'react-native-elements'; // For "Live" badge
import SvgLoader from '@/utils/SvgLoader';
import ClassPrep from './ClassPrep';
import moment from 'moment';
import { Colors } from '@/constants/Colors';


const TimelineCard = ({idx, item, height, currentDate, selectedClass}: any) => {
  // const timelimeIntervalHeight = 35
  const timelimeIntervalHeight = 27.5
  // const timelimeIntervalHeight = 0.458
  const [isLoad, setIsLoad] = useState(moment(new Date()).format('YYYY-MM-DD') == currentDate ? true : false)
  const [topic, setTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");
  // const isLoad = true;
  const classPrepRef = useRef<any>();

  console.log("height ======= ", height)

  const subjectImageSize: any = {
    1: {height: 25, width: 20, fontSize: 9.1, headFontSize: 9.1, subjectFontSize: 8},
    2: {height: 40, width: 40, fontSize: 9.1, headFontSize: 12, subjectFontSize: 9.1},
    3: {height: 70, width: 65, fontSize: 9.1, headFontSize: 13.5, subjectFontSize: 11.5},
    4: {height: 70, width: 65, fontSize: 11.5, headFontSize: 16, subjectFontSize: 13.5},
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
    <TouchableOpacity key={idx} style={[styles.classCard, {height: height*timelimeIntervalHeight, borderColor: item.live ? Colors.primaryColor : '', backgroundColor: item.isClassOver ? 'grey' : '#fff', opacity: item.isClassOver ? 0.4 : 1 }]} onPress={openClassPrep}>
        <View style={[styles.classHeader]}>
            {/* <SvgLoader svgFilePath="chemistry" width={height == 1 ? 50 : 70} height={height == 1 ? 50 :70}  /> */}
            <View style={{width: 70, alignItems: 'center'}}>
              <Image style={{width: subjectImageSize[contentHeight].width, height: subjectImageSize[contentHeight].height}} source={require('../../assets/images/ss/Chemistry.png')} />
            </View>
            
            <View style={{height: (subjectImageSize[contentHeight].height + 10), marginLeft: 24, flexDirection: height == 1 ? 'row' : 'column', justifyContent:'center',  width: 220}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image style={{width: 14, height: 14}} source={require('../../assets/images/ss/Schedule.png')} />
                  <Text style={[styles.classTime, {fontSize: subjectImageSize[contentHeight].fontSize}]}>{item.time}</Text>
                </View>
                
                {(topic && subTopic) &&(<Text style={[styles.topic, {fontSize: subjectImageSize[contentHeight].headFontSize}, height == 1 ? {marginLeft: 5, width: 150} : {}]} numberOfLines={1}>{topic} - {subTopic}</Text>)}
                {/* <Text style={styles.classSubject}>{item.subject}</Text> */}
                {
                  height > 1 ? <Text style={[styles.classCategory, {fontSize: subjectImageSize[contentHeight].subjectFontSize}]}>{item.category}</Text> :  null
                }
                
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
    // fontSize: 14,
    // color: '#888',
    // marginTop: 5,
    // fontWeight: 'bold',
  },
  classTime: {
    // fontSize: 14,
    color: '#555',
    // marginTop: 5,
    fontWeight: 'bold',
    marginLeft: 5
  },
  topic: {
    // fontSize: 16,
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

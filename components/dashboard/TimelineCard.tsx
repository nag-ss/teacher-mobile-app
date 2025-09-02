import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { Badge } from 'react-native-elements'; // For "Live" badge
import SvgLoader from '@/utils/SvgLoader';
import ClassPrep from './ClassPrep';
import moment from 'moment';


const TimelineCard = ({idx, item, height, currentDate, selectedClass}: any) => {

  const [isLoad, setIsLoad] = useState(moment(new Date()).format('YYYY-MM-DD') == currentDate ? true : false)
  // const isLoad = true;
  const classPrepRef = useRef<any>();

  const openClassPrep = () => {
    // console.log("welcome to class ....")
    // console.log(moment(new Date()).format('YYYY-MM-DD'), currentDate);
    // fetch class tasks
    console.log(item)
    if(!item.isClassOver) {
      classPrepRef.current?.setSelectedClass()
    }
    
    // if(moment(new Date()).format('YYYY-MM-DD') == currentDate) {
    //   console.log("I am in the if loop")
      
    // }
  }



  return (
    <TouchableOpacity key={idx} style={[styles.classCard, {height: height*50, backgroundColor: item.isClassOver ? '#D3D3D3' : '#fff'}]} onPress={openClassPrep}>
        <View style={[styles.classHeader]}>
            {/* <SvgLoader svgFilePath="chemistry" width={height == 1 ? 50 : 70} height={height == 1 ? 50 :70}  /> */}
            <Image style={{width: height == 1 ? 45 : 65, height: height == 1 ? 45 : 70}} source={require('../../assets/images/ss/Chemistry.png')} />
            <View style={{marginLeft: 10, flexDirection: height == 1 ? 'row' : 'column', justifyContent: 'space-between'}}>
                <Text style={styles.classTime}>{item.time}</Text>
                <Text style={styles.topic}>{selectedClass?.class_details[0]?.topic} - {selectedClass?.class_details[0]?.sub_topic[0]}</Text>
                <Text style={styles.classSubject}>{item.subject}</Text>
                <Text style={styles.classCategory}>{item.category}</Text>
            </View>
            
        </View>
        {item.live && (
            <Badge status="error" containerStyle={styles.liveBadge} />
        )}
        {isLoad ? 
          <ClassPrep item={item} selectedClass={selectedClass} ref={classPrepRef} />
        : null}
    </TouchableOpacity>
    
  );
};

const styles = StyleSheet.create({
  classCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
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
    color: '#888',
    marginTop: 5,
  },
  classTime: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  topic: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 250
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
});

export default TimelineCard;

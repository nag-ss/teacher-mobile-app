import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button, Badge } from 'react-native-elements';  // Import components from react-native-elements
import { MaterialIcons } from '@expo/vector-icons'; // For the "Live" icon
import SvgLoader from '@/utils/SvgLoader';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveClass, getScheduleClasses, setUnAuth } from '@/store/classSlice';
import moment from 'moment';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { setClassId, setSelectedTask } from '@/store/liveMonitoringSlice';
import { logout } from '@/store/authSlice';

function useIntervalApi(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) return;

    const tick = () => savedCallback.current?.();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}


const LiveSessionCard = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>()
  const { liveClass, classTimeline, unAuthorised } = useSelector((state: any) => state.classes)
  const [timelineData, setTimelineData] = useState([])
  const [nextClass, setNextClass] = useState<any>({})
  const [isnextClass, setIsNextClass] = useState<boolean>(false)
  const classData = {
    "class_schedule_id": 0,
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
    let liveClassDataRes = await dispatch(getLiveClass())
    console.log("liveClassDataRes.payload")
    console.log(liveClassDataRes.payload)
    if(!liveClassDataRes.payload) {
      
      getClassFromSchedule()
    } else {
      console.log("liveClassDataRes.payload ----")
      console.log(liveClassDataRes.payload)
      setNextClass(liveClassDataRes.payload)
      // getClassFromSchedule()
    }
  }
  useIntervalApi(getDetails, 300000);
  // useIntervalApi(getDetails, 30000000);
  // useEffect(() => {
  //   getDetails()
  // }, [])

  useFocusEffect(useCallback(() => {
    console.log("calling focus effect ....")
    getDetails()
  }, [])
  )

  useEffect(() => {
    console.log("unAuthorised", unAuthorised)
    if(unAuthorised) {
      dispatch(setUnAuth())
      dispatch(logout())
    }
  }, [unAuthorised])

  const getClassFromSchedule = async () => {
    console.log("next call")
    console.log(classTimeline)
    const reqObj: any = {
      date: moment(new Date()).format('YYYY-MM-DD')
    }
    let schClassesRes = await dispatch(getScheduleClasses(reqObj))
    console.log(" shcedule paylod ")
    console.log(schClassesRes.payload)
    let tLime = schClassesRes.payload
    if(tLime && tLime.length) {
      console.log("am in liv sc")
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
        let timelineDataArray = tLime.map((timeline: any) => {
            
            console.log(timeline.start_time)
            console.log(moment(timeline.start_time))
            var startTime = moment(timeline.start_time, 'HH:mm:ss').format('HH:mm');
            const [hours, minutes] = startTime.split(':').map(Number);
            const itemMinutes = hours * 60 + minutes;
            console.log("------------")
            console.log({ ...timeline, itemMinutes })
            return { ...timeline, itemMinutes };
        }).filter((item: any) => item.itemMinutes > currentMinutes)
        .sort((a: any, b: any) => a.itemMinutes - b.itemMinutes);
        if(timelineDataArray.length) {
          setNextClass(timelineDataArray[0])
          console.log(timelineDataArray[0])
          setIsNextClass(true)
        }
        
    } else {
        
    }
  }

  const navigateToMonitor = () => {
    console.log("calling nav ...")
    if(nextClass && nextClass.class_schedule_id) {
      dispatch(setSelectedTask('Attendance'))
      dispatch(setClassId(nextClass.class_schedule_id))
      navigation.navigate('live-monitoring')
    }
    
  }
  return (
    <View style={[styles.cardContainer, nextClass.class_schedule_id ? {backgroundColor: '#21C17C'} : {borderWidth: 1, borderColor: 'lightgray'}]} pointerEvents={nextClass.class_schedule_id ? 'auto' : 'auto'}>
      <View style={[styles.sessionDetails, {}]}>
        {/* <View style={{width: 200, height: 200, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 100}}>
          <Image style={{width: 120, height: 120}} source={require('../../assets/images/ss/no_class.png')} />
        </View> */}
      
        {
          (isnextClass) ? 
          <Image style={{width: 145, height: 145}} source={require('../../assets/images/ss/subject.png')} />
        : 
        !nextClass.class_schedule_id ? 
        <View style={{marginLeft: 20}}><Image style={{width: 120, height: 120}} source={require('../../assets/images/ss/no_class.png')} /></View>
        : <View style={{marginLeft: 20}}>
          <Image style={{width: 50, height: 20}} source={require('../../assets/images/ss/LiveButton.png')} />
          <Image style={{width: 145, height: 145}} source={require('../../assets/images/ss/subject.png')} />
          </View>
        }
        
        {
        nextClass.class_schedule_id ?
          <View style={styles.textContainer}>
          <Text style={styles.time}>
            {nextClass.start_time ? (moment(nextClass.start_time, 'HH:mm:ss').format('HH:mm a')) : moment().format('HH:mm a')} - 
            {nextClass.end_time ? moment(nextClass.end_time, 'HH:mm:ss').format('HH:mm a') : moment().add(30, 'minutes').format('HH:mm a')}
          </Text>
          <View>
            <Text style={styles.subject}>
              {(nextClass.class_details && nextClass.class_details.length) ? nextClass.class_details[0].Topic : ''}
            </Text>
            <Text style={styles.category}>{nextClass.subject_name}</Text>
          </View>
          <TouchableOpacity style={styles.joinButton} onPress={navigateToMonitor}>
            <Text style={styles.buttonTitle}>{isnextClass ? 'Upcoming' : "Join now"}</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={styles.textContainer}>
          <View>
            
          </View>
          <View>
            <Text style={styles.noClassText}>
              No Classes Found Today 
            </Text>
            {/* <View style={{alignItems: 'center'}}>
              <Text style={styles.category}>Chill until then!</Text>
            </View> */}
          </View>
          
          
        </View>
      } 
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    // marginVertical: 10,
    borderRadius: 8,
    // borderColor: 'gray',
    // borderWidth: 1,
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
    height: 200,
  },
  sessionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 25,
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    // width: '100%'
  },
  time: {
    fontSize: 9.12,
    color: '#555',
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  category: {
    fontSize: 14,
    color: '#000',
  },
  joinButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 15,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noClassText: {
    width: 200,
    fontSize: 20,
    textAlign: 'center',
    // fontWeight: 'bold',
    color: '#000',
  },
});

export default LiveSessionCard;

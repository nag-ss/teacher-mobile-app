import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import TimelineCard from './TimelineCard';
import { LayoutChangeEvent } from 'react-native';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleClasses } from '@/store/classSlice';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from "react-native-calendars";

/*const timelineData = [
  {
    time: '08:30 - 09:00',
    subject: 'Algebra - Linear Equations',
    category: 'Physics',
    live: false,
    startTime: '08:30', 
    classLength: 30
  },
  {
    time: '09:30 - 10:15',
    subject: 'Algebra - Linear Equations',
    category: 'Physics',
    live: false,
    startTime: '09:30', 
    classLength: 45
  },
  {
    time: '11:00 - 11:45',
    subject: 'Chemistry - Periodic Table',
    category: 'Chemistry',
    live: true,
    startTime: '11:00', 
    classLength: 45
  },
  {
    time: '12:00 - 12:30',
    subject: 'Physics - Newton\'s Laws',
    category: 'Physics',
    live: false,
    startTime: '12:00', 
    classLength: 30
  },
  {
    time: '14:00 - 14:15',
    // subject: 'Biology - Cell Structure',
    category: 'Biology',
    live: false,
    startTime: '14:00', 
    classLength: 15
  },
];*/



// const timeSlots = ['08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45',
//     '11:00', '11:15', '11:30', '11:45','12:00', '12:15', '12:30', '12:45','13:00', '13:15', '13:30', '13:45',
//     '14:00', '14:15', '14:30', '14:45','15:00', '15:15', '15:30', '15:45'
// ];

const TimelineWithClassDetails = () => {
    // const [noClass, setNoClass] = useState(0)
    let noClass = 0
    let closestSlot = '08:00'
    const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
  const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
  const scrollIndicator = useRef(new Animated.Value(0)).current;

  const scrollIndicatorSize =
    completeScrollBarHeight > visibleScrollBarHeight
      ? (visibleScrollBarHeight * visibleScrollBarHeight)
        / completeScrollBarHeight
      : visibleScrollBarHeight;

  const difference =
    visibleScrollBarHeight > scrollIndicatorSize
      ? visibleScrollBarHeight - scrollIndicatorSize
      : 1;

  const scrollIndicatorPosition = Animated.multiply(
    scrollIndicator,
    visibleScrollBarHeight / completeScrollBarHeight,
  ).interpolate({
    extrapolate: 'clamp',
    inputRange: [0, difference],
    outputRange: [0, difference],
  });

  const onContentSizeChange = (_: any, contentHeight: any) => 
    setCompleteScrollBarHeight(contentHeight);

const onLayout = (event: LayoutChangeEvent): void => {
  const { height } = event.nativeEvent.layout;
  setVisibleScrollBarHeight(height);
};

    const dispatch = useDispatch<any>();
    const { classTimeline } = useSelector((state: any) => state.classes)
    const [timelineData, setTimelineData] = useState([])
    const [timeSlots, setTimeSlots] = useState<string[]>([])
    const timelineRef = useRef<any>()
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [show, setShow] = useState(false);

  const onDateChange = (selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    console.log("======================")
    console.log(currentDate);
    console.log("======================")
    setDate(currentDate);
    getDetails(moment(currentDate).format('YYYY-MM-DD'))
  };

  const showDate = () => {
    setShow(!show);
  };

    const getDetails = async (currentDate: string) => {
      const reqObj: any = {
        date: currentDate
      }
      console.log("get classes by date")
      console.log(reqObj)
       await dispatch(getScheduleClasses(reqObj))
       
    }
    useEffect(() => {
        getDetails(moment(new Date()).format('YYYY-MM-DD'))
    }, [])

    function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number) {
        const slots = [];
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
    
        const start = new Date();
        start.setHours(startHour, startMinute, 0, 0);
    
        const end = new Date();
        end.setHours(endHour, endMinute, 0, 0);
    
        while (start <= end) {
            const hours = String(start.getHours()).padStart(2, '0');
            const minutes = String(start.getMinutes()).padStart(2, '0');
            slots.push(`${hours}:${minutes}`);
            start.setMinutes(start.getMinutes() + intervalMinutes);
        }
    
        return slots;
    }

    const getLastQuarterHour = (): string => {
        const now = new Date();
        const minutes = now.getMinutes();
        const roundedMinutes = Math.floor(minutes / 15) * 15;
        
        now.setMinutes(roundedMinutes);
        now.setSeconds(0);
        now.setMilliseconds(0);
      
        const hh = now.getHours().toString().padStart(2, '0');
        const mm = now.getMinutes().toString().padStart(2, '0');
        return `${hh}:${mm}`;
    };
    
    useEffect(() => {
        if(classTimeline && classTimeline.length) {
            let timelineDataArray = classTimeline.map((timeline: any) => {
                /*response sample 
                {
                    "class_id": 32,
                    "date": "2025-05-03",
                    "period": "Period 1",
                    "start_time": "18:00:00",
                    "end_time": "18:59:00",
                    "school_name": "Super School",
                    "division_name": "Class 8",
                    "section_name": "A",
                    "subject_name": "Maths",
                    "teacher_first_name": "Nageswara Rao",
                    "teacher_last_name": "Nali",
                    "assets": [],
                    "class_details": []
                  },*/
                console.log(timeline.start_time)
                console.log(moment(timeline.start_time))
                var startTime = moment(timeline.start_time, 'HH:mm:ss');
                var endTime = moment(timeline.end_time, 'HH:mm:ss');
                let startTimeStr = startTime.format('HH:mm')
                let endTimeStr = endTime.format('HH:mm')

                var duration = moment.duration(endTime.diff(startTime));

                // var minutes = duration.asMinutes() % 60;
                var minutes = duration.asMinutes()
                return {
                    classId: timeline.class_schedule_id,
                    time: startTimeStr + " - " + endTimeStr,
                    // subject: 'Biology - Cell Structure',
                    category: timeline.subject_name,
                    live: false,
                    startTime: startTimeStr, 
                    classLength: minutes
                }
            })
            console.log("timelineDataArray")
            console.log(timelineDataArray)
            setTimelineData(timelineDataArray)
            const firstClassTime = moment(classTimeline[0].start_time, 'HH:mm:ss').format('HH:mm')
            const lastClassTime = moment(classTimeline[classTimeline.length-1].end_time, 'HH:mm:ss').format('HH:mm')
            // const timeSlotsData = generateTimeSlots(firstClassTime, lastClassTime, 15);
            const timeSlotsData = generateTimeSlots('8:00', lastClassTime, 15);
            setTimeSlots(timeSlotsData)
            closestSlot = timeSlots[0];
            const preTime = getLastQuarterHour()
            const ind = timeSlotsData.indexOf(preTime)
            console.log("preTime")
            console.log(preTime)
            console.log(ind)

            console.log("timeSlotsData")
            console.log(timeSlotsData)
            let y= ind*100;
            timelineRef.current.scrollTo({x: 0, y, animated: true});
        } else {
            const timeSlotsData = generateTimeSlots('8:00', '17:00', 15);
            setTimeSlots(timeSlotsData)
            closestSlot = timeSlots[0];
            setTimelineData([])
        }
    }, [classTimeline])

    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };
  return (
    <View style={styles.mainContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10}}> 
            <Text style={styles.timelineText}>Today's Timeline</Text>
            <View style={{flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 5, paddingHorizontal: 20, paddingVertical: 5}}>
                <MaterialIcons
                    name="calendar-month"
                    size={20}
                    color={'gray' }
                    onPress={showDate}
                    />
                <Text style={styles.timelineDateText}>{moment(date).format('DD-MM-YYYY')}</Text>
                
                {show && (
                  <View style={styles.calendarOverlay}>
                    <Calendar
                        onDayPress={(day: any) => {
                          // setDate(day.dateString);
                          // setShow(false);
                          onDateChange(day.dateString)
                        }}
                        markedDates={{
                          [date as any]: { selected: true, selectedColor: "green" },
                        }}
                        theme={{
                          backgroundColor: '#ffffff',
                          calendarBackground: '#ffffff',
                          textSectionTitleColor: '#b6c1cd',
                          selectedDayBackgroundColor: 'green',
                          selectedDayTextColor: '#ffffff',
                          todayTextColor: '#00adf5',
                          dayTextColor: '#2d4150',
                          textDisabledColor: '#dd99ee'
                        }}
                        
                      />
                  </View>
                )}
                
            </View>
            
            
        </View>
        <View style={{flexDirection: 'row', height: '93%', marginTop: 10}}>
            <ScrollView  
                // persistentScrollbar={true} style={{}} indicatorStyle='black' scrollEventThrottle={25} 
                contentContainerStyle={{ paddingRight: 14 }}
            onContentSizeChange={onContentSizeChange}
            onLayout={onLayout}
            onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
            { useNativeDriver: false },
            )}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            ref={timelineRef}
            
                >
                <View style={styles.container}>
                    <View style={styles.leftColumn}>
                        {/* Left Column with Time */}
                        <ScrollView style={styles.timeColumn}>
                        {timeSlots.map((time, index) => (
                            <View key={index} style={{height: 50}}>
                                <Text  style={styles.timeText}>
                                    {  parseInt(time.split(':')[1]) == 0 ? time : (parseInt(time.split(':')[1]) == 30 ? '_____' : '___')
                                    }
                                </Text>
                            </View>
                            
                        ))}
                        </ScrollView>
                    </View>

                    {/* Right Column with Class Details */}
                    <View style={styles.rightColumn}>
                        <ScrollView style={styles.classColumn}>
                        {
                        timeSlots.map((timeSlot, index) => {
                            // Find the classes that start at or after the current time slot
                            const classesForTimeSlot = timelineData.filter((item: any) => {
                              // Check if class starts at or after the current time slot
                              const [classHour, classMins] = item.startTime.split(':');
                              const [slotHour, slotMins] = timeSlot.split(':');
                              if((parseInt(classHour) === parseInt(slotHour) && parseInt(classMins) === parseInt(slotMins))) {
                                
                                return item
                              }
                              if(parseInt(classHour) === parseInt(slotHour) && parseInt(classMins)%15 != 0) {
                                const slotMinutes = toMinutes(timeSlot);
                                const targetMinutes = toMinutes(item.startTime);
                                // const targetMinutes = toMinutes('18:50');
                                // const diff = Math.abs(slotMinutes - targetMinutes);
                                const diff = (targetMinutes - slotMinutes);
                                
                                // let smallestDiff = Math.abs(toMinutes(closestSlot) - targetMinutes);
                                let smallestDiff = 14;
                                // console.log(slotMinutes, targetMinutes, "-----------------", timeSlot, item.startTime, noClass)
                                // console.log(diff, smallestDiff, "-----------------")
                                if (diff > 0 && diff < smallestDiff) {
                                  // console.log("item +++++")
                                // console.log(item)
                                // console.log(noClass)
                                  closestSlot = timeSlots[index];
                                  return item
                                  
                                }
                              }
                            
                            });
                            // console.log(classesForTimeSlot.length, timeSlot, noClass)
                            if(noClass > 0) noClass = noClass-1
                            if(noClass < 0) noClass = 0
                            return (
                            <View key={index} style={styles.classWrapper}>
                                {classesForTimeSlot.length > 0 ? (
                                classesForTimeSlot.map((item: any, idx) => {
                                    const relevant_class = classTimeline.filter((c: any) => c.class_schedule_id == item.classId)[0];
                                    // setNoClass(noClass + (item.classLength/15))
                                    console.log("relevant_class");
                                    console.log(relevant_class);
                                    // noClass = noClass + (item.classLength == 15 ? -1 : (item.classLength)/15) + 1
                                    noClass = Math.floor(noClass + (item.classLength == 15 ? 0 : item.classLength/15) )
                                    return (<TimelineCard key={index+"-"+idx} idx={index+"-"+idx} item={item} selectedClass={relevant_class} height={item.classLength/15} currentDate={date} />)
                                })
                                ) : noClass < 1 ? (
                                
                                    <View style={[styles.emptySpace]}></View>
                                    
                                
                                ) : null }
                            </View>
                            );
                            
                        })}
                        </ScrollView>
                    </View>
                    </View>
            </ScrollView>
            <View style={styles.customScrollBarBackground}>
            <Animated.View
            style={[
                styles.customScrollBar,
                {
                height: scrollIndicatorSize,
                transform: [{ translateY: scrollIndicatorPosition }],
                },
            ]}
            />
        </View>
        </View>
        
    </View>
    
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    flexDirection: 'column', 
    marginTop: 10, 
    marginBottom: 10,
    // backgroundColor: 'red',
    paddingLeft: 15
  },
  container: {
    flexDirection: 'row',
    marginTop: 20,
    // backgroundColor: 'red'
    // paddingHorizontal: 10,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingRight: 5,
    // backgroundColor: 'red'
  },
  timeColumn: {
    // paddingRight: 10,
  },
  timeText: {
    fontSize: 12,
    // marginVertical: 10,
    // textAlign: 'center',
    // color: '#555',
    // backgroundColor: 'red'
  },
  rightColumn: {
    flex: 9,
    position: 'relative', 
    // backgroundColor: 'red',
    // paddingTop: 10
  },
  classColumn: {
    paddingLeft: 10,
  },
  classWrapper: {
    position: 'relative',
    // marginBottom: 10,
    // backgroundColor: 'red'
  },
  classCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 5, // For Android shadow
  },
  emptySpace: {
    height: 40,
    // backgroundColor: '#f0f0f0',
    // backgroundColor: '#fff',
    marginBottom: 10,
    // backgroundColor: 'red'
  },
  timelineText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  timelineDateText: {
    fontSize: 15,
    marginLeft: 10
  },
  customScrollBar: {
    // backgroundColor: '#ccc',
    backgroundColor: 'gray',
    borderRadius: 3,
    width: 8,
  },
  customScrollBarBackground: {
    // backgroundColor: '#232323',
    backgroundColor: 'lightgray',
    borderRadius: 3,
    // height: '100%',
    width: 8,
  },
  calendarOverlay: {
    position: "absolute",
    top: 35, // adjust to place it below icon
    zIndex: 999,
    elevation: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  }
});

export default TimelineWithClassDetails;

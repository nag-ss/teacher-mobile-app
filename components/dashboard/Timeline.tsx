import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import TimelineCard from './TimelineCard';
import { LayoutChangeEvent } from 'react-native';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

const timelineData = [
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
];

const timeSlots = ['08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45','12:00', '12:15', '12:30', '12:45','13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45','15:00', '15:15', '15:30', '15:45'
];

const TimelineWithClassDetails = () => {
    // const [noClass, setNoClass] = useState(0)
    let noClass = 0
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

//   const onLayout1 = ({
//     nativeEvent: {
//       layout: { height },
//     },
//   }) => {
//     setVisibleScrollBarHeight(height);
//   };

  

const onLayout = (event: LayoutChangeEvent): void => {
  const { height } = event.nativeEvent.layout;
  setVisibleScrollBarHeight(height);
};

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10}}> 
            <Text style={styles.timelineText}>Today's Timeline</Text>
            <View style={{flexDirection: 'row'}}>
                <MaterialIcons
                    name="calendar-month"
                    size={24}
                    color={'gray' }
                    />
                <Text style={styles.timelineDateText}>2025-04-22</Text>
            </View>
            
        </View>
        <View style={{flexDirection: 'row', height: '95%'}}>
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
            
                >
                <View style={styles.container}>
                    <View style={styles.leftColumn}>
                        {/* Left Column with Time */}
                        <ScrollView style={styles.timeColumn}>
                        {timeSlots.map((time, index) => (
                            <View style={{height: 50}}>
                                <Text key={index} style={styles.timeText}>
                                    {time}
                                </Text>
                            </View>
                            
                        ))}
                        </ScrollView>
                    </View>

                    {/* Right Column with Class Details */}
                    <View style={styles.rightColumn}>
                        <ScrollView style={styles.classColumn}>
                        {timeSlots.map((timeSlot, index) => {
                            // Find the classes that start at or after the current time slot
                            const classesForTimeSlot = timelineData.filter((item) => {
                            // Check if class starts at or after the current time slot
                            const [classHour, classMins] = item.startTime.split(':');
                            const [slotHour, slotMins] = timeSlot.split(':');
                            return (parseInt(classHour) === parseInt(slotHour) && parseInt(classMins) === parseInt(slotMins));
                            });
                            if(noClass > 0) noClass = noClass-1
                            return (
                            <View key={index} style={styles.classWrapper}>
                                {classesForTimeSlot.length > 0 ? (
                                classesForTimeSlot.map((item, idx) => {
                                    // setNoClass(noClass + (item.classLength/15))
                                    noClass = noClass + (item.classLength/15) + 1
                                    return (<TimelineCard idx={index+"-"+idx} item={item} height={item.classLength/15} />)
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
  container: {
    flexDirection: 'row',
    marginTop: 20,
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
    textAlign: 'center',
    // color: '#555',
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
    marginBottom: 10,
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
    height: 30,
    // backgroundColor: '#f0f0f0',
    // backgroundColor: '#fff',
    marginBottom: 10,
  },
  timelineText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  timelineDateText: {
    fontSize: 15,
    marginLeft: 5
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
    height: '100%',
    width: 8,
  },
});

export default TimelineWithClassDetails;

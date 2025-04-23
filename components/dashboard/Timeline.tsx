import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import TimelineCard from './TimelineCard';

const timelineData = [
  {
    time: '09:30 - 10:15',
    subject: 'Algebra - Linear Equations',
    category: 'Physics',
    live: true,
    startTime: '09:30', 
  },
  {
    time: '11:00 - 11:45',
    subject: 'Chemistry - Periodic Table',
    category: 'Chemistry',
    live: true,
    startTime: '11:00', 
  },
  {
    time: '12:00 - 12:45',
    subject: 'Physics - Newton\'s Laws',
    category: 'Physics',
    live: false,
    startTime: '12:00', 
  },
  {
    time: '14:00 - 14:45',
    subject: 'Biology - Cell Structure',
    category: 'Biology',
    live: false,
    startTime: '14:00', 
  },
];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

const TimelineWithClassDetails = () => {
  return (
    <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
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
        <ScrollView  persistentScrollbar={true} style={{}}>
            <View style={styles.container}>
                <View style={styles.leftColumn}>
                    {/* Left Column with Time */}
                    <ScrollView style={styles.timeColumn}>
                    {timeSlots.map((time, index) => (
                        <View style={{height: 120}}>
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
                        const [classHour] = item.startTime.split(':');
                        const [slotHour] = timeSlot.split(':');
                        return parseInt(classHour) === parseInt(slotHour);
                        });

                        return (
                        <View key={index} style={styles.classWrapper}>
                            {classesForTimeSlot.length > 0 ? (
                            classesForTimeSlot.map((item, idx) => (
                                <TimelineCard idx={index+"-"+idx} item={item} />
                            ))
                            ) : (
                            <View style={[styles.classCard, styles.emptySpace]}></View>
                            )}
                        </View>
                        );
                    })}
                    </ScrollView>
                </View>
                </View>
        </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  leftColumn: {
    flex: 2,
    marginRight: 15,
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingRight: 15,
  },
  timeColumn: {
    paddingRight: 10,
  },
  timeText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    color: '#555',
  },
  rightColumn: {
    flex: 8,
    position: 'relative', 
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5, // For Android shadow
  },
  emptySpace: {
    height: 100,
    // backgroundColor: '#f0f0f0',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  timelineText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  timelineDateText: {
    fontSize: 15,
    marginLeft: 5
  }
});

export default TimelineWithClassDetails;

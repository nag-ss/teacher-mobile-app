import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View , Text} from 'react-native';
import TaskSection from '@/components/live-monitoring/TaskSection';
import StudentGrid from '@/components/live-monitoring/StudentGrid';
import AICheckSummary from '@/components/live-monitoring/AICheckSummary';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const LiveMonitorHeader = () => {
  const [activeStudentsCount, setActiveStudentsCount] = useState(0)
  const [totalStudentsCount, setTotalStudentsCount] = useState(0)

  const { studentsData } = useSelector((state: any) => state.liveMonitor)
  const { liveClass } = useSelector((state: any) => state.classes)

  useEffect(() => {
        setActiveStudentsCount(0)
        if(studentsData.length) {
            let aCount = 0
            for(let student of studentsData) {
                if(student.status == 'active') {
                    aCount = aCount + 1
                    
                }
            }
            setActiveStudentsCount(aCount)
            setTotalStudentsCount(studentsData.length)
        } else {
            setActiveStudentsCount(0)
            setTotalStudentsCount(0)
        }
        console.log("liveClass")
        console.log(liveClass)
    }, [studentsData])
  
  return (
    <View style={styles.headerContainer}>
        <View>
            <Text>{((liveClass && liveClass.division_name) ? liveClass.division_name : 'VII - 8 ') + " - " + ((liveClass && liveClass.subject_name) ? liveClass.subject_name : 'Physics')}</Text>
        </View>
        <View>
            <Text>Students {`${activeStudentsCount} / ${totalStudentsCount}`}</Text>
        </View>
        
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: { 
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 25
     },
});

export default LiveMonitorHeader;

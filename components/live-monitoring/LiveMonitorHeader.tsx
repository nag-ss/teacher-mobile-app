import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View , Text, TouchableOpacity, Image} from 'react-native';
import TaskSection from '@/components/live-monitoring/TaskSection';
import StudentGrid from '@/components/live-monitoring/StudentGrid';
import AICheckSummary from '@/components/live-monitoring/AICheckSummary';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const LiveMonitorHeader = () => {
    const dispatch = useDispatch<any>()
    const [activeStudentsCount, setActiveStudentsCount] = useState(0)
    const [totalStudentsCount, setTotalStudentsCount] = useState(0)

    const { studentsCountData } = useSelector((state: any) => state.liveMonitor)
    const { liveClass } = useSelector((state: any) => state.classes)
    const navigation = useNavigation<any>()
    useEffect(() => {
            setActiveStudentsCount(0)
            if(studentsCountData.length) {
                let aCount = 0
                for(let student of studentsCountData) {
                    if(student.status == 'active') {
                        aCount = aCount + 1
                        
                    }
                }
                setActiveStudentsCount(aCount)
                setTotalStudentsCount(studentsCountData.length)
            } else {
                setActiveStudentsCount(0)
                setTotalStudentsCount(0)
            }
        }, [studentsCountData])
    const gotoHome = () => {
        navigation.navigate('Home')
    }
  return (
    <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={gotoHome} style={{marginTop: 8}}>
                <Image style={{width: 12, height: 12, marginTop: 0, marginRight: 10}} source={require('../../assets/images/ss/left-arrow.png')} />
            </TouchableOpacity>
            <Text style={{fontWeight: '600', fontSize: 18.28}}>{((liveClass && liveClass.division_name) ? liveClass.division_name : 'VII - 8 ') + " - " + ((liveClass && liveClass.subject_name) ? liveClass.subject_name : 'Physics')}</Text>
        </View>
        <View>
            <Text>Students {`${activeStudentsCount} / ${totalStudentsCount}`}</Text>
        </View>
        
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: { 
        backgroundColor: '#fff',
        borderRadius: 10, 
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingRight: 25,
        padding: 13.7,
        height: 64,
        alignItems: 'center',
        marginTop: 13.7

     },
});

export default LiveMonitorHeader;

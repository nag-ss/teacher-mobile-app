import React from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView, Text } from 'react-native';
import LiveClassCard from '@/components/dashboard/LiveClassCard';
import Timeline from '@/components/dashboard/Timeline';
import ClassProgress from '@/components/dashboard/ClassProgress';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ImportantAlerts from '@/components/dashboard/ImportantAlerts';
import QuickActions from '@/components/dashboard/QuickActions';
import UpcomingTopics from '@/components/dashboard/UpcomingTopics';
import CompletedTopics from '@/components/dashboard/CompletedTopics';

const DashboardScreen = () => {
  return (
    <SafeAreaView style={{}}>
        <View style={{flexDirection: 'column', height: '100%'}}>
            <View style={styles.container}>
                <View style={styles.leftColumn}>
                    <LiveClassCard />
                    <Timeline />
                </View>

                <View style={styles.rightColumn}>
                    <ClassProgress />
                    <UpcomingTopics />
                    <CompletedTopics />
                    <RecentActivity />
                    <ImportantAlerts />
                </View>
            </View>
            <View style={{}}>
                <QuickActions />
            </View>
        </View>
        
      

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
    // backgroundColor: 'yellow',
    // height: '90%'

  },
  leftColumn: {
    flex: 0.6,
    marginRight: 8,
  },
  rightColumn: {
    flex: 0.4,
    marginLeft: 8,
    backgroundColor: '#fff'
  }
});

export default DashboardScreen;

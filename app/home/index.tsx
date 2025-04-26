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
                    <View style={styles.liveCardContainer}>
                        <Text style={styles.title}>Welcome Ankit Sharma</Text>
                        <Text style={styles.subTitle}>"Inspire minds, shape futures — let’s make today a great day of learning.!"</Text>
                        <LiveClassCard />
                    </View>
                    
                    <Timeline />
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.classProgressContainer}>
                        <ClassProgress />
                        <UpcomingTopics />
                        <CompletedTopics />
                    </View>
                    
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
    // backgroundColor: '#fff'
  },
  liveCardContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subTitle: {
    marginTop: 12,
    // fontWeight: '600',
  },
  classProgressContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
  }
});

export default DashboardScreen;

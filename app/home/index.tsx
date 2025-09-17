import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import LiveClassCard from '@/components/dashboard/LiveClassCard';
import Timeline from '@/components/dashboard/Timeline';
import ClassProgress from '@/components/dashboard/ClassProgress';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ImportantAlerts from '@/components/dashboard/ImportantAlerts';
import QuickActions from '@/components/dashboard/QuickActions';
import UpcomingTopics from '@/components/dashboard/UpcomingTopics';
import CompletedTopics from '@/components/dashboard/CompletedTopics';
import { useSelector } from 'react-redux';
import PerformanceSummary from '@/components/dashboard/PerformanceSummary';
import TeacherTodos from '@/components/dashboard/Todos';
import { MaterialIcons } from '@expo/vector-icons'; // For icons




const DashboardScreen = () => {
    
    const {user} = useSelector((state: any) => state.user)
    const [expanded, setExpanded] = useState(false);
    const actions = [
      { label: 'Upload Materials', icon: 'file-upload' },
      { label: 'Assignment Generator', icon: 'assignment' },
      { label: 'Auto Test Generator', icon: 'quiz' }
    ];
  return (
    <SafeAreaView style={{}}>
        <View style={{flexDirection: 'row', justifyContent:'space-between', backgroundColor: '#fff', marginLeft: 10, height: 60, borderRadius: 10}}>
          <Text style={{padding: 10, fontWeight: '600', fontSize: 24}}>{user.school_name}</Text>
          <View style={{flexDirection: 'row', marginRight: 20}}>
            <Image  style={[{width: 40, height: 40}]} source={require('../../assets/images/ss/search.png')} />
            <Image  style={[{width: 40, height: 40}]} source={require('../../assets/images/ss/Notification.png')} />
          </View>
        </View>
        <View style={{flexDirection: 'column', height: '100%'}}>
            <View style={styles.container}>
                <View style={styles.leftColumn}>
                    <View style={styles.liveCardContainer}>
                        <Text style={styles.title}>Welcome {`${user.first_name} ${user.last_name}`}</Text>
                        <Text style={styles.subTitle}>"Inspire minds, shape futures — let’s make today a great day of learning.!"</Text>
                        <LiveClassCard />
                    </View>
                    
                    <Timeline />
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.classProgressContainer}>
                        <ClassProgress />
                        <UpcomingTopics />
                        {/* <CompletedTopics /> */}
                    </View>
                    
                    {/* <RecentActivity /> */}
                    
                    <PerformanceSummary />
                    <TeacherTodos />
                    <ImportantAlerts />
                </View>
            </View>
            {/* <View style={{padding: 10}}>
                <QuickActions />
            </View> */}
            <View  style={styles.actionsContainer}>
              {expanded && actions.map((action: any, idx) => (
                <View key={action.label} style={styles.menuRow}>
                  <View style={styles.menuCard}>
                    <Text style={styles.menuLabel}>{action.label}</Text>
                  </View>
                  <View style={styles.menuIcon}>
                    <MaterialIcons name={action.icon} size={24} color="#444" />
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.7}
                onPress={() => setExpanded(!expanded)}
              >
                <MaterialIcons name="add" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
        </View>
        
      

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
    // backgroundColor: 'yellow',
    height: '90%'

  },
  leftColumn: {
    flex: 0.6,
    marginRight: 8,
  },
  rightColumn: {
    flex: 0.4,
    marginLeft: 5,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10
  },
  liveCardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    // marginBottom: 5,
  },
  subTitle: {
    marginTop: 10,
    // fontWeight: '600',
  },
  classProgressContainer: {
    backgroundColor: '#fff',
    padding: 15,
    // paddingBottom: 5,
    // marginVertical: 10,
    borderRadius: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    marginBottom: 5
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    alignItems: 'flex-end',
    zIndex: 99,
  },
  fab: {
    backgroundColor: "#20C997",
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.20,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 }
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: "center",
    marginBottom: 18,
  },
  menuCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginRight: 10,
  },
  menuLabel: {
    fontSize: 15,
    color: "#222"
  },
  menuIcon: {
    backgroundColor: "#fff",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }
  }
});

export default DashboardScreen;

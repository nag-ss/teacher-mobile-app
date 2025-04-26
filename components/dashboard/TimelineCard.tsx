import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { Badge } from 'react-native-elements'; // For "Live" badge
import SvgLoader from '@/utils/SvgLoader';


const TimelineCard = ({idx, item, height}: any) => {
  return (
    <View key={idx} style={[styles.classCard, {height: height*50, marginBottom:20}]}>
        <View style={[styles.classHeader]}>
            <SvgLoader svgFilePath="chemistry" width={height == 1 ? 50 : 70} height={height == 1 ? 50 :70}  />
            <View style={{marginLeft: 10, flexDirection: height == 1 ? 'row' : 'column', justifyContent: 'space-between'}}>
                <Text style={styles.classTime}>{item.time}</Text>
                <Text style={styles.classSubject}>{item.subject}</Text>
                <Text style={styles.classCategory}>{item.category}</Text>
            </View>
            
        </View>
        {item.live && (
            <Badge status="error" containerStyle={styles.liveBadge} />
        )}
    </View>
    
  );
};

const styles = StyleSheet.create({
  classCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
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
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
});

export default TimelineCard;

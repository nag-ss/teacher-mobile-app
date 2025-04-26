import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button, Badge } from 'react-native-elements';  // Import components from react-native-elements
import { MaterialIcons } from '@expo/vector-icons'; // For the "Live" icon
import SvgLoader from '@/utils/SvgLoader';

const LiveSessionCard = () => {
  return (
    <View style={styles.cardContainer}>
      {/* Image and Text */}
      <View style={styles.sessionDetails}>
        <SvgLoader svgFilePath="liveclass" width={200} height={200} style={styles.sessionImage}  />
        <View style={styles.textContainer}>
          <Text style={styles.time}>09:00 AM - 10:00 AM</Text>
          <View>
            <Text style={styles.subject}>Trigonometry</Text>
            <Text style={styles.category}>Mathematics</Text>
          </View>
          
          {/* Join Button */}
          <Button
            title="Join now"
            buttonStyle={styles.joinButton}
            titleStyle={styles.buttonTitle}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 1,
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
  },
  sessionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 15,
    // backgroundColor: 'red',
    justifyContent: 'space-between'
  },
  time: {
    fontSize: 14,
    color: '#555',
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  category: {
    fontSize: 14,
    color: '#888',
  },
  joinButton: {
    backgroundColor: '#21C17C',
    borderRadius: 8,
    marginTop: 15,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LiveSessionCard;

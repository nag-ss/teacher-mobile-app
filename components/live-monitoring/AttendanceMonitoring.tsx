import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface AITaskCardProps {
  title: string;
  actionText: string;
  onPress: () => void;
}

const AttendanceMonitoring = () => {
    const onPress = () => {

    }
    return (
        <View style={[styles.card, {opacity: 0.4}]}>
            <View style={styles.imageSection}>
                <Image style={{width: 40, height: 40}} source={require('../../assets/images/ss/MileStone.png')} />
            </View>
            
            <Text style={styles.title}>{'Attendance Monitoring'}</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{'Check'}</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    // marginHorizontal: 8,
    marginRight: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    // alignItems: 'center',
    // elevation: 2,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  icon: { fontSize: 24 },
  title: { fontSize: 14, fontWeight: '600', marginVertical: 10, height: 40 },
  button: {
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    width: 100,
    alignItems: 'center'
  },
  buttonText: { fontWeight: '600' },
  imageSection: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 5,
    width: 50
  }
});

export default AttendanceMonitoring;

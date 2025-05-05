import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Button } from 'react-native-elements';

const QuickActions = () => (
    <View style={styles.container}>
        <Text style={{paddingTop: 10, fontWeight: 'bold', fontSize: 16}}>Quick Actions</Text>
        <View style={styles.cardsContainer}>
            <View style={styles.card}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={{width: 20, height: 20, marginRight: 5}} source={require('../../assets/images/ss/Icons-test.png')} />
                    <Text style={styles.title}>Auto Test Generator</Text>
                </View>
                
                <Text style={styles.subTitle}>Quickly create customized tests based on grade and topic.</Text>
                <Button title="Create" buttonStyle={styles.button} titleStyle={styles.buttonTitle} onPress={() => {}} />
            </View>
            <View style={styles.card}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={{width: 20, height: 20, marginRight: 5}} source={require('../../assets/images/ss/Icons-assignment.png')} />
                    <Text style={styles.title}>Assignment Generator</Text>
                </View>
                
                <Text style={styles.subTitle}>Quickly create customized tests based on grade and topic.</Text>
                <Button title="Create" buttonStyle={styles.button} titleStyle={styles.buttonTitle} onPress={() => {}} />
            </View>
            <View style={styles.card}>
                <View style={{flexDirection: 'row'}}>
                    <Image style={{width: 20, height: 20, marginRight: 5}} source={require('../../assets/images/ss/Icons-upload.png')} />
                    <Text style={styles.title}>Upload Materials</Text>
                </View>
                <Text style={styles.subTitle}>Add notes, Assignments,  materials to share with students.</Text>
                <Button title="Upload" buttonStyle={styles.button} titleStyle={styles.buttonTitle} onPress={() => {}} />
            </View>
        </View>
    </View>
  
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginBottom: 5,
        borderRadius: 10,
        // padding
    },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 10,
    padding: 16,
    // paddingBottom: 5,
    // backgroundColor: 'red'
  },
  card: {
    // flex: 1,
    // backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    width: '31%'

  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 10,
    height: 40
  },
  button: {
    // backgroundColor: Colors.primaryColor
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 5
  },
  buttonTitle: {
    color: 'black'
  }
});

export default QuickActions;

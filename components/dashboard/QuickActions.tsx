import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Colors } from '@/constants/Colors';

const QuickActions = () => (
  <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Auto Test Generator</Text>
      <Text>Quickly create customized tests.</Text>
      <Button title="Create" color={Colors.primaryColor} onPress={() => {}} />
    </View>
    <View style={styles.card}>
      <Text style={styles.title}>Assignment Generator</Text>
      <Text>Customized assignments by grade/topic.</Text>
      <Button title="Create" color={Colors.primaryColor} onPress={() => {}} />
    </View>
    <View style={styles.card}>
      <Text style={styles.title}>Upload Materials</Text>
      <Text>Share notes, assignments, etc.</Text>
      <Button title="Create" color={Colors.primaryColor} onPress={() => {}} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 16
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  button: {
    backgroundColor: Colors.primaryColor
  }
});

export default QuickActions;

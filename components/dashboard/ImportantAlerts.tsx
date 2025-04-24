import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const alerts = [
  "Low engagement rate - Only 60% took notes",
  "Pending Quiz Evaluation - 5 students",
  "Student at Risk - Scored <50% in last 3 quizzes"
];

const ImportantAlerts = () => (
  <View style={styles.card}>
    <Text style={styles.title}>Important Alerts</Text>
    {alerts.map((alert, index) => (
      <Text key={index} style={[styles.text, index === 0 && styles.red]}>
        • {alert}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    marginBottom: 4,
  },
  red: {
    color: 'red',
  }
});

export default ImportantAlerts;

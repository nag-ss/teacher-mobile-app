import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface MetricsCardProps {
  title: string;
  value: string;
  description: string;
  icon?: any;
}

const MetricsCard = ({ title, value, description, icon }: MetricsCardProps) => {
  return (
    <View style={styles.card}>
        <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>{description}</Text>
        </View>
        <View style={styles.contentValue}>
            <Text style={styles.value}>{value}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    minWidth: 200,
    // maxWidth: 200,
    elevation: 2,
    margin: 6,
    // width: 200
  },
  icon: { width: 24, height: 24, marginBottom: 6 },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  value: { fontSize: 18, fontWeight: 'bold', color: '#228B22' },
  desc: { fontSize: 10, color: '#555' },
  contentValue: {
    flex: 0.2,
    alignItems: 'center'
  },
  content: {
    flex: 0.8
  }
});

export default MetricsCard;

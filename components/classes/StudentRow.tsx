import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StudentRowProps {
  index: number;
  name: string;
  grade: string;
  progress: string;
  attendance: string;
  engagement: string;
  quiz: string;
}

const StudentRow = ({ index, name, grade, progress, attendance, engagement, quiz }: StudentRowProps) => {
  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{index.toString().padStart(2, '0')}</Text>
      <Text style={[styles.cell, styles.bold]}>{name}</Text>
      <Text style={styles.cell}>{grade}</Text>
      <Text style={styles.cell}>{progress}</Text>
      <Text style={styles.cell}>{attendance}</Text>
      <Text style={styles.cell}>{engagement}</Text>
      <Text style={styles.cell}>{quiz}</Text>
      <Text style={styles.cell}>➡️</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cell: { flex: 1, fontSize: 14, textAlign: 'center' },
  bold: { fontWeight: 'bold' },
});

export default StudentRow;

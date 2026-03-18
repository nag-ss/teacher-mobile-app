import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const QuizCardOutline = () => {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.arrowBtn} activeOpacity={0.7}>
        <MaterialIcons name="chevron-left" size={22} color="#111827" />
      </TouchableOpacity>

      <View style={styles.cards}>
        <View style={styles.card} />
        <View style={styles.card} />
        <View style={styles.card} />
      </View>

      <TouchableOpacity style={styles.arrowBtn} activeOpacity={0.7}>
        <MaterialIcons name="chevron-right" size={22} color="#111827" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cards: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 14,
  },
  card: {
    flex: 1,
    height: 260,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
});

export default QuizCardOutline;


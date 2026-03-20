import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const InsightsCard = () => {
  return (
    <View style={styles.wrap}>
      <View style={styles.boxLeft} />
      <View style={styles.boxRight}>
        <Text style={styles.rightTitle}>Behavior Highlights</Text>

        <View style={styles.itemRow}>
          <View style={styles.iconWrap}>
            <Image source={require('@/assets/images/ss/check.png')} style={styles.iconImg} />
          </View>
          <Text style={styles.itemText}>5 students consistently participate.</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.iconWrap}>
            <Image source={require('@/assets/images/arrow_circle_up.png')} style={styles.iconImg} />
          </View>
          <Text style={styles.itemText}>4 students improved their test scores.</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.iconWrap}>
            <Image source={require('@/assets/images/arrow_circle_down.png')} style={styles.iconImg} />
          </View>
          <Text style={styles.itemText}>3 students frequently miss deadlines.</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.iconWrap}>
            <Image source={require('@/assets/images/warning.png')} style={styles.iconImg} />
          </View>
          <Text style={styles.itemText}>2 students failed to submit last quiz.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12

  },
  boxLeft: {
    flex: 1,
    minHeight: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  boxRight: {
    flex: 1,
    minHeight: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    padding: 16,
  },
  rightTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    marginBottom: 0,
    color: '#111827',
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical:8,
  },
  itemText: {
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#111827',
  },
  tickOnly: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});

export default InsightsCard;


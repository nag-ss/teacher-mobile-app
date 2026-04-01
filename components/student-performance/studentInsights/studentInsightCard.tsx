import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const StudentInsightCard = () => {
  return (
    <View style={styles.siWrap}>
      <View style={styles.siBoxLeft} />
      <View style={styles.siBoxRight}>
        <Text style={styles.siSectionTitle}>Behavior Highlights</Text>

        <View style={styles.siItemRow}>
          <View style={styles.siIconWrap}>
            <Image source={require('@/assets/images/ss/check.png')} style={styles.siIconImg} />
          </View>
          <Text style={styles.siItemText}>Consistently participates in discussions.</Text>
        </View>

        <View style={styles.siItemRow}>
          <View style={styles.siIconWrap}>
            <Image source={require('@/assets/images/warning.png')} style={styles.siIconImg} />
          </View>
          <Text style={styles.siItemText}>Frequently submits assignments late.</Text>
        </View>

        <View style={styles.siItemRow}>
          <View style={styles.siIconWrap}>
            <Image source={require('@/assets/images/arrow_circle_down.png')} style={styles.siIconImg} />
          </View>
          <Text style={styles.siItemText}>Rarely interacts with quizzes & assignments.</Text>
        </View>

        <View style={styles.siItemRow}>
          <View style={styles.siIconWrap}>
            <Image source={require('@/assets/images/star_rate.png')} style={styles.siIconImg} />
          </View>
          <Text style={styles.siItemText}>Scores above 90% in tests consistently.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  siWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12

  },
  siBoxLeft: {
    flex: 1,
    minHeight: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  siBoxRight: {
    flex: 1,
    minHeight: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    padding: 16,
  },
  siSectionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    marginBottom: 0,
    color: '#111827',
    paddingBottom: 8,
  },
  siItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical:8,
  },
  siItemText: {
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: '#111827',
  },
  siIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  siIconImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});

export default StudentInsightCard;

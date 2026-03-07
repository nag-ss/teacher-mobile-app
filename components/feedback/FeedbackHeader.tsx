import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export function FeedbackHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Feedback Session</Text>
      <View style={styles.headerIcons}>
        <View style={styles.iconButton}>
          <Image
            style={styles.headerIcon}
            source={require('../../assets/images/ss/search.png')}
          />
        </View>
        <View style={styles.iconButton}>
          <Image
            style={styles.headerIcon}
            source={require('../../assets/images/ss/Notification.png')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 64,
    borderRadius: 10,
    paddingHorizontal: 14,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: '#222',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  headerIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
});

import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const ProfileImage = () => {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require('@/assets/images/ss/profile.png')}
        style={styles.image}
      />
      <TouchableOpacity style={styles.editButton}>
        <Image
          source={require('@/assets/images/ss/edit.png')}
          style={{ width: 16, height: 16 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 16,
    elevation: 2,
  },
});

export default ProfileImage;

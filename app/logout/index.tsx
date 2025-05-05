import { logout } from '@/store/authSlice';
import SvgLoader from '@/utils/SvgLoader';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

const Logout = () => {
    const dispatch = useDispatch<any>()
    useEffect(() => {
        dispatch(logout())
    }, [])
  return (
    <View style={styles.container}>
      <Text>Coming Soon ...!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f4',
    }
  });
export default Logout;

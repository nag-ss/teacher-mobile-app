import LogoutConfirmModal from '@/components/Modals/LogoutConfirmModal';
import { logout } from '@/store/authSlice';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

const Logout = () => {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <LogoutConfirmModal
        visible
        onCancel={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Home');
          }
        }}
        onConfirm={() => dispatch(logout())}
      />
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

import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const Login = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftPanel}>
        <View style={styles.logoCircle}>
        <SvgLoader
            svgFilePath='logo' // Replace with your own logo
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Super Slatee</Text>
      </View>

      <View style={styles.rightPanel}>
        <View style={styles.card}>
          <Text style={styles.signInTitle}>Sign In</Text>

          <Text style={styles.label}>User name</Text>
          <TextInput style={styles.input} placeholder="test@test.com" />

          <Text style={styles.label}>password</Text>
          <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: width > 768 ? 'row' : 'column',
      backgroundColor: '#f4f4f4',
    },
    leftPanel: {
      flex: 1,
      backgroundColor: '#5AB87A',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
      borderRadius: width > 768 ? 20 : 0,
    },
    logoCircle: {
      backgroundColor: '#1e1e1e',
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 80,
      height: 80,
    },
    appName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#000',
    },
    rightPanel: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    card: {
      backgroundColor: '#fff',
      width: '100%',
      maxWidth: 360,
      padding: 20,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    signInTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    label: {
      fontSize: 12,
      color: '#333',
      marginBottom: 4,
      marginTop: 12,
    },
    input: {
      backgroundColor: '#f1f1f1',
      padding: 10,
      borderRadius: 6,
      fontSize: 14,
    },
    button: {
      backgroundColor: '#5AB87A',
      padding: 12,
      marginTop: 20,
      borderRadius: 6,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });
export default Login;

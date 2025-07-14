import { userDetails, userLogin } from '@/store/authSlice';
import SvgLoader from '@/utils/SvgLoader';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const Login = () => {
    const dispatch = useDispatch<any>()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const { userToken, error } = useSelector((state: any) => state.user)

    const loginAction = async () => {
        const loginReqObj: any = {
            grant_type: 'password',
            username,
            password
        }
        await dispatch(userLogin(loginReqObj))
    }

    const getTeacherDetails = async () => {
        await dispatch(userDetails(userToken))
    }

    useEffect(() => {
        if(userToken) {
            getTeacherDetails()
        }
    }, [userToken])
  return (
    <View style={styles.container}>
      <View style={styles.leftPanel}>
        <View style={styles.logoCircle}>
        {/* <SvgLoader
            svgFilePath='logo' // Replace with your own logo
            style={styles.logo}
            resizeMode="contain"
          /> */}
            {/* <Image style={{width: 34, height: 64}} source={require('@/assets/images/ss/s-logo.png')} /> */}
            <Image style={{width: 250, height: 250}} source={require('@/assets/images/ss/Logo_F2.png')} />
        </View>
        <Text style={styles.appName}>Super Slate</Text>
      </View>

      <View style={styles.rightPanel}>
        <View style={styles.card}>
          {/* <Text style={styles.signInTitle}>Sign In</Text> */}

          {
            error ?
            <View>
              <Text style={styles.errorMsg}>{error}</Text>
          </View> : null
          }
          
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} placeholder="test@test.com" onChangeText={(uname) => setUsername(uname)} />

          <Text style={styles.label}>Password</Text>
          {/* <TextInput
            style={styles.input}
            placeholder="password"
            secureTextEntry
            onChangeText={(uname) => setPassword(uname)}
          /> */}
          <View style={styles.passContainer}>
            <TextInput
              style={styles.pinput}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconContainer}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => loginAction()}>
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
      // backgroundColor: '#1e1e1e',
      width: 250,
      height: 250,
      borderRadius: 150,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 80,
      height: 80,
    },
    appName: {
      fontSize: 30,
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
    passContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      alignItems: 'center',
      paddingHorizontal: 10,
      marginVertical: 12,
    },
    pinput: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 16,
    },
    iconContainer: {
      paddingLeft: 8,
      paddingVertical: 10,
    },
    errorMsg: {
      color: 'red'
    }
  });
export default Login;

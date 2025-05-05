import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://localhost:3002/api/';
const API_URL = 'https://superslate-ss.onrender.com/';

const getHeaders = (token: string | null, isFile: boolean) => {
  let headers: any = {
    // 'Content-Type': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'accept': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if(isFile) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  // console.log("headers")
  // console.log(headers)
  return headers;
};

const apiRequest = async (endpoint: string, method: string, data: any, token: string | null = null, isFile: boolean = false) => {
  // const navigation = useNavigation<any>(); 
  
  
  console.log("welcome ")
  try {
    console.log(`${API_URL}${endpoint}`)
    console.log(data)
    console.log(method)
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method,
      data,
      headers: getHeaders(token, isFile),
    });
    console.log("response.data")
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.log("error in api page" )
    console.log(error.response)
    console.log(error.response.status)
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Unauthorized, navigating to login screen");
        // await AsyncStorage.removeItem('user');
        // await AsyncStorage.removeItem('userToken');
        // navigation.navigate('Home'); // Navigate to the Login screen
      }
      // Request made and server responded
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
  }
};

export default apiRequest;

import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_LOGIN } from '../utils/apiRoutes'
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

// const API_URL = 'http://localhost:3002/api/';
const API_URL = 'https://superslate-ss.onrender.com/';

const getHeaders = (token: string | null, isFile: boolean, endpoint: string) => {
  let headers: any = {
    'Content-Type': endpoint == USER_LOGIN ? 'application/x-www-form-urlencoded' : 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // 'accept': 'application/json'
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

const refreshToken = async () => {
  try {
    const refreshToken = AsyncStorage.getItem('userRefreshToken')
    const response = await axios.post(`${API_URL}auth/refresh`, {refresh_token: refreshToken}, { withCredentials: true });
    return response.data;
  } catch (err) {
    throw new Error('Session expired. Please login again.');
  }
};

const apiRequest = async (endpoint: string, method: string, data: any, token: string | null = null, isFile: boolean = false, retry: boolean = true) => {
  // const navigation = useNavigation<any>(); 
  // const dispatch = useDispatch<any>()
  
  
  console.log("welcome ")
  try {
    console.log(`${API_URL}${endpoint}`)
    console.log(data)
    console.log(method)
    console.log(token)
    console.log(getHeaders(token, isFile, endpoint))
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method,
      data,
      headers: getHeaders(token, isFile, endpoint),
    });
    console.log("response.data")
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.log("error in api page" )
    console.log(`${API_URL}${endpoint}`)
    console.log(error.response)
    console.log(error.response.status)
    if (error.response?.status === 401 && retry) {
      try {
        console.log("calling refresh token ")
        const newTokenData = await refreshToken();

        // Save new token to storage (adjust as needed)
        AsyncStorage.setItem('userToken', newTokenData.access_token);
        AsyncStorage.setItem('userRefreshToken', newTokenData.refresh_token);

        // Retry original request with new token
        return await apiRequest(endpoint, method, data, newTokenData.access_token, isFile, false);
      } catch (refreshErr) {
        throw refreshErr;
      }
    }
    if (error.response) {
      
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

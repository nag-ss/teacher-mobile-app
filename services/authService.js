import apiRequest from '../utils/api';
import { SEND_OTP, VERIFY_OTP, USER_DETAILS, USER_LOGIN, GET_USER_LOGIN, GET_USER_NOTIFICATIONS, VIEW_USER_NOTIFICATION, CHECK_USER, GET_USER_TOKEN } from '../utils/apiRoutes'

const register = async (userData) => {
  return await apiRequest('register', 'POST', userData);
};

const login = async (userData) => {
  return await apiRequest('login', 'POST', userData);
};

const sendOtp = async (userData) => {
    console.log("calling send otp api ....")
  return await apiRequest(SEND_OTP, 'POST', userData);
};

const checkUser = async (userData) => {
  return await apiRequest(CHECK_USER, 'POST', userData);
};

const verifyOtp = async (userData) => {
  return await apiRequest(VERIFY_OTP, 'POST', userData);
};

const getUserData = async (token) => {
  return await apiRequest('user', 'GET', null, token);
};

const userDetails = async (userData) => {
    return await apiRequest(USER_DETAILS, 'POST', userData);
  };

const userLogin  = async (userData) => {
    return await apiRequest(USER_LOGIN, 'POST', userData, null, true);
};

const getTodayUserLogin  = async (userData) => {
    return await apiRequest(GET_USER_LOGIN, 'POST', userData);
};

const getNotifications  = async (userData) => {
  return await apiRequest(GET_USER_NOTIFICATIONS, 'POST', userData);
};

const viewNotification  = async (userData) => {
  return await apiRequest(VIEW_USER_NOTIFICATION, 'POST', userData);
};

const getUserToken  = async (userData) => {
  return await apiRequest(GET_USER_TOKEN, 'POST', userData);
};




const authService = {
  register,
  login,
  getUserData,
  sendOtp,
  verifyOtp,
  userDetails,
  userLogin,
  getTodayUserLogin,
  getNotifications,
  viewNotification,
  checkUser,
  getUserToken
};

export default authService;

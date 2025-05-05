import apiRequest from '../utils/api';
import { USER_LOGIN, USER_DETAILS } from '../utils/apiRoutes'

const login = async (userData: any) => {
  console.log("calling login ...")
  console.log(userData)
  return await apiRequest(USER_LOGIN, 'POST', userData);
};

const userDetails = async (userToken: string | null) => {
  return await apiRequest(USER_DETAILS, 'GET', {}, userToken);
};

const authService = {
  login,
  userDetails
};

export default authService;

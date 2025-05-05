import AsyncStorage from "@react-native-async-storage/async-storage";

export const handleAuthApiCall = async (apiCall: any, user: any, thunkAPI: any) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // const userToken = null;
      const response = await apiCall(user, userToken);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  };
  
export const handleAuthApiCall = async (apiCall, user, thunkAPI) => {
    try {
    //   const userToken = localStorage.getItem('userToken');
      const userToken = null;
      const response = await apiCall(user, userToken);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  };
  
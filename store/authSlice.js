import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from '../services/authService';
import { handleAuthApiCall } from '../utils/apiUtils';

export const checkLoginStatus = createAsyncThunk('auth/checkLoginStatus', async () => {
    try {
      // Get token from AsyncStorage
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      const userToken = await AsyncStorage.getItem('userToken');
      return user
    } catch (error) {
      console.error('Error checking login status:', error);
      return null;
    }
  });


export const userDetails = createAsyncThunk('auth/userDetails', async (user, thunkAPI) => {
return handleAuthApiCall(authService.userDetails, user, thunkAPI);
});

export const userLogin = createAsyncThunk('auth/userLogin', async (user, thunkAPI) => {
    return handleAuthApiCall(authService.userLogin, user, thunkAPI);
});
  
const userSlice = createSlice({
    name: 'user',
    initialState: {
      user:  null,
      isAuthenticated: false,
      loading: false,
      error: null,
      mobileNumber: null,
      userToken: null,
      todayLoginData: null,
      notiCount: 0,
      notifications: null
    },
    reducers: {
      logout: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.userToken = null;
        state.mobileNumber = null;
        AsyncStorage.removeItem('user');
        AsyncStorage.removeItem('userToken');
      },
      login: (state) => {
        state.isAuthenticated = true
      },
      setMobileNumber: (state, action) => {
        state.mobileNumber = action.payload.mobile
      }
    },
    extraReducers: (builder) => {
        builder
        .addCase(checkLoginStatus.pending, (state) => {
            state.loading = true;
        })
        .addCase(checkLoginStatus.fulfilled, (state, action) => {
            state.isAuthenticated = action.payload ? true : false;
            state.user = action.payload;
            state.loading = false;
        })
        .addCase(userDetails.pending, (state, action) => {
            state.loading = true
          })
        .addCase(userDetails.fulfilled, (state, action) => {
            console.log(action.payload)
            if(action.payload.success) {

                state.loading = false
                // state.userToken = action.payload.access_token
                state.user = action.payload.data
                state.isAuthenticated = true
                console.log("am inside ac")
                // await AsyncStorage.setItem('userToken', action.payload.access_token)
                AsyncStorage.setItem('user', JSON.stringify(action.payload.data))
            } else {
                state.loading = false
            }
        })
        .addCase(userDetails.rejected, (state, action) => {
        state.loading = false
        })
    },
});
  
export const { logout, setMobileNumber, login } = userSlice.actions;
  
export default userSlice.reducer;
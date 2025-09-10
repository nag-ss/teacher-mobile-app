import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from '../services/authService';
import { handleAuthApiCall } from '../utils/apiUtils';

export const checkLoginStatus = createAsyncThunk('auth/checkLoginStatus', async () => {
    try {
      // Get token from AsyncStorage
      // const user = JSON.parse(await AsyncStorage.getItem('user'));
      const userJson = await AsyncStorage.getItem('user');
      const userToken = await AsyncStorage.getItem('userToken');
      const userRToken = await AsyncStorage.getItem('userRefreshToken');
    
      console.log("****************************************")
      console.log(userJson)
      console.log(userToken)
      console.log(userRToken)
      if (userJson) {
        return JSON.parse(userJson)
      }
      
    } catch (error) {
      console.error('Error checking login status:', error);
      return null;
    }
  });


export const userDetails = createAsyncThunk('auth/userDetails', async (userToken, thunkAPI) => {
  return handleAuthApiCall(authService.userDetails, userToken, thunkAPI);
});

export const userLogin = createAsyncThunk<any>('auth/userLogin', async (user, thunkAPI) => {
  console.log("user")
  console.log(user)
    return handleAuthApiCall(authService.login, user, thunkAPI);
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
        console.log("calling login dis .....")
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
        .addCase(userLogin.pending, (state, action) => {
          state.loading = true
          state.error = null
          console.log("calling login api")
        })
      .addCase(userLogin.fulfilled, (state, action) => {
          console.log("login action.payload ....")
          console.log(action.payload)
          state.userToken = action.payload.access_token
          AsyncStorage.setItem('userToken', action.payload.access_token);
          AsyncStorage.setItem('userRefreshToken', action.payload.refresh_token);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false
        console.log("error login api ")
        console.log(action.payload)
        const msg: any = "Username or Password is wrong"
        state.error = msg
      })
        .addCase(userDetails.pending, (state, action) => {
            state.loading = true
          })
        .addCase(userDetails.fulfilled, (state, action) => {
            console.log(action.payload)
            if(action.payload) {

                state.loading = false
                // state.userToken = action.payload.access_token
                state.user = action.payload
                state.isAuthenticated = true
                console.log("am inside ac")
                // await AsyncStorage.setItem('userToken', action.payload.access_token)
                AsyncStorage.setItem('user', JSON.stringify(action.payload))
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
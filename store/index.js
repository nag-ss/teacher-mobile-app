import { configureStore } from '@reduxjs/toolkit';
import userReducer from './authSlice';
import classReducer from './classSlice';
import liveMonitorReducer from './liveMonitoringSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    classes: classReducer,
    liveMonitor: liveMonitorReducer
  },
});

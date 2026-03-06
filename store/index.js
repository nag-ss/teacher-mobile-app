import { configureStore } from '@reduxjs/toolkit';
import userReducer from './authSlice';
import classReducer from './classSlice';
import liveMonitorReducer from './liveMonitoringSlice';
import feedbackReducer from './feedbackSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    classes: classReducer,
    liveMonitor: liveMonitorReducer,
    feedback: feedbackReducer,
  },
});

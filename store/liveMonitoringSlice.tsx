import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import liveMonitoringService from '../services/liveMonitoringService';
import { handleAuthApiCall } from '../utils/apiUtils';

export const getAttendance = createAsyncThunk('livemonitoring/getAttendance', async (reqData, thunkAPI) => {
  return handleAuthApiCall(liveMonitoringService.getAttendance, reqData, thunkAPI);
});

export const getAITaskCheckResults = createAsyncThunk('livemonitoring/getAITaskCheckResults', async (reqData, thunkAPI) => {
    return handleAuthApiCall(liveMonitoringService.getAITaskCheckResults, reqData, thunkAPI);
});

export const getClassworkResults = createAsyncThunk('livemonitoring/getClassworkResults', async (reqData, thunkAPI) => {
    return handleAuthApiCall(liveMonitoringService.getClassworkResults, reqData, thunkAPI);
});

export const getSlipTestResults = createAsyncThunk('livemonitoring/getSlipTestResults', async (reqData, thunkAPI) => {
    return handleAuthApiCall(liveMonitoringService.getSlipTestResults, reqData, thunkAPI);
});

export const getSlipTestPerformance = createAsyncThunk('livemonitoring/getSlipTestPerformance', async (reqData, thunkAPI) => {
    return handleAuthApiCall(liveMonitoringService.getSlipTestPerformance, reqData, thunkAPI);
});

export const getClassWorkPerformance = createAsyncThunk('livemonitoring/getClassWorkPerformance', async (reqData, thunkAPI) => {
    return handleAuthApiCall(liveMonitoringService.getClassWorkPerformance, reqData, thunkAPI);
});

const liveMonitoringSlice = createSlice({
    name: 'liveMonitoring',
    initialState: {
      selectedTaskSection: '',
      selectedTask: null,
      selectedTaskId: '',
      studentsData: [],
      loading: false,
      error: null,
      classId: 0,
      studentPerformance: null,
      studentCWPerformance: null,
    },
    reducers: {
        setSelectedTask: (state, action) => {
            state.selectedTaskSection = action.payload
        },
        setSelectedTaskId: (state, action) => {
            state.selectedTaskId = action.payload
        },
        setClassId: (state, action) => {
            state.classId = action.payload
        },
        setSelectedTaskData: (state, action) => {
            state.selectedTask = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAttendance.pending, (state) => {
            state.loading = true;
            state.studentsData = []
        })
        .addCase(getAttendance.fulfilled, (state, action) => {
            console.log("action.payload attendance ...")
            console.log(action.payload)
            if(action.payload.detail == undefined) {
                let stds = action.payload
                stds = [...stds, action.payload]
                // state.studentsData = action.payload;
                state.studentsData = stds;
            }
            state.loading = false;
        })
        .addCase(getAttendance.rejected, (state, action) => {
          state.loading = false
          console.log("error in calling attendance data api")
        })
        .addCase(getAITaskCheckResults.pending, (state) => {
            state.loading = true;
            state.studentsData = []
        })
        .addCase(getAITaskCheckResults.fulfilled, (state, action) => {
            console.log("AI check res payload")
            console.log(action.payload)
            if(action.payload.detail == undefined) {
                state.studentsData = action.payload;
            }
            state.loading = false;
        })
        .addCase(getAITaskCheckResults.rejected, (state, action) => {
          state.loading = false
          console.log("error in calling live class api")
        })
        .addCase(getClassworkResults.pending, (state) => {
            state.loading = true;
            state.studentsData = []
        })
        .addCase(getClassworkResults.fulfilled, (state, action) => {
            console.log("action.payload")
            console.log(action.payload)
            if(action.payload.detail == undefined) {
                state.studentsData = action.payload;
            }
            state.loading = false;
        })
        .addCase(getClassworkResults.rejected, (state, action) => {
          state.loading = false
          console.log("error in calling live class api")
        })
        .addCase(getSlipTestResults.pending, (state) => {
            state.loading = true;
            state.studentsData = []
        })
        .addCase(getSlipTestResults.fulfilled, (state, action) => {
            console.log("action.payload")
            console.log(action.payload)
            if(action.payload.detail == undefined) {
                state.studentsData = action.payload;
            }
            state.loading = false;
        })
        .addCase(getSlipTestResults.rejected, (state, action) => {
          state.loading = false
          console.log("error in calling live class api")
        })
        .addCase(getSlipTestPerformance.pending, (state) => {
            state.loading = true;
            state.studentPerformance = null
        })
        .addCase(getSlipTestPerformance.fulfilled, (state, action) => {
            console.log("sutdent ST performance result payload")
            console.log(action.payload)
            if(action.payload) {
                state.studentPerformance = action.payload;
            }
            state.loading = false;
        })
        .addCase(getSlipTestPerformance.rejected, (state, action) => {
          state.loading = false
          state.studentPerformance = null
          console.log("error in calling live class api")
        })
        .addCase(getClassWorkPerformance.pending, (state) => {
            state.loading = true;
            state.studentCWPerformance = null
        })
        .addCase(getClassWorkPerformance.fulfilled, (state, action) => {
            console.log("action.payload")
            console.log(action.payload)
            if(action.payload) {
                state.studentCWPerformance = action.payload;
            }
            state.loading = false;
        })
        .addCase(getClassWorkPerformance.rejected, (state, action) => {
          state.loading = false
          state.studentCWPerformance = null
          console.log("error in calling live class api")
        })
    },
});
  
export const { setSelectedTask, setClassId, setSelectedTaskId, setSelectedTaskData } = liveMonitoringSlice.actions;
  
export default liveMonitoringSlice.reducer;
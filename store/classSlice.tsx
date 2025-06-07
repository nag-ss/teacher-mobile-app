import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classService from '../services/classService';
import { handleAuthApiCall } from '../utils/apiUtils';

export const getLiveClass = createAsyncThunk('class/getLiveClass', async (reqData, thunkAPI) => {
  return handleAuthApiCall(classService.getLiveClass, reqData, thunkAPI);
});

export const getScheduleClasses = createAsyncThunk('class/getScheduleClasses', async (reqData, thunkAPI) => {
  return handleAuthApiCall(classService.getScheduleClasses, reqData, thunkAPI);
});

export const addTaskToClass = createAsyncThunk<any>('/teacher/createTeacherTasks', async (reqData, thunkAPI) => {
  return handleAuthApiCall(classService.addTaskToClass, reqData, thunkAPI);
});

export const getTeacherClassTasks = createAsyncThunk('/teacher/getTeacherClassTasks', async (reqData, thunkAPI) => {
  return handleAuthApiCall(classService.getTeacherClassTasks, reqData, thunkAPI);
});

export const deleteTeacherClassTask = createAsyncThunk('/teacher/createTeacherTasks', async (taskid: number, thunkAPI) => {
  return handleAuthApiCall(classService.deleteTeacherClassTask, taskid, thunkAPI);
});


const classSlice = createSlice({
    name: 'class',
    initialState: {
      liveClass:  {},
    //   liveClass: {
    //     "class_id": 0,
    //     "date": "2025-05-05",
    //     "period": "string",
    //     "start_time": "06:03:29.464Z",
    //     "end_time": "06:03:29.464Z",
    //     "school_name": "string",
    //     "division_name": "string",
    //     "section_name": "string",
    //     "subject_name": "string",
    //     "teacher_first_name": "string",
    //     "teacher_last_name": "string",
    //     "assets": [
    //       {
    //         "asset_link": "string",
    //         "asset_type": "string"
    //       }
    //     ],
    //     "class_details": [
    //       {
    //         "Topic": "string",
    //         "Sub_topic": []
    //       }
    //     ]
    //   },
      classTasks: [],
      classTimeline: [],
      loading: false,
      error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(getLiveClass.pending, (state) => {
            state.loading = true;
        })
        .addCase(getLiveClass.fulfilled, (state, action) => {
            console.log("action.payload")
            console.log(action.payload)
            state.liveClass = action.payload;
            state.loading = false;
        })
        .addCase(getLiveClass.rejected, (state, action) => {
          state.loading = false
          console.log("error in calling live class api")
        })
        .addCase(getScheduleClasses.pending, (state, action) => {
            state.loading = true
            console.log("calling login api")
          })
        .addCase(getScheduleClasses.fulfilled, (state, action) => {
            console.log("action.payload")
            console.log(action.payload)
            state.classTimeline = action.payload
            
        })
        .addCase(getScheduleClasses.rejected, (state, action) => {
          state.loading = false
          console.log("error api ")
          console.log(action.payload)
        })
        .addCase(getTeacherClassTasks.pending, (state,action) => {
          state.loading = true
          console.log("Fetching the tasks of a class")
        })
        .addCase(getTeacherClassTasks.fulfilled, (state, action) => {
          console.log("action.payload")
          console.log(action.payload)
          state.classTasks = action.payload
          state.loading = false;
        })
        .addCase(getTeacherClassTasks.rejected, (state, action) => {
          state.loading = false
          console.log("error api ")
          console.log(action.payload)
        })
        .addCase(addTaskToClass.pending, (state, action) => {
          state.loading = true
          console.log("Fetching the tasks of a class")
        })
        .addCase(addTaskToClass.fulfilled, (state, action) => {
          console.log("action.payload")
          console.log(action.payload)
          state.loading = false;
        })
        .addCase(addTaskToClass.rejected, (state, action) => {
          state.loading = false
          console.log("error api ")
          console.log(action.payload)
        })
      
    },
});
  
export const { } = classSlice.actions;
  
export default classSlice.reducer;
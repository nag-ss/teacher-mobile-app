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

export const getTeacherClassTasks = createAsyncThunk('/teacher/getTeacherClassTasks', async (reqData: any, thunkAPI) => {
  return handleAuthApiCall(classService.getTeacherClassTasks, reqData, thunkAPI);
});

export const deleteTeacherClassTask = createAsyncThunk('/teacher/deleteTeacherClassTask', async (taskid: number, thunkAPI) => {
  return handleAuthApiCall(classService.deleteTeacherClassTask, taskid, thunkAPI);
});

export const editTeacherClassTask = createAsyncThunk('/teacher/editTeacherClassTask', async (task: any, thunkAPI) => {
  return handleAuthApiCall(classService.editTeacherClassTask, task, thunkAPI);
});

export const getSlipTestStatus = createAsyncThunk('tasks/updateTask', async (quiz_id: number, thunkAPI) => {
  return handleAuthApiCall(classService.getSlipTestStatus, quiz_id, thunkAPI);
});

export const addSlipTestToClass = createAsyncThunk<any>('/teacher/createSlipTest', async (reqData, thunkAPI) => {
  return handleAuthApiCall(classService.addSlipTestToClass, reqData, thunkAPI);
});

export const updateSlipTest = createAsyncThunk<any>('/teacher/updateSlipTest', async (reqData, thunkAPI) => {
  return handleAuthApiCall(classService.updateSlipTest, reqData, thunkAPI);
});

export const getClassQuiz = createAsyncThunk('/teacher/getQuiz', async (quiz_id: number, thunkAPI) => {
  return handleAuthApiCall(classService.getClassQuiz, quiz_id, thunkAPI);
});

export const publishQuiz = createAsyncThunk('/quiz/publish_quiz', async (quiz: any, thunkAPI) => {
  return handleAuthApiCall(classService.publishQuiz, quiz, thunkAPI);
});

export const deleteQuestion = createAsyncThunk('/question/delete', async (question_id: number, thunkAPI) => {
  return handleAuthApiCall(classService.deleteQuestion, question_id, thunkAPI);
});

export const replaceQuestion = createAsyncThunk('/quiz/change_question', async (question: any, thunkAPI) => {
  return handleAuthApiCall(classService.replaceQuestion, question, thunkAPI);
});

export const getClassTopicSubTopics = createAsyncThunk('/quiz/get_topic_subtopic', async (reqData: any, thunkAPI) => {
  return handleAuthApiCall(classService.getClassTopicSubTopics, reqData, thunkAPI);
});

export const setClassTopicSubTopic = createAsyncThunk('/quiz/set_class_schedule_topic', async (reqData: any, thunkAPI) => {
  return handleAuthApiCall(classService.setClassTopicSubTopic, reqData, thunkAPI);
});

const classSlice = createSlice({
    name: 'class',
    initialState: {
      liveClass:  {},
      quiz_details: {},
      topics: [],
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
      error: null,
      unAuthorised: false
    },
    reducers: {
      setUnAuth: (state) => {
        state.unAuthorised = false
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getLiveClass.pending, (state) => {
            state.loading = true;
        })
        .addCase(getLiveClass.fulfilled, (state, action) => {
            console.log("action.payload live ")
            console.log(action.payload)
            if(action.payload == 401) {
              console.log("welcome to un auth ....")
              state.unAuthorised = true
            } else {
              state.liveClass = action.payload;
              state.loading = false;
            }
            
        })
        .addCase(getLiveClass.rejected, (state, action) => {
          state.loading = false
          console.log("error in calling live class api")
          console.log("action.payload")
          console.log(action.payload)
          if(action.payload == 401) {
            console.log("welcome to un auth ....")
            state.unAuthorised = true
          }
        })
        .addCase(getScheduleClasses.pending, (state, action) => {
            state.loading = true
          })
        .addCase(getScheduleClasses.fulfilled, (state, action) => {
            console.log("action.payload classes ")
            console.log(action.payload)
            state.classTimeline = action.payload
            
        })
        .addCase(getScheduleClasses.rejected, (state, action) => {
          state.loading = false
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
        .addCase(deleteTeacherClassTask.pending, (state, action) => {
          state.loading = true
          console.log("Deleting the task")
        })
        .addCase(deleteTeacherClassTask.fulfilled, (state, action) => {
          console.log("action.payload")
          console.log(action.payload)
          state.loading = false;
        })
        .addCase(deleteTeacherClassTask.rejected, (state, action) => {
          state.loading = false
          console.log("error api ")
          console.log(action.payload)
        })
        .addCase(editTeacherClassTask.pending, (state, action) => {
          state.loading = true
          console.log("Updating the task")
        })
        .addCase(editTeacherClassTask.fulfilled, (state, action) => {
          console.log("action.payload")
          console.log(action.payload)
          state.loading = false;
        })
        .addCase(editTeacherClassTask.rejected, (state, action) => {
          state.loading = false
          console.log("error api ")
          console.log(action.payload)
        })
        .addCase(getSlipTestStatus.pending, (state, action) => {
          state.loading = true
          console.log("Quiz fetch pending")
        })
        .addCase(getSlipTestStatus.fulfilled, (state, action) => {
          console.log("Quiz fetch fulfilled")
          console.log(action.payload)
          state.loading = false;
        })
        .addCase(getSlipTestStatus.rejected, (state, action) => {
          state.loading = false
          console.log("Quiz fetch failed")
          console.log(action.payload)
        })
        .addCase(addSlipTestToClass.pending, (state, action) => {
          state.loading = true
          console.log("Quiz fetch pending")
        })
        .addCase(addSlipTestToClass.fulfilled, (state, action) => {
          console.log("Quiz fetch fulfilled")
          console.log(action.payload)
          state.loading = false;
          state.quiz_details = action.payload
        })
        .addCase(addSlipTestToClass.rejected, (state, action) => {
          state.loading = false
          console.log("Quiz fetch failed")
          console.log(action.payload)
        })
        .addCase(updateSlipTest.pending, (state, action) => {
          state.loading = true
          console.log("Quiz fetch pending")
        })
        .addCase(updateSlipTest.fulfilled, (state, action) => {
          console.log("Quiz fetch fulfilled")
          console.log(action.payload)
          state.loading = false;
          state.quiz_details = action.payload
        })
        .addCase(updateSlipTest.rejected, (state, action) => {
          state.loading = false
          console.log("Quiz fetch failed")
          console.log(action.payload)
        })
        .addCase(getClassQuiz.pending, (state, action) => {
          state.loading = true
          console.log("Quiz fetch pending")
        })
        .addCase(getClassQuiz.fulfilled, (state, action) => {
          console.log("Quiz fetch fulfilled")
          console.log(action.payload)
          state.loading = false;
          state.quiz_details = action.payload
        })
        .addCase(getClassQuiz.rejected, (state, action) => {
          state.loading = false
          console.log("Quiz fetch failed")
          console.log(action.payload)
        })
        .addCase(publishQuiz.pending, (state, action) => {
          state.loading = true
          console.log("Quiz being published")
        })
        .addCase(publishQuiz.fulfilled, (state, action) => {
          console.log("Quiz published")
          console.log(action.payload)
          state.loading = false;
        })
        .addCase(publishQuiz.rejected, (state, action) => {
          state.loading = false
          console.log("Quiz could not be pubished");
          console.log(action.payload)
        })
        .addCase(deleteQuestion.pending, (state, action) => {
          state.loading = true
          console.log("Question being Deleted")
        })
        .addCase(deleteQuestion.fulfilled, (state, action) => {
          console.log("Question deleted successfully")
          console.log(action.payload)
          state.loading = false;
        })
        .addCase(deleteQuestion.rejected, (state, action) => {
          state.loading = false
          console.log("Question delete failed");
          console.log(action.payload)
        })
        .addCase(replaceQuestion.pending, (state, action) => {
          state.loading = true
          console.log("Question being Replaced")
        })
        .addCase(replaceQuestion.fulfilled, (state, action) => {
          console.log("Question replaced successfully")
          console.log(action.payload)
          state.loading = false;
        })
        .addCase(replaceQuestion.rejected, (state, action) => {
          state.loading = false
          console.log("Question replace failed");
          console.log(action.payload)
        })
        .addCase(getClassTopicSubTopics.pending, (state, action) => {
          state.loading = true
          console.log("Topics beings fetched")
        })
        .addCase(getClassTopicSubTopics.fulfilled, (state, action) => {
          console.log("Topics fetched successfully")
          console.log(action.payload)
          state.loading = false;
          state.topics = action.payload
        })
        .addCase(getClassTopicSubTopics.rejected, (state, action) => {
          state.loading = false
          console.log("Topics fetch failed");
          console.log(action.payload)
        })
        .addCase(setClassTopicSubTopic.pending, (state, action) => {
          state.loading = true
          console.log("Topic set pending")
        })
        .addCase(setClassTopicSubTopic.fulfilled, (state, action) => {
          console.log("Topic set successfully")
          console.log(action.payload)
          state.loading = false;
        })
        .addCase(setClassTopicSubTopic.rejected, (state, action) => {
          state.loading = false
          console.log("Topic set failed");
          console.log(action.payload)
        })
    },
});
  
export const { setUnAuth } = classSlice.actions;
  
export default classSlice.reducer;
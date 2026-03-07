import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import feedbackService from '../services/feedbackService';
import { handleAuthApiCall } from '../utils/apiUtils';

export const submitFeedback = createAsyncThunk(
  'feedback/submit',
  async (body: FormData, thunkAPI) => {
    return handleAuthApiCall(feedbackService.submitFeedback, body, thunkAPI);
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    loading: false,
    error: null as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feedbackSlice.reducer;

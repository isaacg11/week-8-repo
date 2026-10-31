// src/reducers/commentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCommentsForThread,
  postComment,
  upvoteComment,
  downvoteComment,
} from "../services/commentService";
import { handleApiError } from "../utils/handleApiError";

//Initial State
const initialState = {
  comments: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (threadId, thunkAPI) => {
    try {
      return await fetchCommentsForThread(threadId);
    } catch (err) {
      return thunkAPI.rejectWithValue(handleApiError(err));
    }
  },
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (data, thunkAPI) => {
    try {
      return await postComment(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(handleApiError(err));
    }
  },
);

export const upvoteCommentThunk = createAsyncThunk(
  "comments/upvote",
  async (commentId, thunkAPI) => {
    try {
      return await upvoteComment(commentId);
    } catch (err) {
      return thunkAPI.rejectWithValue(handleApiError(err));
    }
  },
);

export const downvoteCommentThunk = createAsyncThunk(
  "comments/downvote",
  async (commentId, thunkAPI) => {
    try {
      return await downvoteComment(commentId);
    } catch (err) {
      return thunkAPI.rejectWithValue(handleApiError(err));
    }
  },
);

//Slice
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addComment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // upvoteCommentThunk
      .addCase(upvoteCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upvoteCommentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.comments.findIndex((c) => c._id === updated._id);

        if (index !== -1) {
          state.comments[index] = {
            ...state.comments[index],
            ...updated,
          };
        }
      })
      .addCase(upvoteCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // downvoteCommentThunk
      .addCase(downvoteCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downvoteCommentThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.comments.findIndex((c) => c._id === updated._id);

        if (index !== -1) {
          state.comments[index] = {
            ...state.comments[index],
            ...updated,
          };
        }
      })
      .addCase(downvoteCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;

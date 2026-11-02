import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, errorMessage } from '../services/api';

const unwrapList = (data, key) => Array.isArray(data) ? data : (data?.[key] || data?.data || []);
const getId = (item) => typeof item === 'string' ? item : (item?._id || item?.id);

// Assignment 3 uses /question (singular).
export const fetchQuestions = createAsyncThunk('quizzes/fetchQuestions', async (_, { rejectWithValue }) => {
  try {
    return unwrapList((await api.get('/question')).data, 'questions');
  } catch (e) { return rejectWithValue(errorMessage(e)); }
});

// Assignment 3's GET /quizzes already populates the question array.
export const fetchQuizzes = createAsyncThunk('quizzes/fetch', async (_, { rejectWithValue }) => {
  try {
    return unwrapList((await api.get('/quizzes')).data, 'quizzes');
  } catch (e) { return rejectWithValue(errorMessage(e)); }
});

async function refresh(dispatch) {
  await Promise.all([dispatch(fetchQuizzes()).unwrap(), dispatch(fetchQuestions()).unwrap()]);
}

export const saveQuiz = createAsyncThunk('quizzes/save', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    const body = { title: data.title, description: data.description };
    if (id) await api.put(`/quizzes/${id}`, body);
    else await api.post('/quizzes', body);
    await refresh(dispatch);
  } catch (e) { return rejectWithValue(errorMessage(e)); }
});

export const removeQuiz = createAsyncThunk('quizzes/remove', async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`/quizzes/${id}`);
    await refresh(dispatch);
  } catch (e) { return rejectWithValue(errorMessage(e)); }
});

export const saveQuestion = createAsyncThunk('quizzes/saveQuestion', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    if (id) await api.put(`/question/${id}`, data);
    else await api.post('/question', data);
    await refresh(dispatch);
  } catch (e) { return rejectWithValue(errorMessage(e)); }
});

export const removeQuestion = createAsyncThunk('quizzes/removeQuestion', async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`/question/${id}`);
    await refresh(dispatch);
  } catch (e) { return rejectWithValue(errorMessage(e)); }
});

export const attachQuestions = createAsyncThunk('quizzes/attach', async ({ id, ids }, { dispatch, rejectWithValue }) => {
  try {
    // The original A3 add-existing endpoint is missing a mongoose import.
    // Use its Quiz PUT endpoint to append existing question IDs without duplication.
    const current = (await api.get(`/quizzes/${id}`)).data;
    const existing = (current.questions || []).map(getId).filter(Boolean);
    await api.put(`/quizzes/${id}`, { questions: [...new Set([...existing, ...ids])] });
    await refresh(dispatch);
  } catch (e) { return rejectWithValue(errorMessage(e)); }
});

const slice = createSlice({
  name: 'quizzes',
  initialState: { items: [], questions: [], status: 'idle', questionsStatus: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchQuizzes.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(fetchQuizzes.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
    .addCase(fetchQuizzes.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
    .addCase(fetchQuestions.pending, (state) => { state.questionsStatus = 'loading'; })
    .addCase(fetchQuestions.fulfilled, (state, action) => { state.questionsStatus = 'succeeded'; state.questions = action.payload; })
    .addCase(fetchQuestions.rejected, (state, action) => { state.questionsStatus = 'failed'; state.error = action.payload; }),
});

export default slice.reducer;

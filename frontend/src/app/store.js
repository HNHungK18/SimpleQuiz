import {configureStore} from '@reduxjs/toolkit';import auth from '../features/authSlice';import quizzes from '../features/quizSlice';export const store=configureStore({reducer:{auth,quizzes}});

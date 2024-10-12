import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import postsReducer from '../features/postSlice';


const store = configureStore({
    reducer: {
        auth : authReducer,
        posts: postsReducer,
    },
});

export default store;



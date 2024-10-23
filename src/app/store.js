import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import postsReducer from '../features/postSlice';
import commentReducer from '../features/commentSlice';


const store = configureStore({
    reducer: {
        auth : authReducer,
        posts: postsReducer,
        comments: commentReducer,

    },
});

export default store;



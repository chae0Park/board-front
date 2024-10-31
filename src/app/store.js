import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import postsReducer from '../features/postSlice';
import commentReducer from '../features/commentSlice';
import searchFrequencyReducer from "../features/searchSlice";


const store = configureStore({
    reducer: {
        auth : authReducer,
        posts: postsReducer,
        comments: commentReducer,
        search: searchFrequencyReducer,

    },
});

export default store;



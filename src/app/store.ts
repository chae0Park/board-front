import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import postsReducer from '../features/postSlice';
import commentReducer from '../features/commentSlice';
import searchFrequencyReducer from "../features/searchSlice";
//redux 툴킷의 createSlice()를 사용하면 리듀서와 액션을 자동으로 생성한다. 생성된 리듀서를 export해두면 위와 같이 사용할 수 있다.


const store = configureStore({
    reducer: {
        auth : authReducer,
        posts: postsReducer,
        comments: commentReducer,
        search: searchFrequencyReducer,

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



export default store;



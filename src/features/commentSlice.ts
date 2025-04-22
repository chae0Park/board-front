
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllPosts, fetchPosts, fetchPostById } from './postSlice';
import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../app/store"; // Adjust the import path as necessary
import { Comment } from "types/CommentType"; // Adjust the import path as necessary


  interface CommentState {
    comments: Comment[];
    loading: boolean;
    error: string | null;
  }


const initialState: CommentState = {
    comments: [],
    loading: false,
    error: null,
};

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addCommentRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        addCommentSuccess: (state, action: PayloadAction<Comment>) => {
            state.loading = false;
            state.comments.push(action.payload); // 새로운 댓글 추가
        },
        addCommentFailure: (state, action:PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        setComments: (state, action: PayloadAction<Comment[]>) => {
            state.comments = action.payload; // 댓글 목록 설정
        },
    },
});

export const {
    addCommentRequest,
    addCommentSuccess,
    addCommentFailure,
    setComments,
} = commentSlice.actions;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  PayloadAction<any>
>;

// 댓글 작성 액션
export const addComment = (
    postId: string, 
    content: string, 
    parentId: string | null = null 
    ): AppThunk => async (dispatch, getState) => {
    dispatch(addCommentRequest());
    const token = getState().auth.token; // 토큰을 스토어에서 가져옴

    try {
        //개발용
        // const response = await axios.post(`http://localhost:5002/api/comment/${postId}`, {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comment/${postId}`, {
            content,
            parentId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        // 댓글 추가 성공 후, 댓글에 postId를 추가하여 상태 업데이트
        dispatch(fetchPostById(postId));
        dispatch(addCommentSuccess({ ...response.data, postId }));
        dispatch(fetchAllPosts());  // 전체 게시글 상태 업데이트
        dispatch(fetchPosts({ page: 0, postsPerPage: 3 }));  // 페이지 처리된 게시글 상태 업데이트
        
        
    } catch (error: any) {
        dispatch(addCommentFailure(error.response ? error.response.data : 'Failed to create comment'));
    }
};

export default commentSlice.reducer;

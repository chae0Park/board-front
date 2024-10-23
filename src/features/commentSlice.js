
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
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
        addCommentSuccess: (state, action) => {
            state.loading = false;
            state.comments.push(action.payload); // 새로운 댓글 추가
        },
        addCommentFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setComments: (state, action) => {
            state.comments = action.payload; // 댓글 목록 설정
        },
    },
});

// 액션 생성자 내보내기
export const { addCommentRequest, addCommentSuccess, addCommentFailure, setComments } = commentSlice.actions;

// 댓글 작성 액션
export const addComment = (postId, content, parentId = null ) => async (dispatch, getState) => {
    dispatch(addCommentRequest());

    const token = getState().auth.token; // 토큰을 스토어에서 가져옴

    try {
        const response = await axios.post(`http://localhost:5000/api/comment/${postId}`, {
            content,
            parentId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // 댓글 추가 성공 후, 댓글에 postId를 추가하여 상태 업데이트
        dispatch(addCommentSuccess({ ...response.data, postId }));
        
    } catch (error) {
        dispatch(addCommentFailure(error.response ? error.response.data : 'Failed to create comment'));
    }
};

// 댓글 목록 가져오기 액션
export const fetchComments = (postId) => async (dispatch, getState) => {
    const token = getState().auth.token; // 인증 토큰 가져오기

    try {
        const response = await axios.get(`http://localhost:5000/api/comments/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        dispatch(setComments(response.data)); // 댓글 목록 상태에 설정
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
};

export default commentSlice.reducer;

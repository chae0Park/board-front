// front/src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    posts: [],
    status: 'idle',
    currentPost: null, // 여기에 currentPost 추가
    totalPosts: 0,
    error: null,
};


//게시글 리스트 + 페이징 처리 
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ page, postsPerPage }) => {
    console.log('fetchPosts 호출:', { page, postsPerPage }); // 값 확인
    const response = await axios.get(`http://localhost:5000/api/post?page=${page}&limit=${postsPerPage}`);
    return response.data;
});



//게시글 상세 가져오기
export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (id) => {
    console.log("Fetching Post with ID:", id); 
    const response = await axios.get(`http://localhost:5000/api/post/${id}`);
    return response.data;
});


//이미지 동영상 파일 업로드 기능 포함 게시글 작성 
export const addPost = createAsyncThunk('posts/addPost', async (formData) => {
    //get the token from sessionStroage
    const token = sessionStorage.getItem('token');

    //make the post request, attaching the token to the Authorization header
    const response = await axios.post('http://localhost:5000/api/post', formData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, // Attach the token 
        }
    });
    return response.data;

    
});


// 게시글 수정
export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, formData }, thunkAPI) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/post/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // FormData를 전송할 때 이 헤더를 사용
            },
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
);

// 게시글 삭제
export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
    await axios.delete(`http://localhost:5000/api/post/${id}`);
    return id;
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
                console.log('게시글 로딩 중...');  // 로딩 상태 로그
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                //payload에 있는것들은 server.js에서 res.json()으로 넘겨준 것들에 해당한다.
                state.status = 'succeeded';
                state.posts = action.payload.posts; // posts 배열을 저장
                state.totalPosts = action.payload.totalPosts; // 총 게시글 수 저장
                state.totalPages = action.payload.totalPages; // 총 페이지 수 저장
                console.log('리듀서에서 업데이트된 게시글:', action.payload.posts); // 로그 추가
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.error('게시글 가져오기 실패:', action.error.message);  // 실패 상태 로그
            })
            // Fetch a single post by ID
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.currentPost = action.payload;
                console.log();
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
            })
            .addCase(addPost.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(post => post._id !== action.payload);
            });
    },
});

export default postsSlice.reducer;

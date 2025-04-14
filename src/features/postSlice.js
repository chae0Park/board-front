// front/src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    posts: [],
    postsAll: [],
    allPosts: [], // 이 이름이 다르면 타 컴포넌트에서 useSelector()를 이용해서 데이터를 가지고 올 때 allPosts가 배열이 아니라 iriterable하단 에러를 발생시킴
    myPosts: [],
    searchedPosts: [],
    searchTerm: '',  // 추가
    popularSearchTerms: {}, // 초기값을 객체로 정의
    status: 'idle',
    currentPost: null, 
    totalPosts: 0,
    error: null,
};


//전체 게시글 불러오기 (페이지처리 x)
export const fetchAllPosts = createAsyncThunk('posts/fetchAllPosts', async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/posts/all`;
    
    console.log('🟡 [fetchAllPosts] 호출됨');
    console.log('🔗 [요청 URL]', url);

    try {
        const response = await axios.get(url);
        console.log('✅ [응답 성공]', response);
        console.log('📦 [응답 데이터]', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [요청 실패]', error);
        console.error('📛 [에러 응답]', error.response?.data || error.message);
        throw error;
    }
});



//게시글 리스트 + 페이징 처리 
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ({ page, postsPerPage }) => {
    console.log('🟡 [fetchPosts] 호출됨:', { page, postsPerPage }); // 호출된 값 확인

    const url = `${process.env.REACT_APP_API_URL}/api/post?page=${page}&limit=${postsPerPage}`;
    console.log('🔗 [요청 URL]:', url); // 요청 URL 확인
    // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/post?page=${page}&limit=${postsPerPage}`);

    try {
        const response = await axios.get(url);
        console.log('✅ [응답 성공]', response);
        console.log('📦 [응답 데이터]', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [요청 실패]', error);
        console.error('📛 [에러 응답]', error.response?.data || error.message);
        throw error;
    }
});

//필터링 한 결과로 게시글 리스트 처리 
// My Posts 가져오기
export const fetchMyPosts = createAsyncThunk(
    'posts/fetchMyPosts', // 자동으로 타입을 생성합니다
    async (userId) => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/search?userId=${userId}`);
        return response.data; // 리턴한 값은 action.payload로 사용됩니다
    }
);

// Searched Posts 가져오기
export const fetchSearchedPosts = createAsyncThunk(
    'posts/fetchSearchedPosts', // 자동으로 타입을 생성합니다
    async ({searchTerm, searchOption}) => {
        console.log('검색 후 fetchSearchedPost가 호출되었습니다',)
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/search?query=${searchTerm}&option=${searchOption}`);
        console.log('fetchSearchedPosts  호출 후 응답 값',response)
        return response.data; // 리턴한 값은 action.payload로 사용됩니다
    }
);




//게시글 상세 가져오기 + 조회수 증가 요청 
export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (id) => {
    console.log("Fetching Post with ID:", id); 
    try{
        await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${id}/view`); //게시물 조회수 증가
        
        const postResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/post/${id}`); //상세 게시물 조회
        const commentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${id}`); // 게시물의 댓글 목록 조회
        
        return { post: postResponse.data, comments: commentsResponse.data };
    }catch(error){
        console.error('게시물 가져오기 오류:', error);
        throw error;
    }
        
});


//좋아요 
export const likePost = createAsyncThunk('posts/likePost', async (id, { getState }) => {
    const { token } = getState().auth; // 현재 상태에서 토큰 가져오기
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰을 헤더에 포함
        },
        withCredentials: true,
    };

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${id}/like`, {}, config); // 빈 객체를 body로 전송
        return response.data; // 좋아요 수 반환
    } catch (error) {
        console.error('좋아요 수 증가 중 오류 발생:', error);
        throw error; // 에러 발생 시 throw
    }
});


// 게시글 작성 - 
export const addPost = createAsyncThunk('posts/addPost', async (formData) => {
    console.log('addPost 액션 생성자 호출'); 
    const token = sessionStorage.getItem('token');

    for (let pair of formData.entries()) {
        console.log('addPost 호출, formData:',pair[0] + ': ' + pair[1]);
    }
   
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/post`, formData, {
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
    });
    return response.data;

});


// 게시글 수정
export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, formData }, thunkAPI) => {
    console.log('updatePost 호출, post id:', id); // 값 확인 - 잘 나옴

    for (let pair of formData.entries()) {
        console.log('게시글 수정, formData:',pair[0] + ': ' + pair[1]);
    }

    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/post/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // FormData를 전송할 때 이 헤더를 사용
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
);

// 게시글 삭제
export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/post/${id}`);
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
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allPosts = action.payload; // 모든 게시글 배열로 저장
            })
            .addCase(fetchMyPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.myPosts = action.payload.posts;
                state.postsWithComments = action.payload.postsWithComments; // 댓글이 달린 게시물 ID
                state.likedPosts = action.payload.likedPosts; // 좋아요가 눌린 게시물
            })
            .addCase(fetchSearchedPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.searchedPosts = action.payload.posts;
                state.searchTerm = action.payload.query;
            })
            // Fetch a single post by ID
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.currentPost = action.payload.post;
                state.comments = action.payload.comments;
                console.log('Post:', state.currentPost, 'Comments:', state.comments);
            })
            //like reducer
            .addCase(likePost.fulfilled, (state, action) => {
                const updatedPost = state.posts.find(post => post.id === action.meta.arg);
                if (updatedPost) {
                    updatedPost.like = action.payload.like; // 서버에서 반환된 좋아요 수로 업데이트
                }
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

export const selectSearchedPosts = (state) => state.posts.searchedPosts; // 검색된 포스트
export const selectSearchTerm = (state) => state.posts.searchTerm;


export default postsSlice.reducer;

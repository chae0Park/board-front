import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchAllPosts, fetchPosts } from "./postSlice";


const initialState = {
    user: JSON.parse(sessionStorage.getItem('user')) || null, // 새로고침 시 로컬스토리지에서 불러오기
    token: sessionStorage.getItem('token') || null, // 새로고침 시 토큰도 로컬스토리지에서 불러오기
    userFetched: false, // 추가된 상태
    isModalVisible: false,
};


const authSlice = createSlice({ // createSlice()를 이용해 정의된 slice 는 액션과 리듀서가 함께 정의되어 있다
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => { //loginSuccess()는 리듀서다.
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('accessToken', state.token); 
            state.userFetched = true; 
            sessionStorage.setItem('user', JSON.stringify(state.user));

        },
        logoutSuccess: (state) => { //logoutSuccess()는 리듀서다.
            state.user = null;
            state.token = null;
            state.userFetched = false; // 로그아웃 시 초기화

             // 로그아웃 시 sessionStorage에서 삭제
             sessionStorage.removeItem('user');
             sessionStorage.removeItem('token');
        },
        setUserProfile: (state, action) => {  //setUserProfile()는 리듀서다.
            state.user = action.payload; // 사용자 정보를 업데이트
            state.userFetched = true; // 사용자 정보가 성공적으로 로드되었음을 나타냄
            sessionStorage.setItem('user', JSON.stringify(state.user)); // 업데이트된 사용자 정보를 로컬 스토리지에 저장
        },
        profileImageUploadSuccess: (state, action) => { //profileImageUploadSuccess()는 리듀서다.
            // 프로필 이미지가 성공적으로 업로드되었을 때, user 상태 업데이트
            if (state.user) {
                state.user.profileImage = action.payload.profileImage;
                sessionStorage.setItem('user', JSON.stringify(state.user)); // 업데이트된 유저 정보를 sessionStorage에 저장
            }
            state.uploadingProfileImage = false; // 업로드 완료 상태 업데이트
        },
    },
});

export const { loginSuccess, logoutSuccess, setUserProfile, profileImageUploadSuccess } = authSlice.actions;


 // 액션 생성자 = 액션 객체를 만들어내는 함수. 즉 리턴값으로 액션 객체가 나온다. 그리고 비동기 처리를 위해 리덕스의 thunk를 사용함
export const registerUser = (formData) => async (dispatch) => {
    try {
        // 중복 체크를 위해 동일한 API를 호출
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, formData); // 비동기 요청을 하고
        alert('Registration successful!');

        
        dispatch(loginSuccess(response.data));// 비동기 요청이 성공적으로 완료되면 loginSuccess액션을 dispatch 
    } catch (error) {
        if (error.response) {
            // 서버에서 반환한 에러 메시지 사용
            alert(error.response.data.message);
        } else {
            alert('Registration failed');
        }
    }
}

export const loginUser = (formData) => async (dispatch) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, formData , {
            withCredentials: true  // 쿠키를 포함한 요청을 보냄
        });
        dispatch(loginSuccess(response.data));
        sessionStorage.setItem('token', response.data.token); // 토큰 저장
    } catch (error) {
        throw error;
    }
}

export const fetchUserProfile = (userId) => async (dispatch, getState) => {
    console.log('fetchUserProfile 생성자 호출!'); 
    try {
        const { token } = getState().auth; // 인증 토큰 가져오기
        console.log('fetchUserProfile에서 가져온 토큰:', token); // 토큰 확인
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`, // 인증 토큰을 헤더에 포함
            },
            withCredentials: true,
        };
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, config);
        console.log('fetchUserProfile 응답:', response.data); // 응답 데이터 확인
        dispatch(setUserProfile(response.data.user)); 
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};


//로그아웃 액션 생성자 
export const logoutUser = () => async (dispatch, getState) => {
    const { token } = getState().auth; 
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`, // 인증 토큰을 헤더에 포함
        },
        withCredentials: true,
    };

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, config); // 빈 객체로 body를 보냄
        sessionStorage.removeItem('token');
        dispatch(logoutSuccess());
    } catch (error) {
        console.error('로그아웃 API 호출 오류:', error);
    }
};

// 프로필 사진 업로드 액션
export const uploadProfileImage = (imageFile, userId) => async (dispatch, getState) => {
    console.log('uploadProfileImage 생성자 호출!', imageFile); 
    try {
        const formData = new FormData();
        formData.append('file', imageFile); // 업로드할 이미지 파일

        const { token } = getState().auth; // 인증 토큰 가져오기
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더 설정
                'Authorization': `Bearer ${token}`, // 인증 토큰을 헤더에 포함
            },
            withCredentials: true,
        };

        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, formData, config);
        const newProfileImage = response.data.profileImage;

        dispatch(profileImageUploadSuccess({ profileImage: newProfileImage }));

        dispatch(fetchPosts({ page: 0, postsPerPage: 3 }));  // 현재 페이지의 게시글 다시 불러오기
        dispatch(fetchAllPosts());  // 전체 게시글 다시 불러오기

        // 성공 시 알림
        alert('Profile image updated successfully!');
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

export default authSlice.reducer;
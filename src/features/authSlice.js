import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    user: JSON.parse(sessionStorage.getItem('user')) || null, // 새로고침 시 로컬스토리지에서 불러오기
    token: sessionStorage.getItem('token') || null, // 새로고침 시 토큰도 로컬스토리지에서 불러오기
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            // sessionStorage에 user와 token 저장
            sessionStorage.setItem('user', JSON.stringify(state.user));
            sessionStorage.setItem('token', action.payload.token);
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.token = null;
             // 로그아웃 시 sessionStorage에서 삭제
             sessionStorage.removeItem('user');
             sessionStorage.removeItem('token');
        },
        setUserProfile: (state, action) => {
            state.user = action.payload; // 사용자 정보를 업데이트
            sessionStorage.setItem('user', JSON.stringify(state.user)); // 업데이트된 사용자 정보를 로컬 스토리지에 저장
        },
        profileImageUploadSuccess: (state, action) => {
            // 프로필 이미지가 성공적으로 업로드되었을 때, user 상태 업데이트
            if (state.user) {
                state.user.profileImage = action.payload.profileImage;
                sessionStorage.setItem('user', JSON.stringify(state.user)); // 업데이트된 유저 정보를 sessionStorage에 저장
            }
        }
    },
});

export const { loginSuccess, logoutSuccess, setUserProfile, profileImageUploadSuccess } = authSlice.actions;


export const registerUser = (formData) => async (dispatch) => {
    try{
        await axios.post('http://localhost:5000/api/register', formData);
        alert('Registration successful!');
    } catch (error) {
        throw error;
    }
}

export const loginUser = (formData) => async (dispatch) => {
    try{
        const response = await axios.post('http://localhost:5000/api/login', formData);
        dispatch(loginSuccess(response.data));
        sessionStorage.setItem('token', response.data.token);
    } catch (error) {
        throw error;
    }
}

export const fetchUserProfile = (userId) => async (dispatch, getState) => {
    try {
        const { token } = getState().auth; // 인증 토큰 가져오기
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`, // 인증 토큰을 헤더에 포함
            },
        };

        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, config);
        dispatch(setUserProfile(response.data.user)); // 사용자 정보를 상태에 저장
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};


export const logoutUser = () => (dispatch) => {
    sessionStorage.removeItem('token');
    dispatch(logoutSuccess());
};

// 프로필 사진 업로드 액션
export const uploadProfileImage = (imageFile, userId) => async (dispatch, getState) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', imageFile); // 업로드할 이미지 파일

        const { token } = getState().auth; // 인증 토큰 가져오기
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더 설정
                'Authorization': `Bearer ${token}`, // 인증 토큰을 헤더에 포함
            },
        };

                // 로그 추가
                console.log('Sending PUT request to:', `http://localhost:5000/api/users/${userId}`);
                console.log('Form Data:', formData.get('profileImage')); // 파일 이름 확인
                console.log('Auth Token:', token);

        const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formData, config);
        dispatch(profileImageUploadSuccess({ profileImage: response.data.profileImage }));

        // 성공 시 알림
        alert('Profile image updated successfully!');
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

export default authSlice.reducer;
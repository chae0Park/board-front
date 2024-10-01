import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;


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
        localStorage.setItem('token', response.data.token);
    } catch (error) {
        throw error;
    }
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch(logoutSuccess());
};

export default authSlice.reducer;
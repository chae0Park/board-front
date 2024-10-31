import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    frequencies: [],
    loading: false,
    error: null,
};

// 비동기 작업: SearchFrequency 데이터를 가져오는 함수
export const fetchSearchFrequencies = createAsyncThunk(
    'searchFrequency/fetchSearchFrequencies',
    async () => {
        const response = await axios.get('http://localhost:5000/api/search-frequencies');
        return response.data; // 리턴된 데이터는 action.payload로 사용됩니다
    }
);

const searchFrequencySlice = createSlice({
    name: 'searchFrequency',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchFrequencies.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.frequencies = action.payload; // API에서 받은 데이터 저장
            })
    },
});

export default searchFrequencySlice.reducer;
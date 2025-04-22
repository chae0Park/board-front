import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { SearchFrequencyType } from 'types/SearchFrequencyType';


type SearchFrequencyState  = {
    frequencies: SearchFrequencyType[],
    loading: boolean,
    error: null | string,
    status?: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState:SearchFrequencyState = {
    frequencies: [],
    loading: false,
    error: null,
    status: 'idle',
};

// 비동기 작업: SearchFrequency 데이터를 가져오는 함수
export const fetchSearchFrequencies = createAsyncThunk<SearchFrequencyType[]>(
    'searchFrequency/fetchSearchFrequencies',
    async () => {
        console.log('📢fetchSearchFrequencies called'); // API 호출 확인
        // 개발용
        // const url = `http://localhost:5002/api/search-frequencies`;
        // const response = await axios.get<SearchFrequencyType[]>(url);

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search-frequencies`);
        console.log('response', response.data); // API에서 받은 데이터 확인
        return response.data; // 리턴된 데이터는 action.payload로 사용
    }
);

const searchFrequencySlice = createSlice({
    name: 'searchFrequency',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSearchFrequencies.pending, (state) => {
            state.status = 'loading';
            state.loading = true;
        })
        .addCase(fetchSearchFrequencies.fulfilled, (state, action: PayloadAction<SearchFrequencyType[]>) => {
            state.loading = false;
            state.status = 'succeeded';
            state.frequencies = action.payload; // API에서 받은 데이터 저장
        })
        .addCase(fetchSearchFrequencies.rejected, (state, action) => {
            state.status = 'failed';
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch search frequencies';
        });
    },
});

export default searchFrequencySlice.reducer;
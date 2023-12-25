import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import axios from 'axios';

interface Location {
    name: string;
    type: string;
    dimension: string;
    // Другие поля
}

interface Info {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

interface ApiResponse {
    info: Info;
    results: Location[];
}

interface TableState {
    tableData: Location[];
    pagination: {
        currentPage: number;
        totalPages: number;
        nextPage: string | null;
        prevPage: string | null;
    };
    loading: boolean;
    error: string | null;
}

const initialState: TableState = {
    tableData: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        nextPage: null,
        prevPage: null,
    },
    loading: false,
    error: null,
};

export const fetchLocations = createAsyncThunk('locations/fetchLocations', async (page: string) => {
    const response = await axios.get(page || 'https://rickandmortyapi.com/api/location');
    return response.data;
});

const locationSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
                state.tableData = [...state.tableData, ...action.payload.results];
                state.pagination.currentPage += 1;
                state.pagination.totalPages = action.payload.info.pages;
                state.pagination.nextPage = action.payload.info.next;
                state.pagination.prevPage = action.payload.info.prev;
                state.loading = false;
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch data';
            });
    },
});

export const selectLocations = (state: RootState) => state.locations.locations;
export const selectLocationsLoading = (state: RootState) => state.locations.loading;
export const selectLocationsError = (state: RootState) => state.locations.error;
export const tableSliceReducer = (state: RootState) => state.locations.error;

export default locationSlice.reducer;
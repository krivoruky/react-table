import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import axios from 'axios';
interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: object;
    location: object;
    image: string;
    episode: [];
    url: string;
    created: string;
}

interface Info {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
}

interface ApiResponse {
    info: Info;
    results: Character[];
}

interface TableState {
    tableData: Character[];
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

export const fetchCharacter = createAsyncThunk('locations/fetchCharacter', async () => {
    const response = await axios.get('https://rickandmortyapi.com/api/character');
    return response.data;
});

const сharacterSlice = createSlice({
    name: 'character',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharacter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCharacter.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
                state.tableData = [...state.tableData, ...action.payload.results];
                state.pagination.currentPage += 1;
                state.pagination.totalPages = action.payload.info.pages;
                state.pagination.nextPage = action.payload.info.next;
                state.pagination.prevPage = action.payload.info.prev;
                state.loading = false;
            })
            .addCase(fetchCharacter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch data';
            });
    },
});

export const selectTableDataLocations = (state: RootState) => state.locations.tableData;
export const selectLocationsPagination = (state: RootState) => state.locations.pagination;
export const selectLocationsLoading = (state: RootState) => state.locations.loading;
export const selectLocationsError = (state: RootState) => state.locations.error;

export default сharacterSlice.reducer;
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
        count: number;
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
        count: 1,
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

const characterSlice = createSlice({
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
                state.pagination.count = action.payload.info.count;
                state.loading = false;
            })
            .addCase(fetchCharacter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch data';
            });
    },
});

export const selectTableDataCharacters = (state: RootState) => state.characters.tableData;
export const selectCharactersPagination = (state: RootState) => state.characters.pagination;
export const selectCharactersLoading = (state: RootState) => state.characters.loading;
export const selectCharactersError = (state: RootState) => state.characters.error;

export default characterSlice.reducer;
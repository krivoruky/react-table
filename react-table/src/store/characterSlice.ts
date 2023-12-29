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
        totalPages: 1,
        count: 1,
        nextPage: null,
        prevPage: null,
    },
    loading: false,
    error: null,
};

export const fetchCharacter = createAsyncThunk('character/fetchCharacter', async () => {
    const response = await axios.get('https://rickandmortyapi.com/api/character');
    return response.data;
});

export const fetchNextPage = createAsyncThunk(
    'character/fetchNextPage',
    async (nextPageUrl: string) => {
        const response = await axios.get(nextPageUrl);
        return response.data;
    }
);

export const fetchPrevPage = createAsyncThunk(
    'character/fetchPrevPage',
    async (prevPageUrl: string) => {
        const response = await axios.get(prevPageUrl);
        return response.data;
    }
);

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
                const newData = action.payload.results;
                const existingData = state.tableData;
                const isDataExist = existingData.some(item => newData.some(item2 => item2.id === item.id));
                if (!isDataExist) {
                    state.tableData = [...state.tableData, ...newData];
                }
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

        builder.addCase(fetchNextPage.fulfilled, (state, action) => {
            const newData = action.payload.results;
            const existingData = state.tableData;

            const isDataExist = existingData.some(item => newData.some((item2: Character) => item2.id === item.id));

            if (!isDataExist) {
                state.tableData = [...state.tableData, ...newData];
            }
            state.pagination.totalPages = action.payload.info.pages;
            state.pagination.nextPage = action.payload.info.next;
            state.pagination.prevPage = action.payload.info.prev;
            state.loading = false;
        });
        builder.addCase(fetchNextPage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch data';
        });

        builder.addCase(fetchPrevPage.fulfilled, (state, action) => {
            const newData = action.payload.results;
            const existingData = state.tableData;

            const isDataExist = existingData.some(item => newData.some((item2: Character) => item2.id === item.id));

            if (!isDataExist) {
                state.tableData = [...state.tableData, ...newData];
            }
            state.pagination.totalPages = action.payload.info.pages;
            state.pagination.nextPage = action.payload.info.next;
            state.pagination.prevPage = action.payload.info.prev;
            state.loading = false;
        });
        builder.addCase(fetchPrevPage.rejected, (state, action) => {
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
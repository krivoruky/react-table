import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import axios from 'axios';

interface Location {
    // определите тип данных для локаций
}

interface LocationState {
    locations: Location[];
    loading: boolean;
    error: string | null;
}

const initialState: LocationState = {
    locations: [],
    loading: false,
    error: null,
};

export const fetchLocations = createAsyncThunk('locations/fetchLocations', async () => {
    const response = await axios.get('https://rickandmortyapi.com/api/location');
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
            })
            .addCase(fetchLocations.fulfilled, (state, action) => {
                state.loading = false;
                state.locations = action.payload;
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch locations';
            });
    },
});

export const selectLocations = (state: RootState) => state.locations.locations;
export const selectLocationsLoading = (state: RootState) => state.locations.loading;
export const selectLocationsError = (state: RootState) => state.locations.error;

export default locationSlice.reducer;
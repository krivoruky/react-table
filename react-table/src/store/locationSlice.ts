import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import axios from 'axios';

interface Location {
	id: number;
	name: string;
	type: string;
	dimension: string;
	residents: [];
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
	results: Location[];
}

interface TableState {
	tableData: Location[];
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

export const fetchLocations = createAsyncThunk('locations/fetchLocations', async () => {
	const response = await axios.get('https://rickandmortyapi.com/api/location');
	return response.data;
});

export const fetchNextPage = createAsyncThunk(
	'locations/fetchNextPage',
	async (nextPageUrl: string) => {
		const response = await axios.get(nextPageUrl);
		return response.data;
	}
);

export const fetchPrevPage = createAsyncThunk(
	'locations/fetchPrevPage',
	async (prevPageUrl: string) => {
		const response = await axios.get(prevPageUrl);
		return response.data;
	}
);

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
			.addCase(fetchLocations.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch data';
			});

		builder.addCase(fetchNextPage.fulfilled, (state, action) => {
			const newData = action.payload.results;
			const existingData = state.tableData;

			const isDataExist = existingData.some(item => newData.some((item2: Location) => item2.id === item.id));

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

			const isDataExist = existingData.some(item => newData.some((item2: Location) => item2.id === item.id));

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

export const selectTableDataLocations = (state: RootState) => state.locations.tableData;
export const selectLocationsPagination = (state: RootState) => state.locations.pagination;
export const selectLocationsLoading = (state: RootState) => state.locations.loading;
export const selectLocationsError = (state: RootState) => state.locations.error;

export default locationSlice.reducer;
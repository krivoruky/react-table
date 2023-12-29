import { configureStore } from '@reduxjs/toolkit';
import locationSlice from './locationSlice';
import characterSlice from './characterSlice';

export const store = configureStore({
    reducer: {
        locations: locationSlice,
        characters: characterSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from "@reduxjs/toolkit";
import { mockApi } from "./slice/apiSlice";

export const store = configureStore({
    reducer: {
        [mockApi.reducerPath]: mockApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(mockApi.middleware)
})

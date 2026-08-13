import { configureStore } from "@reduxjs/toolkit";

/**
 * store
 *
 * Root Redux store. No feature slices registered yet — reducers get added
 * here as each feature module (products, orders, vendors, etc.) is built,
 * e.g.:
 *
 *   import productsReducer from "../features/products/productsSlice";
 *
 *   export const store = configureStore({
 *     reducer: {
 *       products: productsReducer,
 *     },
 *   });
 */
export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

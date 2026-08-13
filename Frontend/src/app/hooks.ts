import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Typed Redux hooks. Use these everywhere instead of the plain
 * `useDispatch`/`useSelector` from react-redux, so state and dispatch are
 * correctly typed without repeating generics at every call site.
 *
 * Example:
 *   const dispatch = useAppDispatch();
 *   const products = useAppSelector((state) => state.products.items);
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

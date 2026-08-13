/**
 * Shared API types
 *
 * Generic shapes for API responses/errors, used across every feature's
 * API layer so response handling stays consistent. Adjust the envelope
 * shape here once the real backend's response format is confirmed.
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedData<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

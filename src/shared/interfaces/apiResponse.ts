export interface APIResponse<T> {
  message: string;
  data: T;
}

export interface APIPaginatedResponse<T> {
  message: string;
  data: T;
  paginated: {
    totalPages: number;
    limit: number;
    page: number;
  };
}

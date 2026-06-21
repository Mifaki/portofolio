export interface PaginatedData<T> {
	items: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface ApiResponse<T> {
	status: string;
	message: string;
	data: T;
}

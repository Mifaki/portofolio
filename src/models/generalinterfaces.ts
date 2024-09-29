export interface IGeneralMockFetchResponse<T> {
    data: T | null;
    status: boolean;
    message: string | null;
}
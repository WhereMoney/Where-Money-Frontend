export interface Budget {
    [key: string]: number;
    id: number;
    bookId: number;
    billCategoryId: number;
    used: number;
    limit: number;
    times: number;
}

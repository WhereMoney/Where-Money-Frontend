import http from '@/utils/http';

function addBookApi(params: any): any {
    return http.post('/book/add-book', params);
}

function getBookApi(params: { id: number }): any {
    return http.get('/book/book', params);
}

function getAllBookApi(): any {
    return http.get('/book/get-book', null);
}

export {addBookApi, getBookApi, getAllBookApi};

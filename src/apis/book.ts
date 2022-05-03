import http from '@/utils/http';

function addBookApi(params: any): any {
    return http.post('/book/add-book', params);
}

function getBookApi(params: any): any {
    return http.get('/book/get-book', params);
}

export {addBookApi, getBookApi};

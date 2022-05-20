import http from '@/utils/http';

function addBillApi(params: any): any {
    return http.post('/bill/add-bill', params);
}

export {addBillApi};

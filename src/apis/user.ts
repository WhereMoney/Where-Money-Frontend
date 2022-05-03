import http from '@/utils/http';

function activeApi(params: any): any {
    return http.post('/user/register', params);
}

function loginApi(params: any): any {
    return http.post('/user/login', params);
}

function getProtocolApi(): any {
    return http.get('/user/protocol', null);
}

function modifyInformation(params: any): any {
    return http.post('/user/modify-information', params);
}

export {activeApi, loginApi,getProtocolApi, modifyInformation};

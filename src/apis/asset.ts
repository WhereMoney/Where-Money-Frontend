import http from '@/utils/http';

function addAsset(params: {
    assetName: string, balance: number, type: '信用卡' | '充值' | '投资理财' | '资金', billDate?: number | null, repayDate?: number | null, quota?: number | null,
    inTotal: boolean
}): any {
    return http.post('asset/add-asset', params);
}

function getAllAsset(): any {
    return http.get('/asset/get-all-asset', null);
}

function getAssetApi(params: { id: number }): any {
    return http.get('/asset/get-asset', params);
}

export {addAsset, getAllAsset, getAssetApi};

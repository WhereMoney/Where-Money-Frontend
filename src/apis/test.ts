import http from '@/utils/http';

function generateToken(params: { account: number, role: "业务员" | "维修员" }): any {
    return http.get('/test/generate-token', params);
}

export {generateToken};

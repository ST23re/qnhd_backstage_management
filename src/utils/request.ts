import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// import router from '@/router';
import { getToken } from './cookies';
import { ElLoading, ElMessage } from 'element-plus';
import qs, { stringify } from 'querystring';
let loading: any;
let requestCount: number = 0;
interface Options {
    lock: boolean;
    text: string;
    background: string;
}
const options: Options = {
    lock: true,
    text: "加载中...",
    background: 'rgba(0,0,0,0.7)'
}
const startLoading = () => {
    if (requestCount === 0 && !loading) loading = ElLoading.service(options);
    requestCount++;
}
const endLoading = () => {
    requestCount--;
    if (requestCount === 0) loading.close();
}

export function request(config: AxiosRequestConfig) {
    const instance = axios.create({
        baseURL: config.baseURL || import.meta.env.MODE === 'development' ? '/api/v1/b' : import.meta.env.VITE_REQUEST_BASE_URL,
        //for replacement, config = { baseURL: 'env.VITE_IMAGE_BASE_URL', url: '/upload/image' || '/download/thumb' || '/download/origin' }
        timeout: 5000,
/*         transformRequest: (data, config) => {
            if (config?.method === 'post') return qs.stringify(data);
            else return data;
        } */
    })
    instance.interceptors.request.use((config) => {
        startLoading();
        config.params = {
            ...config.params,
            token: getToken()
        }
        if(config.method === 'post')config.data = qs.stringify(config.data);
        return config;
    })
    instance.interceptors.response.use((response: AxiosResponse<any>) => {
        endLoading();
        if (response.status === 200) {
            const { data } = response;
            if (data.code === 200) return data.data;
            else {
                ElMessage({
                    message: data.msg,
                    type: 'error',
                    duration: 2000,
                    grouping: true
                });
                return;
            }
        } else if (response.status === 500) {
            ElMessage.error('[system error] code: 500');
            return;
        }
    }, err => {
        endLoading();
        ElMessage.error('[net error] please try later');
        return Promise.reject(err);
    })
    return instance(config);
}
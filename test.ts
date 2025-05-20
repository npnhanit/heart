import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const HTTP_STATUS_OK_MIN = 200;
const HTTP_STATUS_OK_MAX = 300;

const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
    },
});

/**
 * Execute a GET request to the specified URL
 * 
 * @param url 
 * @param config 
 * @returns 
 */
function getResource<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return requestResource({ ...config, method: 'GET', url });
}

/**
 * Execute a POST request to the specified URL
 * 
 * @param url 
 * @param payload 
 * @param config 
 * @returns 
 */
function postResource<T>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> {
    return requestResource({ ...config, method: 'POST', url, data: payload });
}

/**
 * The common function to request a resource. It will handle the response and error.
 * 
 * @param config 
 * @returns 
 */
async function requestResource<T>(config: AxiosRequestConfig): Promise<T> {
    try {
        const response = await apiInstance(config);
        if (isSuccessfulResponse(response)) {
            const successResponse = response.data as SuccessResponse<T>;
            return successResponse.data;
        }
        throw new Error('API request failed');
    } catch (error) {
        handleErrorResponse(error);
    }
}

/**
 * Check the response is successful
 * 
 * @param status 
 * @returns 
 */
function isSuccessfulResponse(response: AxiosResponse): boolean {
    return response.status >= HTTP_STATUS_OK_MIN && response.status < HTTP_STATUS_OK_MAX;
}

/**
 * Handle error response
 * 
 * @param error 
 */
function handleErrorResponse(error: unknown): never {
    if (axios.isAxiosError(error)) {
        console.error(`API Error (${error.response?.data.error.code}): ${error.response?.data.error.message}`);
    }
    throw new Error('API request failed');
}

export default { apiInstance, getResource, postResource };
import axios, { AxiosError, AxiosInstance, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios";

interface RequestAdapterProps extends CreateAxiosDefaults {}
export class RequestAdapter {
    public adapter: AxiosInstance;

    constructor(props?: RequestAdapterProps){
        const { baseURL = process.env.NEXT_PUBLIC_API_URL, ...rest} = props || {};
        this.adapter = axios.create({
            baseURL,
            ...rest
        })

        this.interceptRequet = this.interceptRequet.bind(this)
        this.interceptResponse = this.interceptResponse.bind(this)
        this.handleError = this.handleError.bind(this)
    }

    private async interceptRequet(
        config:InternalAxiosRequestConfig,
    ): Promise<InternalAxiosRequestConfig>{
        return config
    }

    private async interceptResponse(
        response:AxiosResponse,
    ):Promise<AxiosResponse>{
        return response
    }

    private async handleError(error:AxiosError):Promise<AxiosError> {
        return error
    }

    public sendPost<B, T>(
        url:string,
        data?:B,
        config?:InternalAxiosRequestConfig
    ):Promise<AxiosResponse<T>>{
        return this.adapter.post<B, AxiosResponse<T>>(url, data, config)
    }
}
import { BaseResponse } from "@/interfaces/global.interface";
import { RequestAdapter } from "./request-adapter.service";
import axios, { AxiosResponse, InternalAxiosRequestConfig,AxiosHeaders  } from 'axios';

interface AccessToken{
    accessToken:string;
}

interface Signature {
    signature: string;
    timestamp: string;
}

interface requestLandingPage {
    hash :string
}


export class LandingPageService extends RequestAdapter{
    constructor(){
        super()
    }

    public async generateAccessToken(
        body:GenerateAccessTokenBodyRequest
    ):Promise<BaseResponse<AccessToken>>{
        try {
            const {data} = await this.sendPost<
                GenerateAccessTokenBodyRequest,
                BaseResponse<AccessToken>
            >('/data-processing/generate/access-token/merchant', body)

            if(!data.success || !data.data){
                return {
                    success:false,
                    code:400,
                    message:'Generate Access Token Failed',
                    data:null,
                }
            }
            return data
        } catch (error) {
            // throw error
            const axiosError = error as {
                response?:{
                    status:number;
                    data:any
                }
            }

            return {
                success:false,
                code:axiosError.response?.status || 500,
                message:axiosError.response?.data?.responseMessage || "Unexpected error occurred.",
                data:null,
            }
        }
        
    }

    public async generateSignature(
        body:GenerateSignatureBodyRequest
    ):Promise<BaseResponse<Signature>>{
        try {
            const bodyReq = this.buildRequestBody(body);
            const config: InternalAxiosRequestConfig = {
                headers: {
                    'AIF-ClientId':body.clientId,
                    'AIF-Timestamp':new Date().toISOString(),
                    'Authorization': `Bearer ${body.accessToken}`,
                } as any,
            };
            const {data} = await this.sendPost<
                GenerateSignatureBodyRequest,
                BaseResponse<Signature>
            >('/data-processing/generate/signature/landing-page', bodyReq, config)

            if(!data.success || !data.data){
                return {
                    success:false,
                    code:400,
                    message:'Generate Signature Failed',
                    data:null,
                }
            }
            return data
        } catch (error) {
            const axiosError = error as {
                response?:{
                    status:number;
                    data:any
                }
            }

            return {
                success:false,
                code:axiosError.response?.status || 500,
                message:axiosError.response?.data?.responseMessage || "Unexpected error occurred.",
                data:null,
            }
        }
    }

    public async requestLandingPage(
        body:RequestLandingPageBodyRequest
    ):Promise<BaseResponse<requestLandingPage>>{
        try {
            const bodyReq = this.buildRequestBody(body);
            const config: InternalAxiosRequestConfig = {
                headers: {
                    'AIF-ClientId':body.clientId,
                    'AIF-Signature':body.signature,
                    'AIF-Timestamp':body.timestamp,
                    'Authorization': `Bearer ${body.accessToken}`,
                } as any,
            };
            const {data} = await this.sendPost<
                RequestLandingPageBodyRequest,
                BaseResponse<requestLandingPage>
            >('/data-processing/landing-page/request', bodyReq, config)

            if(!data.success || !data.data){
                return {
                    success:false,
                    code:400,
                    message:'Request Landing Page Failed',
                    data:null,
                }
            }
            return data
        } catch (error) {
            const axiosError = error as {
                response?:{
                    status:number;
                    data:any
                }
            }

            return {
                success:false,
                code:axiosError.response?.status || 500,
                message:axiosError.response?.data?.responseMessage || "Unexpected error occurred.",
                data:null,
            }
        }
    }

    private buildRequestBody(body: GenerateSignatureBodyRequest) {
        return {
            merchantCode: body.merchantCode,
            orderId: body.orderId,
            bankCode: body.bankCode,
            bankAccount: body.bankAccount,
            cardNumber: body.cardNumber,
            cvv: body.cvv,
            validThru: body.validThru,
            currency: body.currency,
            amount: body.amount,
            adminFee: body.adminFee,
            customerName: body.customerName,
            customerCountryCode: body.customerCountryCode,
            customerPhone: body.customerPhone,
            customerEmail: body.customerEmail,
            description: body.description,
            paymentRef: body.paymentRef,
            remark: body.remark,
            comment: body.comment,
            expiredTimeOrder: body.expiredTimeOrder,
        };
    }
}
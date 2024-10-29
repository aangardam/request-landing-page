interface GenerateAccessTokenBodyRequest {
    clientId:string
}

interface GenerateSignatureBodyRequest {
    merchantCode: string | null;
    orderId: string | null;
    expiredTimeOrder: number;
    bankCode: string | null;   
    bankAccount: string | null;
    cardNumber: number;    
    cvv: string | null;
    validThru: string | null;    
    currency: string | null;
    amount: number;    
    adminFee: number;
    customerName: string | null;    
    customerCountryCode: string | null;
    customerPhone: string | null;   
    customerEmail: string | null;
    description: string | null;
    paymentRef: string | null;
    remark: string | null;    
    comment: string | null;
    clientId?:string | null;
    accessToken?:string | null;
}

interface RequestLandingPageBodyRequest {
    merchantCode: string | null;
    orderId: string | null;
    expiredTimeOrder: number;
    bankCode: string | null;   
    bankAccount: string | null;
    cardNumber: number;    
    cvv: string | null;
    validThru: string | null;    
    currency: string | null;
    amount: number;    
    adminFee: number;
    customerName: string | null;    
    customerCountryCode: string | null;
    customerPhone: string | null;   
    customerEmail: string | null;
    description: string | null;
    paymentRef: string | null;
    remark: string | null;    
    comment: string | null;
    clientId?:string | null;
    accessToken?:string | null;
    signature?:string | null;
    timestamp?:string | null;
}
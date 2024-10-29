
import { LandingPageService } from "@/service/landing-page.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

export function useRequestLandingPage(){
    const generateToken = new LandingPageService()
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (body:RequestLandingPageBodyRequest) => await generateToken.requestLandingPage(body),
        onSuccess:(data)=>{
            if(!data || !data.success){
                const errorMessage = data?.message || "Request Landing Page Failed"
                toast({
                    title: 'Request Landing Page Failed',
                    description: errorMessage,
                    variant: 'destructive',
                })
                return;
            }

            queryClient.invalidateQueries({
                queryKey:['generate_access_token']
            })
        },
        onError:(error:any)=>{
            toast({
                title: 'Request Landing Page Failed',
                description: error?.response?.data?.responseMessage || 'An error occurred',
                variant: 'destructive',
            })
        }
    })
}
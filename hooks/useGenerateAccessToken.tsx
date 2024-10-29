
import { LandingPageService } from "@/service/landing-page.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";

export function useGenerateAccessToken(){
    const generateToken = new LandingPageService()
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (body:GenerateAccessTokenBodyRequest) => await generateToken.generateAccessToken(body),
        onSuccess:(data)=>{
            if(!data || !data.success){
                const errorMessage = data?.message || "Generate Access Token Failed"
                toast({
                    title: 'Generate Access Token Failed',
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
                title: 'Generate Access Token Failed',
                description: error?.response?.data?.responseMessage || 'An error occurred',
                variant: 'destructive',
            })
        }
    })
}
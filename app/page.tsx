'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useGenerateAccessToken } from "@/hooks/useGenerateAccessToken";
import { useGenerateSignature } from '@/hooks/useGenerateSignature'
import { useRequestLandingPage } from "@/hooks/useRequestLandingPage";

const formSchema = z.object({
  merchantCode: z.string().optional(),
  clientId: z.string().min(1, { message: "Client ID is Required" }),
  publicKey: z.string().min(1, { message: "Public Key is Required" }),
  expiredTimeOrder: z.number().min(1, { message: "Expired Time Order (seconds) is Required" }),
  orderId: z.string().min(1, { message: "Order ID is Required" }),
  bankCode: z.string().optional(),
  bankAccount: z.string().optional(),
  cardNumber: z.number().optional(),
  cvv: z.string().optional(),
  validThru: z.string().optional(),
  currency: z.string().min(1, { message: "Currency is Required" }),
  amount: z.number().min(1,{ message: "Amount must be positive" }),
  adminFee: z.number().nonnegative({ message: "Admin Fee must be non-negative" }),
  customerName: z.string().min(1, { message: "Customer Name is Required" }),
  customerCountryCode: z.string().min(1, { message: "Customer Country Code is Required" }),
  customerPhone: z.string().min(1, { message: "Customer Phone is Required" }),
  customerEmail: z.string().email({ message: "Invalid email address" }),
  description: z.string().optional(),
  paymentRef: z.string().optional(),
  remark: z.string().optional(),
  comment: z.string().optional(),
  openNewTab: z.string().optional(),
  runOnServer: z.string().optional(),
});

export default function RequestLandingPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      merchantCode:"MRCN001",
      clientId:"client-001",
      publicKey:"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBBAZhNllQfb2py0g5vn8KfGnO1JOScDnRpQ5aoG9iLg1xU/jXbJWpek6pW08bRGXwV9yapvAmToI5Op/SSPap5acCAwEAAQ==",
      expiredTimeOrder:300,
      orderId:"",
      bankCode:"",
      bankAccount:"",
      cardNumber:0,
      cvv:"",
      validThru:"",
      currency:"IDR",
      amount:12500,
      adminFee:0,
      customerName:"The Jack",
      customerCountryCode:"IDR",
      customerPhone:"+6281234567890",
      customerEmail:"asdp.itdevelopment@gmail.com",
      description:"Test Order",
      paymentRef:"-",
      remark:"-",
      comment:"-",
      openNewTab:"yes",
      runOnServer:"server",
    }
  })

  

  const { mutateAsync: generateAccessToken } = useGenerateAccessToken()
  const { mutateAsync: generateSignature } = useGenerateSignature()
  const { mutateAsync: reqLandingPage } = useRequestLandingPage()
  const [processLoading, setProcessLoading] = useState(false)
  const onSubmit = async(values:z.infer<typeof formSchema>)=>{
    setProcessLoading(true)
    // console.log(values)

    const bodyReqAccessToken = {
      clientId : values.clientId
    }
    const generateToken = await generateAccessToken(bodyReqAccessToken)
    if(!generateToken || !generateToken.data){
      return;
    }

    const accessToken = generateToken?.data
    // console.log('accessToken', accessToken.accessToken)
    const bodyReqGenerateSignatur = {
      merchantCode: values.merchantCode ?? '',
      orderId: values.orderId ?? '',
      bankCode: values.bankCode ?? '',
      bankAccount: values.bankAccount ?? '',
      cardNumber: values.cardNumber ?? 0,
      cvv: values.cvv ?? '',
      validThru: values.validThru ?? '',
      currency: values.currency ?? '',
      amount: values.amount ?? 0,
      adminFee: values.adminFee ?? 0,
      customerName: values.customerName ?? '',
      customerCountryCode: values.customerCountryCode ?? '',
      customerPhone: values.customerPhone ?? '',
      customerEmail: values.customerEmail ?? '',
      description: values.description ?? '',
      paymentRef: values.paymentRef ?? '',
      remark: values.remark ?? '',
      comment: values.comment ?? '',
      accessToken: accessToken.accessToken,
      clientId: values.clientId ?? '',
      expiredTimeOrder: values.expiredTimeOrder ?? '',
    }
    const generate = await generateSignature(bodyReqGenerateSignatur);
    if (!generate || !generate.data) {
      return;
    }

    const { signature, timestamp } = generate.data;
    // console.log('signature', signature)
    // console.log('timestamp', timestamp)
    const bodyReqLanidngPage = {
      ...bodyReqGenerateSignatur,
      signature,
      timestamp
    }
    const landingPage = await reqLandingPage(bodyReqLanidngPage) 
    if (!landingPage || !landingPage.data) {
      return;
    }
    const hash = landingPage?.data

    let url;
    if (values.runOnServer === 'alternatif') {
      url = `${process.env.NEXT_PUBLIC_URL_ALTERNATIF}${hash.hash}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_URL_SERVER}${hash.hash}`;
    }
   
    if(values.openNewTab == 'yes'){
      const width = 350;
      const height = 1113;
  
      // Calculate the position to center the window
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
  
      // Open the new window
      const newWindow = window.open(url, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
      const checkWindowClosed = setInterval(() => {
        if (newWindow?.closed) {
          clearInterval(checkWindowClosed);
          // Regenerate the order ID when the new window is closed
          form.setValue('orderId', generateOrderId());
        }
      }, 500);
    }else{
      window.location.href = url;
    }
    
    setProcessLoading(false)

  }

  useEffect(() => {
    const generateOrderId = () =>{
     const randomDigit = Math.floor(1000000000000 + Math.random() * 9000000000000);
     return `ORD${randomDigit}`
    };
 
    form.setValue('orderId', generateOrderId())
 
  }, [form]);

  const generateOrderId = () => {
    const randomDigit = Math.floor(1000000000000 + Math.random() * 9000000000000);
    return `ORD${randomDigit}`;
  };

  const choiceRunningApp = [
    {
      value: "yes",
      label: 'Yes, Open in new tab',
    },
    {
      value: "no",
      label: "No, Open in current tab",
    },
  ];


  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card className='w-full max-w-2xl shadow-lg'>
            <CardHeader>
              <CardTitle className="text-2xl">Request Landing Page</CardTitle>
              <CardDescription>Website to request landing page for payment processing</CardDescription>
            </CardHeader>
            <Tabs defaultValue='order' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='config'>Config</TabsTrigger>
                <TabsTrigger value='order'>Order</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[60vh] w-full rounded-md border">
                <CardContent className='p-4'>
                  <TabsContent value='config'>
                    <div className='space-y-4'>
                      <div className='grid grid-cols-1  gap-4'>
                        <div className='grid w-full items-center gap-1.5'>
                          <FormField 
                            control={form.control}
                            name='merchantCode'
                            render={({field})=>(
                              <FormItem>
                                <FormLabel> Merchant Code</FormLabel>
                                <FormControl>
                                <Input 
                                  type='text' 
                                  id="merchantCode" 
                                  placeholder='Merchant Code'
                                  {...field}
                                />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='grid w-full items-center gap-1.5'>
                          {/* <Label htmlFor="secretKey">Client ID</Label>
                          <Input 
                            type='text' 
                            id="clientId" 
                            name="clientId" 
                            placeholder='Client ID'
                          /> */}
                          <FormField
                            control={form.control}
                            name='clientId'
                            render={({field})=>(
                              <FormItem>
                                <FormLabel> Client Id</FormLabel>
                                <FormControl>
                                <Input 
                                  type='text' 
                                  id="clientId" 
                                  placeholder='Client ID'
                                  {...field}
                                />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className='grid w-full items-center gap-1.5'>
                          <FormField
                            control={form.control}
                            name='expiredTimeOrder'
                            render={({field})=>(
                              <FormItem>
                                <FormLabel> Expired Time</FormLabel>
                                <FormControl>
                                <Input 
                                  type='text' 
                                  id="expiredTimeOrder" 
                                  placeholder='Client ID'
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? Number(value) : 0);
                                  }}
                                />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className='grid w-full items-center gap-1.5'>
                          <FormField
                            control={form.control}
                            name="runOnServer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel> Run the application on the main domain or subdomain ?</FormLabel>
                                <FormControl>
                                  <Select {...field} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select URL option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="server">Domain</SelectItem>
                                      <SelectItem value="alternatif">Subdomain</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* <div className='grid w-full items-center gap-1.5'>
                          <FormField
                            control={form.control}
                            name="openNewTab"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel> Open in a new tab?</FormLabel>
                                <FormControl>
                                  <Select {...field} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Open New Tab ?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {choiceRunningApp.map((choice) => (
                                        <SelectItem key={choice.value} value={choice.value}>
                                          {choice.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div> */}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value='order'>
                    <div className='grid w-full items-center gap-1.5 md:col-span-2'>
                      <FormField
                        control={form.control}
                        name='orderId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Order Id</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="orderId" 
                                placeholder='Order Id' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                      
                      <FormField
                        control={form.control}
                        name='bankCode'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Code</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="bankCode" 
                                placeholder='Bank Code' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='bankAccount'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Account</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="bankAccount" 
                                placeholder='Bank Account' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='cardNumber'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="cardNumber" 
                                placeholder='Card Number' 
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value ? Number(value) : 0);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='cvv'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="cvv" 
                                placeholder='CVV' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='validThru'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valid Thru</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="validThru" 
                                placeholder='Valid Thru' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='currency'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="currency" 
                                placeholder='Currency' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='amount'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input 
                                type='number' 
                                id="amount" 
                                placeholder='Amount' 
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value ? Number(value) : 0);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='adminFee'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admin Fee</FormLabel>
                            <FormControl>
                              <Input 
                                type='number' 
                                id="adminFee" 
                                placeholder='Admin Fee' 
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value ? Number(value) : 0);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='customerName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer Name</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="customerName" 
                                placeholder='Customer Name' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='customerCountryCode'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer Country Code</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="customerCountryCode" 
                                placeholder='Customer Country Code' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='customerPhone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer Phone</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="customerPhone" 
                                placeholder='Customer Phone' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='customerEmail'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer Email</FormLabel>
                            <FormControl>
                              <Input 
                                type='text' 
                                id="customerEmail" 
                                placeholder='Customer Email' 
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className='grid w-full items-center gap-1.5 md:col-span-2'>
                        <FormField
                          control={form.control}
                          name='description'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  id="description" 
                                  placeholder="Description" 
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {['Payment Ref', 'Remark', 'Comment'].map((label) => (
                        <FormField
                          key={label}
                          control={form.control}
                          name={label.toLowerCase().replace(' ', '') as 'paymentRef' | 'remark' | 'comment'}
                          render={({ field }) => (
                            <FormItem className='grid w-full items-center gap-1.5 md:col-span-2'>
                              <FormLabel>{label}</FormLabel>
                              <FormControl>
                                <Input 
                                  type='text' 
                                  id={label.toLowerCase().replace(' ', '-')} 
                                  placeholder={label} 
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </TabsContent>

                </CardContent>
              </ScrollArea>
            </Tabs>
            <CardFooter className="flex justify-between mt-5">
              <Button
                disabled={processLoading}
                isLoading={processLoading}
              >Request Landing Page</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      
    </div>
  )
}
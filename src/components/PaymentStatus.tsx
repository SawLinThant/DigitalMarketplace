"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { api } from "~/trpc/react"

interface paymentProps {
    orderEmail: string
    orderId: string
    isPaid: boolean
}

const PaymentStatus = ({orderEmail,orderId,isPaid}:paymentProps) =>{
    const router = useRouter();
    const paidStatus = api.payment.pollOrderStatus.useQuery({
        orderId
    },
    {
        enabled: isPaid === false,//only query when isPaid is false
        refetchInterval: (data) =>(data?.isPaid?false:1000)
    }
)

   useEffect(() => {
    if(paidStatus?.data?.isPaid){
        router.refresh();
    }
   },[paidStatus.data?.isPaid])

    return(
        <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
            <div>
                <p className="font-medium text-gray-900">Shipping To</p>
                <p>{orderEmail}</p>
            </div>
            <div>
                <p className="font-medium text-gray-900">Order Status</p>
                <p>{isPaid?"Payment Successful":"Pending Payment"}</p>
            </div>
        </div>
    )
}
export default PaymentStatus
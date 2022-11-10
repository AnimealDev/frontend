import axios from 'axios'
import { useState, useEffect } from 'react'

const payment = () => {
    const [iframe, setIframe] = useState()

    useEffect(() => {
        axios.post('/api/ccavRequestHandler', {
            merchant_id: '1529688',
            amount: "1.00",
            order_id: '4334',
            currency: "INR",
            billing_name: "zed",
            billing_address: "panvel",
            billing_city: "mumbai",
            billing_state: "MH",
            billing_zip: '410206',
            billing_country: 'India',
            billing_tel: '8454015530',
            billing_email: 'zshake11@gmail.com',
            delivery_name: 'zed',
            delivery_address: "panvel",
            delivery_city: "mumbai",
            delivery_state: "MH",
            delivery_zip: '410206',
            delivery_country: 'India',
            delivery_tel: '8454015530',
            integration_type: 'iframe_normal',
            customer_identifier: '44870',
            redirect_url: '/api/ccavResponseHandler',
            cancel_url: '/api/ccavResponseHandler',
            language: 'EN'
        })
            .then(res => setIframe(res.data))
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: iframe }}>

            </div>
        </>
    )
}
export default payment
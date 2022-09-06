import Cookies from 'js-cookie';
import React, { useState, useContext, useEffect } from 'react'
//import { set } from 'react-hook-form';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

export default function PaymentScreen() {
    const router = useRouter();
    const [ selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { shippingAddress, paymentMedhod } = cart;
    const submitHandler = (e) => {
        e.preventDefault();
        if(!selectedPaymentMethod) {
            return toast.error('Payment method is required');
        }
        dispatch({type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod});
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                paymentMedhod: selectedPaymentMethod,
            })
        );
        router.push('/placeorder');
    }
    useEffect(() => {
        if(!shippingAddress.address) {
            return router.push('/shipping');
        }
        setSelectedPaymentMethod(paymentMedhod || '');
    },[paymentMedhod, router, shippingAddress.address] )
  return (
    <Layout title='Payment Method'>
        <CheckoutWizard activeStep={2}/>
        <form className='mx-auto max-w-screen-md' onSubmit={submitHandler} >
            <h1 className='mb-4 text-xl'>Payment Method</h1>
                {['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
                    <div key={payment} className="mb-4">
                        <input
                            type='radio'
                            name= 'paymentMethod'
                            id={payment}
                            className="p-2 outline-none focus:ring-0"
                            checked={selectedPaymentMethod === payment}
                            onChange={() => setSelectedPaymentMethod(payment)}
                        />
                        <label htmlFor={payment} className='p-2'>{payment}</label>
                    </div>
                ))}
                <div className='mb-4 flex justify-between'>
                    <button
                        onClick={() => router.push('/shipping')}
                        type='button'
                        className='default-button'
                    >Back</button>
                    <button className='primary-button'>Next</button>
                </div>
        </form>
    </Layout>
  )
}
PaymentScreen.auth = true;
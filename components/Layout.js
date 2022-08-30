import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Store } from '../utils/Store';
import { ToastContainer } from 'react-toastify';
import { useSession } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({children, title}) {
  const {status, data: session } = useSession()
  const {state, dispatch} = useContext(Store);
  const {cart} = state;
  const [ cartItemsCount, setCartItemsCount ] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a,c) => a + c.quantity, 0))
  
  }, [cart.cartItems])
  
  return (
    <div>
        <Head>
            <title>{title ? title + ' - TimLee' : 'TIMLEE'}</title>

        </Head>
        <ToastContainer position="bottom-center" limit={1} />
        <div className='flex min-h-screen flex-col justify-between'>
          <header>
            <nav className='flex h-12 items-center px-5 justify-between shadow-md'>
              <Link href='/'>
                <a className='text-lg font-bold'>Beauty Elements</a>
              </Link>
              <div>
                <Link href='/cart'><a className='px-4'>Cart
                    {cartItemsCount > 0 && (
                      <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                        {cartItemsCount}
                      </span>
                    )

                    }</a></Link>
             
                  {status === 'loading' ? (
                    'Loading'
                  ) : session?.user ? (
                      session.user.name
                  ) : (
                    <Link href="/login">
                      <a className='p-2'>Login</a>
                    </Link>
                  )
                  }
               
              </div>
            </nav>
          </header> 
          <main className='container m-auto mt-4 px-4'>{children}</main>
          <footer className='flex h-10 justify-center items-center shadow-inner'>Copyright 2022 Beauty Elements</footer>
        </div>
    </div>
  )
}

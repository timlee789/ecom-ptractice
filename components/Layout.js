import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({children, title}) {
  return (
    <div>
        <Head>
            <title>{title ? title + ' - TimLee' : 'TIMLEE'}</title>

        </Head>
        <div className='flex min-h-screen flex-col justify-between'>
          <header>
            <nav className='flex h-12 items-center px-5 justify-between shadow-md'>
              <Link href='/'>
                <a className='text-lg font-bold'>Beauty Elements</a>
              </Link>
              <div>
                <Link href='/cart'><a className='px-4'>Cart</a></Link>
                <Link href='/login'><a className='px-4'>Login</a></Link>
              </div>
            </nav>
          </header>
          <main className='container m-auto mt-4 px-4'>{children}</main>
          <footer className='flex h-10 justify-center items-center shadow-inner'>Copyright 2022 Beauty Elements</footer>
        </div>
    </div>
  )
}

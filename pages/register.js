import Link from 'next/link'
import React, { useEffect } from 'react'
import Layout from '../components/Layout';
import { appendErrors, useForm } from 'react-hook-form';
import {signIn, useSession} from 'next-auth/react';
import {getError} from '../utils/error';
import {toast} from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginScreen() {
    const { data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if(session?.user) {
            router.push(redirect || '/');
        }
    },[router, session, redirect]);

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm();

    const submitHandler = async ({name, email, password}) => {
       try {
        await axios.post('/api/auth/signup', {
            name, email, password
        })
         const result = await signIn('credentials', {
            redirect: false, email, password,
         });
         if(result.error) {
            toast.error(result.error);
         }
       } catch (err) {
        toast.error(getError(err));
        }
    }
      return (
    <Layout title="Register">
        <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
            <h1 className='mb-4 text-xl'>Register</h1>
            <div className='mb-4'>
                <label htmlFor='name'>Name</label>
                <input type="name" {...register('name', {required: 'Please enter name', })} 
                       className="w-full" id="name" autoFocus ></input>
            {errors.name && (<div className='text-red-500'>{errors.name.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor='email'>Email</label>
                <input type="email" {...register('email', {required: 'Please enter email', 
                pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z-_9]+.[a-zA-Z0-9-.]+$/i,                
                    message: 'Please enter valid email'
                }})} className="w-full" id="email" ></input>
                 {errors.email && (<div className='text-red-500'>{errors.email.message}</div>)}
            </div>
           
            <div className='mb-4'>
                <label htmlFor='password'>Password</label>
                <input type="password"  
                {...register('password',{
                    required: 'Please enter password',
                    minLength: {value: 6, message: "Password is more than 5 charts"},})}
                className="w-full" id="password" autoFocus></input>
                 {errors.password && (<div className='text-red-500'>{errors.password.message}</div>)}
            </div>
           


            <div className='mb-4'>
                <label htmlFor='confirmPassword'>confirm Password</label>
                <input type="confirmPassword"  
                {...register('confirmPassword',{
                    required: 'Please enter confirmPassword',
                    validate: (value) => value === getValues('password'),
                    minLength: {value: 6, message: "confirmPassword is more than 5 charts"},})}
                className="w-full" id="confirmPassword" autoFocus></input>
                 {errors.confirmPassword && (<div className='text-red-500'>{errors.confirmPassword.message}</div>)}
                 {errors.confirmPassword && errors.confirmPassword.type === 'validate' 
                && (<div className='text-red=500'>Passsword does not match</div>)}
            </div>
           
            <div className='mb-4'>
                <button className='primary-button'>Register</button>
            </div>
            <div className='mb-4'>
                Don&apos;t have an account? 
                <Link href={`/register ? redirect=${redirect || '/'}`}> Register </Link>
            </div>
        </form>
    </Layout>
  )
}

import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import Layout from '../components/Layout';

export default function ProfileScreen() {
    const { data: session } = useSession();
    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        formState: {error}
    } = useForm()

    useEffect(() => {
        setValue('name', session.user.name);
        setValue('email', session.user.email);
    }, [session.user, setValue]);
    const submitHandler = async ({name, password}) => {
        try {
            await axios.put('/api/auth/update', {
                name,
                email,
                password,
            });
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            toast.success('Profile updated successfully');
            if(result.error) {
                toast.error(result.error);
            }
        } catch (err) {
            toast.error(getError(err));
        }
    }
  return (
    <Layout title='Profile'>
         <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitHandler)}>
            <h1 className='mb-4 text-xl'>update Profile</h1>
            <div className='mb-4'>
                <label htmlFor='name'>Name</label>
                <input 
                    type="name" 
                    className="w-full" 
                    id="name" 
                    autoFocus
                    {...register('name', {required: 'Please enter name', })} 
                    ></input>
                    {errors.name && (<div className='text-red-500'>{errors.name.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor='email'>Email</label>
                <input 
                    type="email"  
                    className="w-full" 
                    id="email" 
                    {...register('email', {required: 'Please enter email', 
                    pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z-_9]+.[a-zA-Z0-9-.]+$/i, 
                               message: 'Please enter valid email'}})}    
                    ></input>
                    {errors.email && (<div className='text-red-500'>{errors.email.message}</div>)}
            </div>
           
            <div className='mb-4'>
                <label htmlFor='password'>Password</label>
                <input 
                    type="password"                 
                    className="w-full" 
                    id="password" 
                    {...register('password',{
                        required: 'Please enter password',
                        minLength: {value: 6, message: "Password is more than 5 charts"},})}
                    ></input>
                    {errors.password && (<div className='text-red-500'>{errors.password.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type='password'
                    className='w-full'
                    id="confirmPassword"
                    {...register('confirmPassword', {
                        validate: (value) => value === getValues('password'),
                        minLength: {
                            value: 2,
                            message: 'confirm password is more than 5 chars',
                        },
                    })}
                />
                {errors.confirmPassword && (
                    <div className='text-red-500'>
                        {errors.confirmPassword.message}
                    </div>
                )}
                {errors.confirmPassword && 
                 errors.confirmPassword.type === 'validate' && (
                    <div className='text-red-500'>Passsword do not match</div>
                 )
                }
            </div>
           
            <div className='mb-4'>
                <button className='primary-button'>Update Profile</button>
            </div>
        </form>
    </Layout>
  )
}
ProfileScreen.auth = true;
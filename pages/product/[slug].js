import React, { useContext } from 'react';
import {useRouter} from 'next/router'
import Layout from '../../components/Layout'
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductScreen({product}) {
    const { state, dispatch} = useContext(Store);
    const router = useRouter();
    // const {query} = useRouter();
    // const {slug} = query;
    // const product = data.products.find((x) => x.slug === slug);
    if(!product) {
        return <Layout title="Product Not Found">Product Not Found</Layout>
    }
    const addToCartHandler = async() => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${product._id}`)
        if(data.countInStock < quantity) {
            return toast.error('Sorry, Product is out of stock');
        }
        dispatch({type: 'CART_ADD_ITEM', payload: { ...product, quantity }})
    }
  return (
    <Layout title={product.name}>
        <div className='py-2'>
            <Link href='/' >Back to Home</Link>
        </div>
        <div className='grid md:grid-cols-4 md:gap-3'>
                <div className='md:col-span-2'>
                        <Image src={product.image} alt={product.name} width={640} height={800} Layout='responsive'></Image>
                </div>
                <div>
                    <ul>
                        <li><h1 className='text-lg'>{product.name}</h1></li>
                        <li>Category: {product.category}</li>    
                        <li>Brand: {product.brand}</li>
                        <li>{product.rating} of { product.numReviews} reviews</li>
                        <li>description: {product.description}</li>
                    </ul>
                </div>
                <div>
                    <div className='card p-5'>
                        <div className='mb-2 flex justify-between'>
                            <div>Price</div>
                            <div>${product.price}</div>
                        </div>
                        <div className='mb-2 flex justify-between'>
                            <div>Status</div>
                            <div>{product.countInStock > 0 ? 'In Sotck' : 'Unavailable'}</div>
                        </div>
                        <button className='primary-button w-full' onClick={addToCartHandler}>Add to Cart</button>
                    </div>
                </div>
        </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;
    await db.connect();
    const product = await Product.findOne({slug}).lean();
    await db.disconnect();
    return {
        props: {
            product: product ? db.convertDocToObj(product) : null,
        }
    }
}
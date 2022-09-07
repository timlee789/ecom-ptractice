import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout'
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
//import { ReactDOM } from 'react-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader;

//ReactDOM.render(<DemoCarousel />, document.querySelector('.demo-carousel'));
export default function ProductScreen({product}) {
    const unique_id = uuid()
    const { state, dispatch} = useContext(Store);
    const [ size, setSize] = useState('');
    //const router = useRouter();
    // const {query} = useRouter();
    // const {slug} = query;
    // const product = data.products.find((x) => x.slug === slug);
    if(!product) {
        return <Layout title="Product Not Found">Product Not Found</Layout>
    }
 
    const addToCartHandler = async() => {
        const existItem = state.cart.cartItems.find((x) => x.slug && x.size === product.slug && product.seleted);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${product._id}`)
        if(data.countInStock < quantity) {
            return toast.error('Sorry, Product is out of stock');
        }
        console.log(unique_id)
        dispatch({type: 'CART_ADD_ITEM', payload: { ...product, quantity, size, unique_id }})
    }
    const options = [
        {value: '', text: ' --Chose Your Size--'},
        {value: 'xsmall', text: 'XSmall'},
        {value: 'small', text: 'Small'},
        {value: 'medium', text: 'Medium'},
        {value: 'large', text: 'Large'},
        {value: 'xlarge', text: 'XLarge'},
        {value: '2xlarge', text: '2XLarge'},
    ];
    const  handleChange = (event) => {
        setSize(event.target.value);
    }
    const selectSize = () => {
        return toast.error('Select Size')
    }
  return (
    <Layout title={product.name}>
        <div className='py-2'>
            <Link href='/' >Back to Home</Link>
        </div>
        <div className='grid md:grid-cols-4 md:gap-3'>
                <div className='md:col-span-2'>
         
            {<Carousel showArrows={true} showThumbs={true}>
                <div>
                    <img src={product.image} alt={product.name} width={640} height={800} layout='responsive'/>
                </div>
                <div>
                    <img src={product.image2} alt={product.name} width={640} height={800} layout='responsive'/>
                </div>
                <div>
                    <img src={product.image3} alt={product.name} width={640} height={800} layout='responsive'/>
                </div>
                <div>
                    <img src={product.image4} alt={product.name} width={640} height={800} layout='responsive'/>
                </div>
                <div>
                    <img src={product.image5} alt={product.name} width={640} height={800} layout='responsive'/>
                </div>
               
                
               
            </Carousel>}
                       
                </div>
                <div className='mx-auto'>
                    <ul>
                        <li><h1 className='text-2xl mb-5'>{product.name}</h1></li>
                        <li className='text-lg mb-2'>{product.rating} of { product.numReviews} reviews</li>
                        <li className='text-lg mb-2'>Category: {product.category}</li>    
                        <li className='text-lg mb-2'>Brand: {product.brand}</li>
                        <li className='text-lg mb-2'>description: {product.description}</li>
                        <li>
                        </li>
                    </ul>
               
                  <select value={size} onChange={handleChange} className='my-10'>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.text}
                        </option>
                    ))}
                  </select>
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
                        <button className='primary-button w-full' onClick={size ? addToCartHandler : selectSize}>Add to Cart</button>
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
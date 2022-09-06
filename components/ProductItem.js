import React from 'react';
import Link from "next/link";
import Image from 'next/image'


export default function ProductItem({product, addToCartHandler}) {
   
  return (
    <div className='card'>
        <Link href={`/product/${product.slug}`}>
            <a>           
                <div>
                    <Image src={product.image} alt={product.name} width={640} height={800} className='rounded-shadow w-96'/>
                </div>          
            </a>
        </Link>
        <div className='flex flex-col items-center justify-center p-5'>
            <Link href={`/product/${product.slug}`}>
                <a><h2 className='text-lg'>{product.name}</h2></a>
            </Link>
            <p className='mb-2'>{product.brand}</p>
            <p>${product.price}</p>
            <button className='primary-button' type='button' onClick={() => addToCartHandler(product)}>Add to Cart</button>
        </div>
    </div>
  )
}

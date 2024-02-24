import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
    product: Product;
}

const ProductCard = ({product}: Props) => {
  return (
    <Link href={`/${product._id}`} className='product-card'>
        <div className="product-card_img-container">
            {/* <div className='w-full flex justify-between'><span className="text-blue-500">Link placeholder</span><button className='z-20'>Refresh</button></div> */}
            <Image
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
                className='product-card_img'
            />
        </div>
        <div className='flex flex-col gap-3'>
            <h3 className='product-title'>{product.title}</h3>
            <div className='flex justify-center'>
                {/* <p className='text-black opacity-50 text-lg capitalize'>{product.category}</p> */}
                <p className='text-black text-xl opacity-30'>Current Price: </p>
                <p className='text-black text-xl font-semibold'>
                    <span>{product?.currentPrice}</span>
                    <span>{product?.currency}</span>
                </p>
            </div>
        </div>
        </Link>
  )
}

export default ProductCard
"use client"
// whatever breaks use client its after the products are mapped.
// Too many things are passed into the Products because of priceHistory.

// grupowanie produktow statycznych z use client
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import moreIcon from "../public/assets/icons/more.png"

interface Props {
    title: Product["title"];
    price: Product["currentPrice"];
    currency: Product["currency"];
    url: Product["url"];
    image: Product["image"];
    productRouteID: Product["_id"]
    isGrouped?: boolean;
}

const ProductCard = ({ title, price, url, currency, image, productRouteID, isGrouped = false }: Props) => {

    return (
        <div className='product-wrapper'>
            {/* More icon for options */}
            <Image className='w-4 h-4 cursor-pointer' src={moreIcon} alt='more' />

            {/* Link to the product page */}
            <Link href={`/${productRouteID}`} className={`${isGrouped ? 'grouped-card' : 'product-card'}`}>
                <div className="product-card_img-container">
                    <Image
                        src={image}
                        alt={title}
                        width={isGrouped ? 80 : 200} // Small image if in grouped section
                        height={isGrouped ? 80 : 200}
                        className={`product-card_img ${isGrouped ? 'grouped-img' : ''}`}
                    />
                </div>
                <div className={`flex flex-col gap-1 ${isGrouped ? 'text-sm' : ''}`}>
                    <h3 className="product-title">{title}</h3>
                    <div className="flex justify-center">
                        <p className="text-black text-lg opacity-30">Current Price: </p>
                        <p className="text-black text-lg font-semibold">
                            <span>{price}</span>
                            <span>{currency}</span>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
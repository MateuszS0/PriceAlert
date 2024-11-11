import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
    product: Product;
    isGrouped?: boolean;
}

const ProductCard = ({ product, isGrouped = false }: Props) => {
    return (
        <Link href={`/${product._id}`} className={`${isGrouped ? 'grouped-card' : 'product-card'}`}>
            <div className="product-card_img-container">
                <Image
                    src={product.image}
                    alt={product.title}
                    width={isGrouped ? 80 : 200} // Small image if in grouped section
                    height={isGrouped ? 80 : 200}
                    className={`product-card_img ${isGrouped ? 'grouped-img' : ''}`}
                />
            </div>
            <div className={`flex flex-col gap-1 ${isGrouped ? 'text-sm' : ''}`}> {/* Small text for grouped */}
                <h3 className="product-title">{product.title}</h3>

                <div className="flex justify-center">
                    <p className="text-black text-lg opacity-30">Current Price: </p>
                    <p className="text-black text-lg font-semibold">
                        <span>{product.currentPrice}</span>
                        <span>{product.currency}</span>
                    </p>
                </div>

            </div>
        </Link>
    )
}

export default ProductCard
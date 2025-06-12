import { getProductById } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { formatNumber } from '@/lib/utils';
import PriceInfoCard from '@/components/ProductPriceCard';
import { redirect } from "next/navigation";

type Props = {
  params: { id: string }
}
const ProductDetails = async ({ params: { id } }: Props) => {
  const product = await getProductById(id);

  if (!product) redirect('/');

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
          <div className="relative group">
            <Image
              src={product.image}
              alt={product.title}
              width={580}
              height={400}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <Link
              href={product.url}
              target="_blank"
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full 
                         shadow-lg hover:bg-primary hover:text-white transition-colors duration-200"> Visit Store</Link>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {product.title}
            </h1>
            <div className="flex items-end gap-4">
              <p className="text-4xl font-bold text-primary">
                {formatNumber(product.currentPrice)} {product.currency}
              </p>
              {product.originalPrice > product.currentPrice && (
                <p className="text-xl text-gray-400 line-through mb-1">
                  {formatNumber(product.originalPrice)} {product.currency}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-8">
            <PriceInfoCard
              title="Lowest Price"
              iconSrc="/assets/icons/arrow-down.svg"
              value={`${formatNumber(product.lowestPrice)} ${product.currency}`}
              borderColor="#4CAF50"
            />
            <PriceInfoCard
              title="Highest Price"
              iconSrc="/assets/icons/arrow-up.svg"
              value={`${formatNumber(product.highestPrice)} ${product.currency}`}
              borderColor="#FF5252"
            />
            <PriceInfoCard
              title="Average Price"
              iconSrc="/assets/icons/chart.svg"
              value={`${formatNumber(product.averagePrice)} ${product.currency}`}
              borderColor="#2196F3"
            />
            <PriceInfoCard
              title="Current Price"
              iconSrc="/assets/icons/price-tag.svg"
              value={`${formatNumber(product.currentPrice)} ${product.currency}`}
              borderColor="#FFC107"
            />
          </div>

          <Link
            href={product.url}
            target="_blank"
            className="bg-primary text-white py-4 px-8 rounded-xl flex items-center justify-center gap-2 
                       hover:bg-primary/90 transition-colors duration-200 shadow-lg">
            <Image
              src="/assets/icons/bag.svg"
              alt="buy"
              width={24}
              height={24}
            />
            <span className="font-semibold">Buy Now</span>
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6"> Product Description</h2>
        <div className="prose max-w-none text-gray-600">
          {product?.description?.split('\n')}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
import React from 'react'
import Image from 'next/image'
import Searchbar from '@/components/Searchbar'
import HCarousel from '@/components/HCarousel'
import { getAllProducts } from '@/lib/actions'
import ProductCard from '@/components/M-ProductCard'


const Home = async () => {

  const allProducts = await getAllProducts();

  return (
    <>
      <section className='px-6 md:px-16 py-1'>
        <div className="flex max-xl:flex-col">
          <div className="flex flex-col justify-center">

            <h1 className='head-text py-1'>
              Welcome to
              Price<span className='text-primary'>Alert</span>
            </h1>
            <p className='small-text'>Track prices for your products:
              <Image
                src="assets/icons/arrow-right.svg"
                alt='arrow-right'
                width={16}
                height={16}
              />
            </p>
            <p className='mt-6'>Enter amazon product URL to track it:</p>

            <Searchbar />
          </div>
          <HCarousel />
        </div>
      </section>
      <section className="groups-section">
        <h2 className="section-text">Your Groups</h2>
        <div className='groups-wrapper flex flex-row gap-16 justify-evenly'>
          <div className='group-wrapper flex flex-wrap gap-2 max-w-[400px]'>
            <div className='group-name-price'>
              <h3 className='font-bold'>Group 1</h3>
              {/* placeholder groupname until we map through products for groups */}
              <h3>
                Lowest price:{" "}
                {allProducts?.length
                  ? Math.min(...allProducts.slice(0, 4).map((product) => product.currentPrice)) : "N/A"}
              </h3>
            </div>
            <div className="grouped-items flex flex-wrap gap-2 max-w-[400px]">
              {allProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} isGrouped />
              ))}
            </div>
          </div>


          <div className='group-wrapper flex flex-wrap gap-2 max-w-[400px]'>
            <div className='group-name-price'>
              <h3 className='font-bold'>Group 2</h3>
              <h3>
                Lowest price:{" "}
                {allProducts?.length
                  ? Math.min(...allProducts.slice(4, 8).map((product) => product.currentPrice)) : "N/A"}
              </h3>
            </div>
            <div className="grouped-items flex flex-wrap gap-2 max-w-[400px]">
              {allProducts?.slice(4, 8).map((product) => (
                <ProductCard key={product._id} product={product} isGrouped />
              ))}
            </div>
          </div>

          <div className='group-wrapper flex flex-wrap gap-2 max-w-[400px]'>
            <div className='group-name-price'>
              <h3 className='font-bold'>Group 3</h3>
              <h3>
                Lowest price:{" "}
                {allProducts?.length
                  ? Math.min(...allProducts.slice(7, 10).map((product) => product.currentPrice)) : "N/A"}
              </h3>
            </div>
            <div className="grouped-items flex flex-wrap gap-2 max-w-[400px]">
              {allProducts?.slice(7, 10).map((product) => (
                <ProductCard key={product._id} product={product} isGrouped />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="products-section">
        <h2 className="section-text">Your Products</h2>
        <div className="standard-layout flex flex-wrap gap-4">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
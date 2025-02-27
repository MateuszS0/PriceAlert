import React from 'react'
import Image from 'next/image'
import Searchbar from '@/components/Searchbar'
import HCarousel from '@/components/HCarousel'
import { getAllProducts } from '@/lib/actions'
import ProductCard from '@/components/M-ProductCard'


const Home = async () => {
  const allProducts = await getAllProducts();
  const groups = Array.from(new Set(allProducts?.filter(product => product.group !== 0).map(product => product.group)));

  const nextGroupNumber = groups.length > 0 ? Math.max(...groups) + 1 : 1;
  groups.push(nextGroupNumber);

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
          {groups.map(group => (
            <div key={group} className='group-wrapper'>
              <div className='group-name-price'>
                <h3 className='font-bold'>Group {group}</h3>
                <h3>
                  Lowest price:{" "}
                  {allProducts?.length
                    ? Math.min(...allProducts.filter(product => product.group === group).map(product => product.currentPrice)) : "N/A"}
                </h3>
              </div>
              <div className="grouped-items">
                {allProducts?.filter(product => product.group === group).map(product => (
                  <ProductCard
                    key={product._id}
                    productRouteID={product._id}
                    title={product.title}
                    price={product.currentPrice}
                    currency={product.currency}
                    url={product.url}
                    image={product.image}
                    isGrouped
                    group={product.group}
                    availableGroups={groups}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="products-section">
        <h2 className="section-text">Your Products</h2>
        <div className="standard-layout flex flex-wrap gap-4">
          {allProducts?.filter(product => product.group == 0).map((product) => {
            return (
              <ProductCard
                key={product._id}
                productRouteID={product._id}
                title={product.title}
                price={product.currentPrice}
                currency={product.currency}
                url={product.url}
                image={product.image}
                group={product.group}
                availableGroups={groups}
              />
            );
          })}
        </div>
      </section>
    </>
  )
}

export default Home
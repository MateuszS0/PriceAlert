import React from 'react'
import Searchbar from '@/components/Searchbar'
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
          <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">

            <h1 className='text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-500 to-primary bg-clip-text text-transparent'>
              Welcome to PriceAlert
            </h1>
            <p className='text-xl text-gray-600 mb-6 max-w-2xl mx-auto'>Track prices for your Products, and group them together to get the best deals!</p>
            <p className='text-gray-700 mb-4' >Paste in Amazon or eBay product URL to track it:</p>
            <div className='w-[100%]'>
              <Searchbar />
            </div>
          </div>
        </div>
      </section>

      <section className="groups-section">
        <h2 className="section-text">Your Groups</h2>
        <div className='groups-wrapper flex flex-row gap-16 justify-evenly'>
          {groups.map(group => (
            <div key={group} className='group-wrapper py-8'>
              <div className='group-name-price mb-4 '>
                <h3 className='text-xl font-semibold text-gray-900'>Group {group}</h3>
                <div className="px-3 py-1 bg-green-50 rounded-full">
                  <h3 className="text-sm text-green-600 font-medium">
                    Lowest price:{" "}
                    {allProducts?.length
                      ? Math.min(...allProducts.filter(product => product.group === group).map(product => product.currentPrice)) : "N/A"}
                  </h3>
                </div>
              </div>
              <div className="grouped-items p-4 grid grid-cols-2 gap-3">
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Products</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {allProducts?.filter(product => product.group === 0).length} items
            </span>
            <button className="px-4 py-2 text-primary hover:text-white border border-primary hover:bg-primary rounded-lg transition-colors duration-200">
              View All →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts?.filter(product => product.group === 0).map((product) => (
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
          ))}
        </div>

        {allProducts?.filter(product => product.group === 0).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No ungrouped products found</p>
            <p className="text-sm text-gray-400 mt-2">Products you add will appear here</p>
          </div>
        )}
      </section>
    </>
  )
}

export default Home
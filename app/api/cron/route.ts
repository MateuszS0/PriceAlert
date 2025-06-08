import { NextResponse } from "next/server";
import { getLowestPrice, getHighestPrice, getAveragePrice } from "@/lib/utils";
import { connectToDB } from "@/lib/scraper/mongoose";
import Product from "@/models/productSchemaMongoose";
import { scrapeAmazonProduct } from "@/lib/scraper/scraperAmazon";
import { scraperFactory } from "@/lib/scraper/scraperFactory";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    connectToDB();

    const products = await Product.find({});

    if (!products) throw new Error("No product fetched");

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        // Use scraperFactory to select the scraper dynamically
        const scraper = scraperFactory(currentProduct.url);

        const scrapedProduct = await scraper(currentProduct.url);

        if (!scrapedProduct) return;

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          {
            price: scrapedProduct.currentPrice,
          },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        // Update the product in the database
        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product
        );

        return updatedProduct;
      })
    );

    // Return a successful response
    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}
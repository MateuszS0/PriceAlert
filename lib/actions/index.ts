"use server"
import { revalidatePath } from "next/cache";
import Product from "@/models/productSchemaMongoose";
import { connectToDB } from "../scraper/mongoose";
import { scrapeAmazonProduct } from "../scraper/scraperAmazon";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { scraperFactory } from "../scraper/scraperFactory";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDB();

    const scraper = scraperFactory(productUrl);
    const scrapedProduct = await scraper(productUrl);

    if (scrapedProduct.isOutOfStock) {
      console.log("Product is out of stock");
      return;
    }

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    console.log('Scraped Product:', scrapedProduct);
    console.log('Existing Product:', existingProduct);
    // console.log('Product:', product);

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function updateProductGroup(productId: string, newGroup: number) {
  try {
    await connectToDB();

    const result = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: { group: newGroup } },
      { new: true }
    );

    if (!result) {
      throw new Error('Product not found');
    }

    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update product group: ${error}`);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}
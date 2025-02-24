"use server"

import { revalidatePath } from "next/cache";
import Product from "@/models/product.model";
import { connectToDB } from "../scraper/mongoose";
import { scrapeAmazonProduct } from "../scraper/scraperAmazon";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
// import { generateEmailBody, sendEmail } from "../nodemailer";
import { User } from '../../types/index';
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

    // const scrapedProduct = await scrapeAmazonProduct(productUrl);

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

// export async function manuallyUpdateProduct(productId: string) {
//   try {
//     connectToDB();

//     const product = await Product.findOne({ _id: productId });

//     if (!product) {
//       console.log("Product not found");
//       return null;
//     }

//     // Scrape updated information from Amazon using the product's URL
//     const scrapedProduct = await scrapeAmazonProduct(product.url);

//     if (!scrapedProduct) {
//       console.log("Failed to scrape updated information from Amazon");
//       return null;
//     }

//     // Update the product with the newly scraped info
//     const updatedProduct = {
//       ...scrapedProduct,
//       priceHistory: [
//         ...product.priceHistory,
//         { price: scrapedProduct.currentPrice },
//       ],
//       lowestPrice: getLowestPrice([...product.priceHistory, { price: scrapedProduct.currentPrice }]),
//       highestPrice: getHighestPrice([...product.priceHistory, { price: scrapedProduct.currentPrice }]),
//       averagePrice: getAveragePrice([...product.priceHistory, { price: scrapedProduct.currentPrice }]),
//     };

//     // Update the product in the database
//     const updatedProductInDB = await Product.findOneAndUpdate(
//       { _id: productId },
//       updatedProduct,
//       { new: true }
//     );

//     console.log("Updated product:", updatedProductInDB);

//     return updatedProductInDB;

//   } catch (error: any) {
//     console.log("Failed to update:", error.message);
//     throw new Error(`Failed to update product: ${error.message}`);
//   }
// }

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

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId }, //not equal to productId
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}
// export async function addUserEmailToProduct(productId: string, userEmail: string) {
//   try {
//     const product = await Product.findById(productId);

//     if (!product) return;

//     const userExists = product.users.some((user: User) => user.email === userEmail);

//     if (!userExists) {
//       product.users.push({ email: userEmail });

//       await product.save();

//       const emailContent = await generateEmailBody(product, "WELCOME");

//       await sendEmail(emailContent, [userEmail]);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
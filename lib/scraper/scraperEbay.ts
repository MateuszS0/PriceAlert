"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeEbayProduct(url: string) {
    if (!url) return;

    // BrightData proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = String(process.env.BRIGHT_DATA_PORT);
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try {
        console.log("url: " + url);
        // Fetch the product page
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);

        console.log("parsed response: " + $);


        // Extract the product title
        const title = $(".x-item-title").text().trim();
        console.log("ebay title:" + title);

        const currentPrice = extractPrice(
            $(".x-price-primary"),
            $("span.ux-textspans").first()
        );
        console.log("Price: " + currentPrice);


        const originalPrice = currentPrice;
        console.log("original price: " + originalPrice);

        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const image =
            $('.ux-image-carousel-item img').attr('data-zoom-src') ||
            '{}'
        console.log("img: " + image);


        // const imageUrls = Object.keys(JSON.parse(images));

        const currency = $(".x-price-primary").text().trim().split(' ')
            .find(part => /^[^\d.,]+$/.test(part)); //finds part without numbers, commas and dots
        console.log("curr: " + currency);

        // const discountRate = $('.savings').text().replace(/[-%]/g, "");

        // const description = extractDescription($)

        // Construct data object with scraped information
        const data = {
            url,
            currency: currency || 'zl',
            image: image,
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            // discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            // description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
        }
        // for testing, comment data (wont be uploaded to database)
        return data;
    } catch (error: any) {
        console.log(error);
    }
}
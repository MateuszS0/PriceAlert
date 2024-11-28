import { scrapeAmazonProduct } from "./scraperAmazon";
import { scrapeEbayProduct } from "./scraperEbay";

type ScraperFunction = (url: string) => Promise<any>;

export const scraperFactory = (url: string): ScraperFunction => {
    if (url.includes("amazon")) {
        console.log("Its amazon product.");
        return scrapeAmazonProduct;
    } else if (url.includes("ebay")) {
        console.log("Its ebay product.");
        return scrapeEbayProduct;
    } else {
        throw new Error("Unsupported shop URL");
    }
};
"use client"

import { scrapeAndStoreProduct } from "@/lib/actions"
import { FormEvent, useState } from "react"
const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url)
    const hostname = parsedURL.hostname 
    if(hostname.includes("amazon.com") || 
    hostname.includes("www.amazon.") || 
    hostname.endsWith("amazon")) {
      return true;
  }} catch (error) {
    return false;
  }
  return false;
}

const Searchbar = () => {
  const [searchPrompt, SetsearchPrompt] = useState('');
  const [isLoading, SetisLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLink = isValidAmazonProductURL(searchPrompt);
    if (!isValidLink) return alert("Provide a valid URL");
    try {
      SetisLoading(true)
      //Scrape products from amazon
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
      
    } finally {
      SetisLoading(false)
    }
  }
  
  return (
    <form className='flex flex-wrap gap-4 m4-12' onSubmit={handleSubmit}>
      <input type="text"
      value={searchPrompt}
      onChange={(e)=> {
        SetsearchPrompt(e.target.value)
        
      }}
      placeholder="Enter product link"
      className="searchbar-input" />
      <button 
      type="submit" 
      className="searchbar-btn"
      disabled = {searchPrompt === '' }
      >{isLoading ? 'Searching...' : 'Search'}
      </button>


    </form>
  )
}

export default Searchbar
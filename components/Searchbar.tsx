"use client"
import { scrapeAndStoreProduct } from "@/lib/actions"
import { FormEvent, useState } from "react"
const isValidProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url)
    const hostname = parsedURL.hostname
    if (hostname.includes("amazon.com") || hostname.includes("www.amazon.") || hostname.endsWith("amazon") ||
      (hostname.includes("ebay.pl") || hostname.includes("www.ebay.") || hostname.endsWith("ebay"))
    ) {
      console.log("host name: " + hostname);
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

const Searchbar = () => {
  const [searchPrompt, SetsearchPrompt] = useState('');
  const [isLoading, SetisLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const isValidLink = isValidProductURL(searchPrompt);
    if (!isValidLink) {
      setError('Please provide a valid Amazon or eBay URL');
      return;
    }
    try {
      SetisLoading(true)
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
      setError('An error occurred while processing your request');
    } finally {
      SetisLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="text-red-500 text-sm mb-2 font-medium">
          {error}
        </div>
      )}
      <form className='flex flex-wrap gap-4 m4-12' onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchPrompt}
          onChange={(e) => {
            SetsearchPrompt(e.target.value);
            setError('');
          }}
          placeholder="Enter product link"
          className={`searchbar-input ${error ? 'border-red-500' : ''}`}
        />
        <button
          type="submit"
          className="searchbar-btn"
          disabled={searchPrompt === ''}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  )
}

export default Searchbar
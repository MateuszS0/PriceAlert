export type PriceHistoryItem = {
  price: number;

};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  group: number;
  reviewsCount: number;
  stars: number;
  isOutOfStock: Boolean;
};
"use client"
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import moreIcon from "../public/assets/icons/more.png";

interface Props {
    title: Product["title"];
    price: Product["currentPrice"];
    currency: Product["currency"];
    url: Product["url"];
    image: Product["image"];
    productRouteID: Product["_id"];
    isGrouped?: boolean;
    group: number;
    availableGroups: number[];
}

const ProductCard = ({ title, price, url, currency, image, productRouteID, isGrouped = false, availableGroups }: Props) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [moveToVisible, setMoveToVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownVisible(false);
            setMoveToVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMoveToHover = () => {
        setMoveToVisible(true);
    };

    const handleMoveToLeave = () => {
        setMoveToVisible(false);
    };

    const handleMoveToGroup = async (newGroup: number) => {
        console.log(`Attempting to move to group: ${newGroup} for product: ${productRouteID}`);

        try {
            const response = await fetch("/api/groupapi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: productRouteID, newGroup }),
            });

            if (!response.ok) {
                console.error("Failed to update group:", response.status, response.statusText);
                const errorData = await response.text();
                console.error("Server Response:", errorData);
                return;
            }

            const data = await response.json();
            console.log("API Response:", data);

            setDropdownVisible(false);
            setMoveToVisible(false);

            // Refresh to show updated groups
            window.location.reload();
        } catch (error) {
            console.error("Error updating group:", error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await fetch("/api/groupapi", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: productRouteID }),
            });

            if (!response.ok) {
                console.error("Failed to delete product:", response.status, response.statusText);
                const errorData = await response.text();
                console.error("Server Response:", errorData);
                return;
            }

            const data = await response.json();
            console.log("Product deleted successfully:", data);
            // Refresh the page to show updated list
            window.location.reload();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className='product-wrapper'>
            <div className='relative'>
                <Image className='w-4 h-4 cursor-pointer' src={moreIcon} alt='more' onClick={toggleDropdown} />
                {dropdownVisible && (
                    <div ref={dropdownRef} className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50'>
                        <ul>
                            <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer relative'
                                onMouseEnter={handleMoveToHover}
                                onMouseLeave={handleMoveToLeave}>
                                Move to
                                {moveToVisible && (
                                    <ul className='absolute left-full top-0 mt-0 w-48 bg-white border border-gray-200 rounded shadow-lg z-50'>
                                        {availableGroups.map(group => (
                                            <li key={group} className='px-4 py-2 hover:bg-gray-100 cursor-pointer' onClick={() => handleMoveToGroup(group)}>
                                                Group {group}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                            <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer' onClick={handleDelete}>Delete</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Link to the product page */}
            <Link href={`/${productRouteID}`} className={`${isGrouped ? 'grouped-card' : 'product-card'}`}>
                <div className="product-card_img-container">
                    <Image
                        src={image}
                        alt={title}
                        width={isGrouped ? 80 : 200} // Small image if in grouped section
                        height={isGrouped ? 80 : 200}
                        className={`product-card_img ${isGrouped ? 'grouped-img' : ''}`}
                    />
                </div>
                <div className={`flex flex-col gap-1 ${isGrouped ? 'text-sm' : ''}`}>
                    <h3 className="product-title">{title}</h3>
                    <div className="flex justify-center">
                        <p className="text-black text-lg opacity-30">Current Price: </p>
                        <p className="text-black text-lg font-semibold">
                            <span>{price}</span>
                            <span>{currency}</span>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
// src/hooks/useCart.ts
import { useState } from 'react';
import { Product } from '../types'; // Assuming you have a Product type

export const useCart = () => {
    const [cartItems, setCartItems] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        console.log(`Adding ${product.name} to cart.`);
        // Logic to add item to cart will go here
        setCartItems(prevItems => [...prevItems, product]);
    };

    const removeFromCart = (productId: string) => {
        console.log(`Removing product ${productId} from cart.`);
        // Logic to remove item will go here
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    return { cartItems, addToCart, removeFromCart };
};
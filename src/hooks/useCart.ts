import { useState, useEffect } from 'react';
import { Product, BasketItem } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { cartService } from '@/services/api';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<BasketItem[]>([]);
  const { sessionId } = useAuth(); // Get the session ID from the auth context

  // This effect fetches the cart from the backend when the session ID becomes available.
  // This ensures the cart persists across page reloads.
  useEffect(() => {
    if (sessionId) {
      const fetchCart = async () => {
        try {
          const response = await cartService.getCart(sessionId);
          if (response.data) {
            setCartItems(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      };
      fetchCart();
    }
  }, [sessionId]);

  const addToCart = async (product: Product) => {
    if (!sessionId) {
      console.error("No session available to add item to cart.");
      return;
    }

    // This is an "optimistic update". The UI updates instantly.
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const newBasketItem: BasketItem = {
        id: product.productId,
        name: product.name,
        price: product.mrpPrice,
        image: product.image,
        quantity: 1,
        category: product.category,
        discounts: product.discounts,
      };
      return [...prevItems, newBasketItem];
    });

    // Send the update to the backend in the background.
    try {
      await cartService.addToCart(sessionId, {
        productId: product.productId,
        quantity: 1,
      });
    } catch (error) {
      console.error("Failed to sync addToCart with backend:", error);
      // Here you could add logic to revert the optimistic update if the API call fails.
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!sessionId) return;
    
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

    try {
      // Assumes a removeFromCart method exists in your cartService
      await cartService.removeFromCart(sessionId, productId);
    } catch (error) {
      console.error("Failed to sync removeFromCart with backend:", error);
    }
  };
  
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!sessionId) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
    
    try {
        // Assumes an updateItemQuantity method exists in your cartService
        await cartService.updateItemQuantity(sessionId, productId, quantity);
    } catch (error) {
        console.error("Failed to sync updateQuantity with backend:", error);
    }
  };

  const clearCart = async () => {
    if (!sessionId) return;
    
    setCartItems([]);

    try {
        // Assumes a clearCart method exists in your cartService
        await cartService.clearCart(sessionId);
    } catch(error) {
        console.error("Failed to sync clearCart with backend:", error);
    }
  };

  return { 
    cartItems, 
    addToCart, 
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
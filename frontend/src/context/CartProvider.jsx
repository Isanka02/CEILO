import React, { useState, useEffect, useCallback } from 'react';
import CartContext from './CartContext';

// Returns a storage key scoped to the currently logged-in user.
// Falls back to 'ceilo_cart_guest' so guests still get a working cart.
const getCartKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?._id ? `ceilo_cart_${user._id}` : 'ceilo_cart_guest';
  } catch {
    return 'ceilo_cart_guest';
  }
};

const loadCart = () => {
  try {
    const stored = localStorage.getItem(getCartKey());
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  // Persist to the correct per-user key whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    } catch { /* ignore */ }
  }, [cartItems]);

  // Re-load the correct cart when the user changes (login / logout / switch).
  // login.jsx and register.jsx dispatch a synthetic 'storage' event with
  // key === 'user' so this fires in the same tab too.
  useEffect(() => {
    const handleUserChange = (e) => {
      if (e.key === 'user') {
        try {
          const stored = localStorage.getItem(getCartKey());
          setCartItems(stored ? JSON.parse(stored) : []);
        } catch {
          setCartItems([]);
        }
      }
    };
    window.addEventListener('storage', handleUserChange);
    return () => window.removeEventListener('storage', handleUserChange);
  }, []);

  const addToCart = (item, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(
        i => i._id === item._id && i.color === item.color && i.size === item.size
      );
      if (existing) {
        return prev.map(i =>
          i._id === item._id && i.color === item.color && i.size === item.size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id, color, size) => {
    setCartItems(prev =>
      prev.filter(i => !(i._id === id && i.color === color && i.size === size))
    );
  };

  const updateQuantity = (id, color, size, quantity) => {
    if (quantity < 1) { removeFromCart(id, color, size); return; }
    setCartItems(prev =>
      prev.map(i =>
        i._id === id && i.color === color && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  // Clears in-memory state AND removes the localStorage entry for this user
  const clearCart = useCallback(() => {
    setCartItems([]);
    try { localStorage.removeItem(getCartKey()); } catch { /* ignore */ }
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}
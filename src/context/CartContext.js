// src/context/CartContext.js
import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
            let updatedItems;
            if (existingItemIndex > -1) {
                updatedItems = state.items.map((item, index) =>
                    index === existingItemIndex ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) } : item
                );
            } else {
                updatedItems = [...state.items, { ...action.payload, quantity: (action.payload.quantity || 1) }];
            }
            return { ...state, items: updatedItems };
        }
        case 'REMOVE_ITEM': { // Decrease quantity by 1 or remove if quantity is 1
            const existingItem = state.items.find(item => item.id === action.payload.id);
            let updatedItems;
            if (existingItem && existingItem.quantity > 1) {
                updatedItems = state.items.map(item =>
                    item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                updatedItems = state.items.filter(item => item.id !== action.payload.id);
            }
            return { ...state, items: updatedItems };
        }
        case 'CLEAR_ITEM': // Remove all quantities of a specific item
            return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
        case 'SET_ITEM_QUANTITY': {
            if (action.payload.quantity <= 0) {
                return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
            }
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
                )
            };
        }
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    const addItemToCart = (item, quantity = 1) => dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
    const removeItemFromCart = (itemId) => dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
    const clearItemFromCart = (itemId) => dispatch({ type: 'CLEAR_ITEM', payload: { id: itemId } });
    const setItemQuantityInCart = (itemId, quantity) => dispatch({ type: 'SET_ITEM_QUANTITY', payload: {id: itemId, quantity }});
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const getCartTotalItems = () => state.items.reduce((total, item) => total + item.quantity, 0);
    const getCartTotalPrice = () =>
        state.items.reduce((total, item) => {
            const price = parseFloat(String(item.price).replace('$', ''));
            return total + (price * item.quantity);
        }, 0).toFixed(2);


    return (
        <CartContext.Provider value={{
            cartItems: state.items,
            addItemToCart,
            removeItemFromCart,
            clearItemFromCart,
            setItemQuantityInCart,
            clearCart,
            getCartTotalItems,
            getCartTotalPrice
        }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

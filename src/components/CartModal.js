import React from 'react';
import { useCart } from '../context/CartContext';
import './CartModal.css';

const CartModal = ({ onClose }) => {
    const {
        cartItems,
        removeItemFromCart,
        addItemToCart,
        clearItemFromCart,
        getCartTotalPrice,
        clearCart
    } = useCart();

    const handleCheckout = () => {
        alert('Checkout process is not implemented in this demo. Thank you for Browse!');
        onClose(); // Close modal after alert
    };

    return (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cart-modal-title">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2 id="cart-modal-title">Your Basket</h2>
                    <button onClick={onClose} className="close-modal-button" aria-label="Close cart modal">&times;</button>
                </header>
                <div className="modal-body">
                    {cartItems.length === 0 ? (
                        <p className="empty-cart-message">Your basket is currently empty. Explore our menu!</p>
                    ) : (
                        <>
                            <ul className="cart-items-list">
                                {cartItems.map(item => {
                                    const itemTotal = (parseFloat(String(item.price).replace('$', '')) * item.quantity).toFixed(2);
                                    return (
                                        <li key={item.id} className="cart-item">
                                            <div className="item-info">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-unit-price">({item.price} each)</span>
                                            </div>
                                            <div className="item-controls">
                                                <button onClick={() => removeItemFromCart(item.id)} aria-label={`Decrease quantity of ${item.name}`}>-</button>
                                                <span className="item-quantity" aria-label={`Quantity of ${item.name}`}>{item.quantity}</span>
                                                <button onClick={() => addItemToCart(item)} aria-label={`Increase quantity of ${item.name}`}>+</button>
                                            </div>
                                            <span className="item-total-price">${itemTotal}</span>
                                            <button
                                                onClick={() => clearItemFromCart(item.id)}
                                                className="remove-item-button"
                                                aria-label={`Remove all ${item.name} from cart`}
                                            >
                                                &times;
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="cart-summary">
                                <p className="cart-total-price">Total: ${getCartTotalPrice()}</p>
                                <div className="cart-actions">
                                    <button onClick={clearCart} className="action-button clear-cart-button">Clear Basket</button>
                                    <button onClick={handleCheckout} className="action-button checkout-button cta-button">Proceed to Checkout</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartModal;

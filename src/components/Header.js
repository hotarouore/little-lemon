import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import './Header.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import siteLogo from '../assets/logo.png';

const Header = () => {
    const { getCartTotalItems } = useCart();
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const totalItems = getCartTotalItems();

    const toggleCartModal = () => setIsCartModalOpen(!isCartModalOpen);

    return (
        <>
            <header className="header" aria-label="Primary header">
                <Link to="/" className="header-logo-link" aria-label="Little Lemon Homepage">
                    <img src={siteLogo} alt="Little Lemon logo" className="header-logo-img" />
                    <div className="header-logo-text">Little Lemon</div>
                </Link>
                <Nav />
                <div className="header-actions">

                    <button
                        onClick={toggleCartModal}
                        className="header-action-button cart-button"
                        aria-label={`View your shopping cart, ${totalItems} items`}
                        aria-live="polite"
                    >
                        <FontAwesomeIcon icon={faShoppingCart} aria-hidden="true" /> Basket
                        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </button>
                </div>
            </header>
            {isCartModalOpen && <CartModal onClose={toggleCartModal} />}
        </>
    );
};

export default Header;

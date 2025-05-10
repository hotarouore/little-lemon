import React from 'react';
import { Link } from 'react-router-dom';
import { menuCategories } from '../menuData';
import { useCart } from '../context/CartContext';
import './ContentPage.css';
import './MenuPage.css';

const MenuPage = () => {
    const { addItemToCart } = useCart();

    const handleAddItemToCart = (item) => {
        addItemToCart(item);
        alert(`${item.name} has been added to your basket!`); // Simple user feedback
    };

    return (
        <main className="content-page menu-page-layout">
            <div className="container">
                <h1>Discover Our Menu</h1>
                <p className="menu-intro">
                    Explore a wide variety of authentic Mediterranean dishes, crafted with the freshest ingredients
                    and a passion for flavor. From classic appetizers to hearty main courses and delightful desserts,
                    there's something for everyone at Little Lemon.
                </p>

                {menuCategories.map((category) => (
                    <section key={category.name} className="menu-category-section" aria-labelledby={`category-title-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <h2 id={`category-title-${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="menu-category-title">{category.name}</h2>
                        <div className="menu-items-grid">
                            {category.items.map((item) => (
                                <article key={item.id} className="menu-item-card">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="menu-item-image"
                                    />
                                    <div className="menu-item-details">
                                        <header className="menu-item-header">
                                            <h3 className="menu-item-name">{item.name}</h3>
                                            <p className="menu-item-price">{item.price}</p>
                                        </header>
                                        <p className="menu-item-description">{item.description}</p>
                                        <button
                                            onClick={() => handleAddItemToCart(item)}
                                            className="add-to-basket-button cta-button"
                                            aria-label={`Add ${item.name} to basket`}
                                        >
                                            Add to Basket
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
                <div className="menu-page-cta-section">
                    <p>Ready to experience these flavors?</p>
                    <Link to="/booking" className="cta-button">Reserve Your Table</Link>
                </div>
            </div>
        </main>
    );
};

export default MenuPage;
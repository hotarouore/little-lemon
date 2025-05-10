
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ReservationProvider } from './context/ReservationContext';
import { CartProvider } from './context/CartContext';

const renderAppWithProviders = () => {
  return render(
      <AuthProvider>
        <ReservationProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ReservationProvider>
      </AuthProvider>
  );
};

describe('App Component', () => {
  test('renders the Little Lemon header text or logo', () => {
    renderAppWithProviders();
    const headerElements = screen.getAllByText(/little lemon/i);
    expect(headerElements.length).toBeGreaterThan(0);
    const header = screen.getByRole('banner', { name: /primary header/i });
    expect(within(header).getByText(/Little Lemon/i)).toBeInTheDocument();
  });

  test('renders main navigation links', () => {
    renderAppWithProviders();
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(within(nav).getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /menu/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /reservations/i })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  test('renders the footer with copyright information', () => {
    renderAppWithProviders();
    expect(screen.getByText(/© \d{4} Little Lemon Restaurant. All Rights Reserved./i)).toBeInTheDocument();
  });

});
